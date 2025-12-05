import cors from 'cors';
import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

import crypto from 'node:crypto';
import Stripe from 'stripe';

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.DATABASE_URI;
const stripe = new Stripe(process.env.STRIPE_SECRET);
// console.log(stripe);

function generateTrackingId() {
  const prefix = 'PRCL'; // your brand prefix
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const random = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-char random hex

  return `${prefix}-${date}-${random}`;
}

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationError: true,
  },
});

// Basic Routing
app.get('/', (req, res) => {
  res.send(`<h1>Hello World</h1>`);
});

async function run() {
  try {
    const db = client.db('swiftShipDB');
    const parcelCollection = db.collection('parcels');
    const paymentCollection = db.collection('payments');

    //! parcels API

    // get parcels data of specific user
    app.get('/parcels', async (req, res) => {
      const query = {};
      const { email } = req.query;
      if (email) {
        query.senderEmail = email;
      }

      const options = { sort: { createdAt: -1 } };
      const parcels = await parcelCollection.find(query, options).toArray();

      res.json(parcels);
    });

    // get specific parcel
    app.get('/parcel/:id', async (req, res) => {
      const { id } = req.params;

      const parcel = await parcelCollection.findOne({ _id: new ObjectId(id) });

      // console.log(parcel);

      res.json(parcel);
    });

    // create new parcel
    app.post('/parcels', async (req, res) => {
      const parcel = req.body;

      // percel created time
      parcel.createdAt = new Date();

      const result = await parcelCollection.insertOne(parcel);

      res.json(result);
    });

    // delete parcel
    app.delete('/parcels/:id', async (req, res) => {
      const { id } = req.params;

      const result = await parcelCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });

    //! Payment Related APIs
    // create payment session
    app.post('/create-checkout-session', async (req, res) => {
      const paymentInfo = req.body;
      const amount = parseInt(paymentInfo.cost) * 100;

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'bdt',
              product_data: {
                name: `Please pay for ${paymentInfo.parcelName}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: paymentInfo.senderEmail,
        metadata: {
          parcelId: paymentInfo.parcelId,
          parcelName: paymentInfo.parcelName,
        },
        success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
      });

      res.json({ url: session.url });
    });

    //verify payment
    app.patch('/payment-success', async (req, res) => {
      const { session_id } = req.query;

      const session = await stripe.checkout.sessions.retrieve(session_id);

      const trackingId = generateTrackingId();

      // console.log(session);

      if (session.payment_status === 'paid') {
        const id = session.metadata.parcelId;

        const update = {
          $set: {
            paymentStatus: 'paid',
            trackingId,
          },
        };

        const updateResult = await parcelCollection.updateOne(
          { _id: new ObjectId(id) },
          update
        );

        const paymentData = {
          amount: session.amount_total / 100,
          currency: session.currency,
          customer_email: session.customer_email,
          parcelId: session.metadata.parcelId,
          parcelName: session.metadata.parcelName,
          transactionId: session.payment_intent,
          paymentStatus: session.payment_status,
          paidAt: new Date(),
        };

        const paymentResult = await paymentCollection.insertOne(paymentData);

        res.json({
          success: true,
          modifyParcel: updateResult,
          paymentInfo: paymentResult,
          trackingId,
          transactionId: session.payment_intent,
        });
      }

      res.json({ success: false });
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
