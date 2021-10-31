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
        const orderCollection =database.collection("orders");
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
       //Get APi
       app.get("/services/:id",async(req,res)=>{
         const id=req.params.id;
         console.log(id)
         const query ={_id:ObjectId(id)};
         const result = await serviceCollection.findOne(query);
         res.send(result)
       })
     //post order to get order 
     app.post("/orders",async(req,res)=>{
      const orders =req.body;
      const result = await  orderCollection.insertOne(orders);
      res.json(result)
     })
      //Get API
      app.get("/orders",async(req,res)=>{
        const cursor=orderCollection.find({});
        const orders =await cursor.toArray();
        res.send(orders);
      })
      //api get single data
      app.get("/orders/:id",async(req,res)=>{
        const id=req.params.id;
         console.log(id)
         const query ={_id:ObjectId(id)};
         const result = await orderCollection.findOne(query);
         res.send(result)

      })
      //api delete
      app.delete("/orders/:id",async(req,res)=>{
        const id=req.params.id;
        const query ={_id:ObjectId(id)};
        const result = await orderCollection.deleteOne(query);
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