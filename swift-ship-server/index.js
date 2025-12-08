import cors from 'cors';
import express from 'express';
import admin from 'firebase-admin';
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

const decoded = Buffer.from(
  process.env.FIREBASE_SERVICE_KEY,
  'base64'
).toString('utf8');

const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// middleware
app.use(cors());
app.use(express.json());

const verifyFBToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' });
  }

  try {
    const idToken = token.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    // console.log('decoded in the token', decoded);
    req.decoded_email = decoded.email;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
};

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
    const userCollection = db.collection('users');
    const parcelCollection = db.collection('parcels');
    const paymentCollection = db.collection('payments');
    const ridersCollection = db.collection('riders');
    const trackingsCollection = db.collection('trackings');

    // middle admin before allowing admin activity
    // must be used after verifyFBToken middleware
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded_email;
      const query = { email };
      const user = await userCollection.findOne(query);

      if (!user || user.role !== 'admin') {
        return res.status(403).send({ message: 'forbidden access' });
      }

      next();
    };

    const logTracking = async (trackingId, status) => {
      const log = {
        trackingId,
        status,
        details: status.split('_').join(' '),
        createdAt: new Date(),
      };
      const result = await trackingsCollection.insertOne(log);
      return result;
    };

    //! users APIs
    // get users
    app.get('/users', verifyFBToken, async (req, res) => {
      const searchText = req.query.searchText;
      const query = {};

      if (searchText) {
        // query.displayName = {$regex: searchText, $options: 'i'}
        query.$or = [
          { displayName: { $regex: searchText, $options: 'i' } },
          { email: { $regex: searchText, $options: 'i' } },
        ];
      }

      const result = await userCollection
        .find(query)
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

      res.send(result);
    });

    // register user to the db
    app.post('/users', async (req, res) => {
      const user = req.body;
      user.role = 'user';
      user.createdAt = new Date();
      const email = user.email;
      const userExists = await userCollection.findOne({ email });

      if (userExists) {
        return res.json({ message: 'user exists' });
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // get specific user by id
    app.get('/users/:id', async (req, res) => {});

    // get user role
    app.get('/users/:email/role', verifyFBToken, async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await userCollection.findOne(query);
      res.send({ role: user?.role || 'user' });
    });

    // change user role to admin or vice-versa
    app.patch(
      '/users/:id/role',
      verifyFBToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const roleInfo = req.body;
        const query = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: roleInfo.role,
          },
        };
        const result = await userCollection.updateOne(query, updatedDoc);
        res.send(result);
      }
    );

    //! Riders API

    // get all riders or riders info by status
    app.get('/riders', verifyFBToken, verifyAdmin, async (req, res) => {
      const { status, district, workStatus } = req.query;

      const query = {};

      if (status) {
        query.status = status;
      }

      if (district) {
        query.district = district;
      }

      if (workStatus) {
        query.workStatus = workStatus;
      }

      const result = await ridersCollection.find(query).toArray();

      res.send(result);
    });

    // register as rider
    app.post('/riders', verifyFBToken, async (req, res) => {
      const rider = req.body;
      rider.status = 'pending';
      rider.createdAt = new Date();

      const result = await ridersCollection.insertOne(rider);
      res.send(result);
    });

    // change user to rider
    app.patch('/riders/:id', verifyFBToken, verifyAdmin, async (req, res) => {
      const status = req.body.status;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: status,
          workStatus: 'available',
        },
      };

      const result = await ridersCollection.updateOne(query, updatedDoc);

      if (status === 'approved') {
        const email = req.body.email;
        const userQuery = { email };
        const updateUser = {
          $set: {
            role: 'rider',
          },
        };
        const userResult = await userCollection.updateOne(
          userQuery,
          updateUser
        );
      }

      res.send(result);
    });

    //! parcels API
    // get parcels data of specific user
    app.get('/parcels', verifyFBToken, async (req, res) => {
      const query = {};
      const { email, deliveryStatus } = req.query;
      if (email) {
        // check email address
        if (email !== req.decoded_email) {
          return res.status(403).json({ message: 'forbidden access' });
        }
        query.senderEmail = email;
      }

      if (deliveryStatus) {
        query.deliveryStatus = deliveryStatus;
      }

      const options = { sort: { createdAt: -1 } };
      const parcels = await parcelCollection.find(query, options).toArray();

      res.json(parcels);
    });

    // get parcels for riders
    app.get('/parcels/rider', async (req, res) => {
      const { riderEmail, deliveryStatus } = req.query;
      const query = {};

      if (riderEmail) {
        query.riderEmail = riderEmail;
      }
      if (deliveryStatus !== 'parcel_delivered') {
        // query.deliveryStatus = {$in: ['driver_assigned', 'rider_arriving']}
        query.deliveryStatus = { $nin: ['parcel_delivered'] };
      } else {
        query.deliveryStatus = deliveryStatus;
      }

      const result = await parcelCollection.find(query).toArray();
      res.send(result);
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

    // update parcel with rider and delivery info
    app.patch('/parcels/:id', async (req, res) => {
      const { riderId, riderName, riderEmail } = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const updatedDoc = {
        $set: {
          deliveryStatus: 'driver_assigned',
          riderId: riderId,
          riderName: riderName,
          riderEmail: riderEmail,
        },
      };

      const result = await parcelCollection.updateOne(query, updatedDoc);

      // update rider information
      const riderQuery = { _id: new ObjectId(riderId) };
      const riderUpdatedDoc = {
        $set: {
          workStatus: 'in_delivery',
        },
      };
      const riderResult = await ridersCollection.updateOne(
        riderQuery,
        riderUpdatedDoc
      );

      res.json(riderResult);
    });

    // update parcel delivery status by the rider
    app.patch('/parcels/:id/status', async (req, res) => {
      const { deliveryStatus, riderId, trackingId } = req.body;

      const query = { _id: new ObjectId(req.params.id) };

      const updatedDoc = {
        $set: {
          deliveryStatus: deliveryStatus,
        },
      };

      if (deliveryStatus === 'parcel_delivered') {
        // update rider information
        const riderQuery = { _id: new ObjectId(riderId) };
        const riderUpdatedDoc = {
          $set: {
            workStatus: 'available',
          },
        };
        const riderResult = await ridersCollection.updateOne(
          riderQuery,
          riderUpdatedDoc
        );
      }

      const result = await parcelCollection.updateOne(query, updatedDoc);
      // log tracking
      logTracking(trackingId, deliveryStatus);

      res.send(result);
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
    // get payment data of specific user
    app.get('/payments', verifyFBToken, async (req, res) => {
      const { email } = req.query;

      const query = {};

      if (email) {
        // check email address
        if (email !== req.decoded_email) {
          return res.status(403).json({ message: 'forbidden access' });
        }

        query.customer_email = email;
      }

      const payments = await paymentCollection
        .find(query)
        .sort({ paidAt: -1 })
        .toArray();

      res.json(payments);
    });

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

      // console.log(session);

      const transactionId = session.payment_intent;

      // Close guard if payment exist
      const isPaymentExist = await paymentCollection.findOne({
        transactionId,
      });

      // console.log(isPaymentExist);

      if (isPaymentExist) {
        return res.json({
          message: 'already exists',
          transactionId,
          trackingId: isPaymentExist.trackingId,
        });
      }

      const trackingId = generateTrackingId();

      if (session.payment_status === 'paid') {
        const id = session.metadata.parcelId;

        const update = {
          $set: {
            paymentStatus: 'paid',
            deliveryStatus: 'pending-pickup',
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
          transactionId,
          paymentStatus: session.payment_status,
          paidAt: new Date(),
          trackingId,
        };

        const paymentResult = await paymentCollection.insertOne(paymentData);

        return res.json({
          success: true,
          modifyParcel: updateResult,
          paymentInfo: paymentResult,
          trackingId,
          transactionId,
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
