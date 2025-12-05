import cors from 'cors';
import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';

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

    // parcel API
    app.get('/parcels', async (req, res) => {});
    app.post('/parcels', async (req, res) => {
      const parcel = req.body;

      const result = await parcelCollection.insertOne(parcel);

      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
