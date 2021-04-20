const express = require("express");
const app = express();
const cors = require("cors");
// const fileUpload = require('express-fileupload')
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// MiddleWare
app.use(express.json()); //instead of bodyparser
// app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(express.static('doctors'))
// app.use(fileUpload())

// Server Root
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Connect to Mongodb
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abcuj.mongodb.net//${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log(err);
  const productCollection = client.db("creamy").collection("products");
  const ordersCollection = client.db("creamy").collection("orders");
  const reviewsCollection= client.db("creamy").collection("reviews");
  const adminCollection= client.db("creamy").collection("admins");


  //loading products
    app.get('/products', (req, res) =>{
    productCollection.find()
    .toArray((err, products) =>{
      res.send(products)
    })
  })

  //loading reviews
    app.get('/reviews', (req, res) =>{
      reviewsCollection.find()
    .toArray((err, reviews) =>{
      res.send(reviews)
      // console.log('from db ', products);
    })
  })

    // loading product with an specific id
app.get('/product/:id', (req, res) =>{
  console.log(req.params);
  productCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, products) =>{
    res.send(products[0])
    console.log(products[0])
  })
})

  // sending order to server
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log("adding new Product : ", order);
    ordersCollection.insertOne(order).then((result) => {
      console.log("inserted Count", result);
      res.send(result.insertedCount > 0);
    });
  });

  
  // loading orders filtering with email 
  app.get('/orders', (req, res) =>{
    console.log(req.query.email);
    ordersCollection.find({email : req.query.email})
    .toArray((err, orders) =>{
      res.send(orders)
    })
  })

    //adding a single review by the uder
    app.post("/addReview", (req, res) => {
      const newReview = req.body;
      console.log("adding new review : ", newReview);
      reviewsCollection.insertOne(newReview).then((result) => {
        console.log("inserted Count", result);
        res.send(result.insertedCount > 0);
      });
    });

    //adding a single product by the admin
    app.post("/addProduct", (req, res) => {
      const newProduct = req.body;
      console.log("adding new review : ", newProduct);
      productCollection.insertOne(newProduct).then((result) => {
        console.log("inserted Count", result);
        res.send(result.insertedCount > 0);
      });
    });

// make admin
    app.post('/makeAdmin', (req, res)=>{
      const email = req.body;
      adminCollection.insertOne(email)
      .then(result => {
             res.send(result.insertedCount > 0)
             console.log(result.insertedCount)
         })
 })


// admin verification 
    app.get('/admin', (req, res) => {
      adminCollection.find({ email: req.query.email})
          .toArray((err, documents) => {
              res.send(documents);
          })
  });

  // loading all orders
  app.get('/allOrders', (req, res) => {
    ordersCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});

    //Update state of orders
    app.patch('/order-state/:id', (req, res) => {
        console.log(req.params.id, req.body)
        ordersCollection.updateOne({ _id: ObjectId(req.params.id) }, {
            $set: { state: req.body.state }
        })
            .then(result => {
                if (result.modifiedCount > 0) {
                    res.sendStatus(200);
                    res.send({ "state": `${req.body.state}` })
                    console.log("status added")
                }
            })
            .catch(err => console.log(err))
    });


// });

});

app.listen(process.env.PORT || port);
      
  















