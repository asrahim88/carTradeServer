const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config()
const port = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;


const app = express();
app.use(cors());
app.use(bodyParser.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cglq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err);
  const collection = client.db("freshValley").collection("products");

  // post data to Database from clint page or site
  app.post('/addData', (req, res) => {
    const newData = req.body;
    collection.insertOne(newData)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  // get product data from Database to clint site 
  app.get('/productData', (req, res) => {
    collection.find()
      .toArray((error, items) => {
        res.send(items);
      })
  })

  // get single data from database to clint site start
  app.get('/singleProduct/:id', (req, res) => {
    const id = req.params.id;
    collection.find({ _id: ObjectId(req.params.id) })
      .toArray((error, result) => {
        res.send(result[0]);
      })
  })

  // checkOutPost data to Database
  const oderCollection = client.db("freshValley").collection("orders");
  app.post("/checkOutData", (req, res) => {
    const checkOut = req.body;
    oderCollection.insertOne(checkOut)
      .then((result) => {
        res.send(result.insertedCount > 0);
      })
  })

  // CheckOut get data from Database
  app.get("/checkOutUserGet", (req, res) => {
    // console.log('specific user',req.query.email);
    oderCollection.find({email: req.query.email})
      .toArray((error, doc) => {
        res.send(doc);
      })
  })
  
  // Delete Item
  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0 )
    })
  })

});

// mongodb



// get  data start
app.get('/', (req, res) => {
  res.send('Hello World!')
})
// get data end



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})