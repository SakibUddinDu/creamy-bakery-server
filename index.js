const express = require("express");
const app = express();
const cors = require("cors");
// const fileUpload = require('express-fileupload')
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// appointments
app.use(express.json()); //instead of bodyparser
// app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(express.static('doctors'))
// app.use(fileUpload())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abcuj.mongodb.net//${process.env.DB_NAME}?retryWrites=true&w=majority`;
//  console.log(uri);
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
      // console.log('from db ', products);
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

    //adding a single review by the admin
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


    app.get('/admin', (req, res) => {
      adminCollection.find({ email: req.query.email})
          .toArray((err, documents) => {
              res.send(documents);
          })
  });

// });


    // user review
    // app.post('/addReview', (req, res) => {
    //           const review = req.body;
    //           console.log(review)
    //           reviewsCollection.insertOne(review)
    //               .then(result => {
    //                   if (result.insertedCount > 0) {
    //                       res.sendStatus(200);
    //                   }
    //               })
    //               .catch(err => console.log(err))
    //       });
      
  //   //Update state of orders
  //   app.patch('/order-state/:id', (req, res) => {
  //     console.log(req.params.id, req.body)
  //     ordersCollection.updateOne({ _id: ObjectId(req.params.id) }, {
  //         $set: { state: req.body.state }
  //     })
  //         .then(result => {
  //             if (result.modifiedCount > 0) {
  //                 res.sendStatus(200);
  //                 res.send({ "state": `${req.body.state}` })
  //             }
  //         })
  //         .catch(err => console.log(err))
  // });


// //sending all products
// app.post("/addItems", (req, res) => {
//   const items = req.body;
//   productCollection.insertMany(items).then((result) => {
//     res.send(result.insertedCount);
//   });
// });

// //sending all reviews
//   app.post("/addReviews", (req, res) => {
//   const reviews = req.body;
//   reviewsCollection.insertMany(reviews).then((result) => {
//     res.send(result.insertedCount);
//   });
// });





//   app.get("/appointments", (req, res) => {
//     appointmentCollection.find({})
//       .toArray((err, documents) => {
//         res.send(documents);
//       });
//   });

//   app.post("/appointmentsByDate", (req, res) => {
//     const date = req.body;
//     // const convertedDate =new Date(date.date).toLocaleDateString()
//     // console.log(convertedDate)
//     console.log(date.date);
//     appointmentCollection
//       .find({ date: date.date })
//       .toArray((err, documents) => {
//         res.send(documents);
//       });
//   });

//   app.post('/addADoctor', (req, res) => {
//     const file = req.files.file;
//     const name = req.body.name;
//     const email = req.body.email;

//  console.log(file, name, email)

//  file.mv(`${__dirname}/doctors/${file.name}`, err =>{
//    if (err){
//      console.log(err);
//      return res.status(500).send({msg: 'Failed to Upload Image'})
//    }
//     doctorsCollection.insertOne({name, email, img:file.name})
//    .then(result =>{
//     console.log(result.insertedCount);
//      res.send(result.insertedCount > 0)
//    })
//   //  return res.send({name:file.name, path: `/${file.name}`})
   
//  })
// })

// app.get('/doctors', (req, res) => {
//   doctorsCollection.find({})
//       .toArray((err, documents) => {
//           res.send(documents);
//       })
// });

//55.5-2 upload img to the server
//   app.post('/addADoctor', (req, res) => {
//     const file = req.files.file;
//     const name = req.body.name;
//     const email = req.body.email;

//  console.log(file, name, email)

//  file.mv(`${__dirname}/doctors/${file.name}`, err =>{
//    if (err){
//      console.log(err);
//      return res.status(500).send({msg: 'Failed to Upload Image'})
//    }
//    return res.send({name:file.name, path: `/${file.name}`})
   
//  })
// })

});

app.listen(process.env.PORT || port);


// creATIVE
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// require('dotenv').config();
// const MongoClient = require('mongodb').MongoClient;
// const fileUpload = require('express-fileupload');
// const fs = require('fs-extra');
// const ObjectId = require('mongodb').ObjectId;

// const { DB_USER, DB_PASS, DB_NAME, PORT } = process.env;

// const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.d5mpt.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(fileUpload())

// client.connect(err => {
//     const servicesCollection = client.db(DB_NAME).collection('ourServices');
//     const feedbacksCollection = client.db(DB_NAME).collection('usersFeedbacks');
//     const ordersCollection = client.db(DB_NAME).collection('orders');
//     const adminsCollection = client.db(DB_NAME).collection('admins');

//     //root
//     app.get('/', (req, res) => {
//         res.send('<h1> Welcome to Creative Agency Database</h1>');
//     });


//     //all services
//     app.get('/services', (req, res) => {
//         servicesCollection.find({})
//             .toArray((err, collection) => {
//                 res.send(collection)
//             })
//     });



//     //all Feedbacks
//     app.get('/feedbacks', (req, res) => {
//         feedbacksCollection.find({})
//             .toArray((err, collection) => {
//                 res.send(collection)
//                 if (err) {
//                     console.log(err)
//                 }
//             })
//     });



//     //all admins
//     app.get('/admins', (req, res) => {
//         adminsCollection.find({})
//             .toArray((err, collection) => {
//                 res.send(collection)
//                 if (err) {
//                     console.log(err)
//                 }
//             })
//     });



//     //all ordersCollection
//     app.get('/orders', (req, res) => {
//         ordersCollection.find({})
//             .toArray((err, collection) => {
//                 res.send(collection)
//                 if (err) {
//                     console.log(err)
//                 }
//             })
//     });



//     //user Orders 
//     app.get('/users-orders', (req, res) => {
//         const user = req.query.email;

//         ordersCollection.find({ email: user })
//             .toArray((err, collection) => {
//                 res.send(collection)
//                 if (err) {
//                     console.log(err)
//                 }
//             })
//     })


//     //add services
//     app.post('/add-services', (req, res) => {
//         const icon = req.files.icon;
//         const iconType = icon.mimetype;
//         const iconSize = icon.size;
//         const serviceData = req.body;
//         const iconData = icon.data;
//         const encIcon = iconData.toString('base64');

//         const convertedIcon = {
//             contentType: iconType,
//             size: parseFloat(iconSize),
//             img: Buffer.from(encIcon, 'base64')
//         };
//         const readyData = { title: serviceData.title, description: serviceData.description, icon: convertedIcon }

//         servicesCollection.insertOne(readyData)
//             .then(result => {
//                 if (result.insertedCount > 0) {
//                     res.sendStatus(200);
//                 }
//             })
//             .catch(err => console.log(err))
//     });


//     //user Feedbacks
//     app.post('/add-feedback', (req, res) => {
//         const feedback = req.body;

//         feedbacksCollection.insertOne(feedback)
//             .then(result => {
//                 if (result.insertedCount > 0) {
//                     res.sendStatus(200);
//                 }
//             })
//             .catch(err => console.log(err))
//     });

//     //add orders by customer
//     app.post('/add-orders', (req, res) => {
//         const projectImg = req.files.projectImg;
//         const type = projectImg.mimetype;
//         const size = projectImg.size;
//         const orderData = req.body;
//         const imgData = projectImg.data;
//         const encImg = imgData.toString('base64');

//         const convertedImg = {
//             contentType: type,
//             size: parseFloat(size),
//             img: Buffer.from(encImg, 'base64')
//         };
//         const readyData = { service: orderData.service, orderDescription: orderData.orderDescription, name: orderData.name, email: orderData.email, price: orderData.price, projectImg: convertedImg, thumbnailType: orderData.thumbnailType, thumbnailImg: orderData.thumbnailImg, serviceDescription: orderData.serviceDescription, state: 'Pending' };

//         ordersCollection.insertOne(readyData)
//             .then(result => {
//                 if (result.insertedCount > 0) {
//                     res.sendStatus(200);
//                 }
//             })
//             .catch(err => console.log(err))
//     });


//     //add admins
//     app.post('/add-admin', (req, res) => {
//         const admin = req.body;
//         adminsCollection.insertOne(admin)
//             .then(result => {
//                 if (result.insertedCount > 0) {
//                     res.sendStatus(200);
//                 }
//             })
//             .catch(err => console.log(err))
//     });

//     //Update state of orders
//     app.patch('/order-state/:id', (req, res) => {
//         console.log(req.params.id, req.body)
//         ordersCollection.updateOne({ _id: ObjectId(req.params.id) }, {
//             $set: { state: req.body.state }
//         })
//             .then(result => {
//                 if (result.modifiedCount > 0) {
//                     res.sendStatus(200);
//                     res.send({ "state": `${req.body.state}` })
//                 }
//             })
//             .catch(err => console.log(err))
//     });


//     console.log(err ? err : "no error")
// });

// app.listen(process.env.PORT || 3100);







// const express = require("express");
// const app = express();
// const cors = require("cors");
// require("dotenv").config();
// const ObjectId = require('mongodb').ObjectId;
// const port = process.env.PORT || 5000;

// app.use(express.json());
// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // sakib
// const MongoClient = require("mongodb").MongoClient;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abcuj.mongodb.net//${process.env.DB_NAME}?retryWrites=true&w=majority`;
// //  console.log(uri);
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   console.log(err);
//   const productCollection = client.db("creamy").collection("products");
// //   const ordersCollection = client.db("grocery").collection("orders");

//   //sending all data to server (fakeData removed)
//   app.post("/addItems", (req, res) => {
//     const item = req.body;
//     productCollection.insertMany(item).then((result) => {
//       res.send(result.insertedCount);
//     });
//   });

//   //Loading all product for Home Page
// //   app.get('/products', (req, res) =>{
// //     productCollection.find()
// //     .toArray((err, products) =>{
// //       res.send(products)
// //       // console.log('from db ', products);
// //     })
// //   })


//   // loading product with an specific id
// app.get('/product/:id', (req, res) =>{
//   console.log(req.params);
//   productCollection.find({_id: ObjectId(req.params.id)})
//   .toArray((err, products) =>{
//     res.send(products[0])
//   })
// })

// // // sending order to server
// //   app.post("/addOrder", (req, res) => {
// //     const order = req.body;
// //     console.log("adding new Product : ", order);
// //     ordersCollection.insertOne(order).then((result) => {
// //       console.log("inserted Count", result);
// //       res.send(result.insertedCount > 0);
// //     });
// //   });

// //   // loading orders filtering with email 
// //   app.get('/orders', (req, res) =>{
// //     // console.log(req.query.email);
// //     ordersCollection.find({email : req.query.email})
// //     .toArray((err, orders) =>{
// //       res.send(orders)
// //     })
// //   })

// //     //adding a single product by the admin
// //     app.post("/addProduct", (req, res) => {
// //       const newProduct = req.body;
// //       console.log("adding new Product : ", newProduct);
// //       productCollection.insertOne(newProduct).then((result) => {
// //         console.log("inserted Count", result);
// //         res.send(result.insertedCount > 0);
// //       });
// //     });

// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
