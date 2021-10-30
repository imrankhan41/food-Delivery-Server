const express = require('express')
var cors = require('cors')
require('dotenv').config()
const app = express()
const port =process.env.PORT|| 5000

app.use(cors());
const ObjectId = require("mongodb").ObjectId;
app.use(express.json());
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irhuk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
async function run(){
    try {
        await client.connect();
        const database = client.db("foodDelivery");
        const serviceCollection = database.collection("services");
        //Get API
        app.get("/services",async(req,res)=>{
          const cursor=serviceCollection.find({});
          const services =await cursor.toArray();
          res.send(services);
        })
        //Post API
       app.post("/services",async(req,res)=>{
         const services =req.body;
         const result = await  serviceCollection.insertOne(services);
         res.json(result)
       })
     
      } finally {
        // await client.close();
      }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})