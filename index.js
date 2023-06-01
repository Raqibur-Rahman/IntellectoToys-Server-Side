const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.btjmiui.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)


    const toysCollection = client.db('IntellectoToys').collection('listOfToys');

    app.get('/toys', async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);

      res.send(result);
    })


    //add a toy
    app.post('/addtoy', async (req, res) => {
      const addtoy = req.body;
      console.log(addtoy);


      const result = await toysCollection.insertOne(addtoy);
      res.send(result);
    })

    //My toys
    app.get('/myToys', async (req, res) => {
      console.log(req.query.seller_email);
      let query = {};
      if (req.query?.seller_email) {
        query = { seller_email: req.query.seller_email }
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    })




    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send("Server is running");
})

app.listen(port, () => {
  console.log(`Car Doctor Server is running on port ${port}`);
})