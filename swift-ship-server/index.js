import cors from 'cors';
import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

import Stripe from 'stripe';

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.DATABASE_URI;
const stripe = new Stripe(process.env.STRIPE_SECRET);
// console.log(stripe);

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
        },
        success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
      });

      res.json({ url: session.url });
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
