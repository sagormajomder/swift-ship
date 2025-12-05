import cors from 'cors';
import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.DATABASE_URI;

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

    // get parcels data
    app.get('/parcels', async (req, res) => {
      const query = {};
      const { email } = req.query;
      if (email) {
        query.senderEmail = email;
      }
      const parcels = await parcelCollection.find(query).toArray();

      res.json(parcels);
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
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
