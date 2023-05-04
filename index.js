const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// car-doctor-4536
// LkOxNnuqNKU7vbCa
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.akdhqyq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("car-doctor").collection("services");
    const orderCollection = client.db("car-doctor").collection("orders");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const service = await cursor.toArray();
      res.send(service);
    });

    app.get("/service/:id", async (req, res) => {
      // console.log(req.params);
      const id = req.params.id;
      // console.log("id", id);
      const query = { _id: new ObjectId(id) };
      // console.log(query);
      const result = await serviceCollection.findOne(query);
      // console.log(result);

      res.send(result);
    });

    // order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
    app.get("/orders", async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });
  } catch (error) {}
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send(`server is running `);
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
