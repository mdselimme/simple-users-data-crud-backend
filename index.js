const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("@dotenvx/dotenvx").config();

const cors = require("cors");

const app = express();

const port = process.env.PORT || 5250;

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.dopmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("usersDatabase");
    const usersCollection = database.collection("users");

    // Insert Users Data in Mongodb
    app.post("/users", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await usersCollection.insertOne(data);
      console.log(result);
      res.send(result);
    });

    // Find users Data
    app.get("/users", async (req, res) => {
      const data = usersCollection.find();
      const result = await data.toArray();
      res.send(result);
    });

    // Find users Update Data
    app.get("/users/:id", async (req, res) => {
      const userId = req.params.id;
      console.log(userId);
      const query = { _id: new ObjectId(userId) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // Update User Data
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const user = req.body;
      console.log(user);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateUserData = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateUserData,
        options
      );
      res.send(result);
    });

    // Delete Users Data
    app.delete("/users/:id", async (req, res) => {
      const userId = req.params.id;
      console.log("Pleaes delete " + userId);
      const query = { _id: new ObjectId(userId) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Port is running ${port}`);
});
