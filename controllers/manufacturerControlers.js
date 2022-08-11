const { MongoClient, ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
const stripe =require('stripe')(process.env.STRIPE_SECRET_KEY);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1juc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let serviceCollection;
let orderCollection;
let usersCollection;
let reviewsCollection;


module.exports = {
  dbConnection: function (req, res, next) {
    client.connect((err) => {
      const db = client.db("tools-manufacturer");
      serviceCollection = db.collection("services");
      orderCollection = db.collection("orders");
      usersCollection = db.collection("users");
      reviewsCollection = db.collection("review");
      next();
    });
  },
  //get all services
  services: async function (req, res) {
    const query = {};
    const cursor = serviceCollection.find(query).sort({_id:-1});
    const services = await cursor.toArray();
    res.send(services);
  },
  //get service by id
  serviceById: async function(req, res){
    const id = req.params.id;
    const service = await serviceCollection.findOne({_id: ObjectId(id)});
    res.send(service)
  },
  //for order
  createOrder: async (req, res)=>{
    const order = req.body;
    const setOrder = await orderCollection.insertOne(order);
    res.send(setOrder)
  },
  //available qty for services
  availableQty: async(req, res)=>{
    const orderdQty = req.body.qty;
    const serviceId = req.body.serviceId;
    const query = {_id: ObjectId(serviceId)};
    const orderedService = await serviceCollection.findOne(query);
    const newQty = orderedService.available-orderdQty;
    const filter = { _id: ObjectId(serviceId) };
    const options = { upsert: true };
    const updateDoc = {
      $set:{available: newQty}
    }
    const result = await serviceCollection.updateOne(filter, updateDoc, options);
    res.send(result)
  },
  //get order by user email
  getOrderByUser: async(req, res)=>{
    const requestedUser = req.user;
    const user = req.params.email;
    if(requestedUser.email === user){
      const orders = await orderCollection.find({email: user}).toArray();
      res.send(orders)
    }else{
      res.status(403).send({message: 'Forbidden Access'})
    }
  },
  getOrderById: async (req, res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)}
    const result = await orderCollection.findOne(query);
    res.send(result)
  },
  deleteOrderById: async(req, res)=>{
    const order = req.params.id;
    const query={_id: ObjectId(order)}
    const result = await orderCollection.deleteOne(query);
    res.send(result)
  },
  addUser: async(req, res)=>{
    const email = req.params.email;
    const user = req.body;
    const filter = { email: email };
    const options = { upsert: true };
    const updatedDoc = {
      $set: user,
    };
    const result = await usersCollection.updateOne(filter, updatedDoc, options);
    const token = jwt.sign({ email: email }, process.env.SECRET, {
      expiresIn: "2h",
    });
    res.send({ result, accessToken: token });
  },
  getUser: async(req, res)=>{
    const email = req.params.email;
    const query = {email: email};
    const user = await usersCollection.findOne(query);
    res.send(user)
  },
  getAllUser: async(req, res)=>{
    const users = await usersCollection.find({}).toArray();
    res.send(users)
  },
  updateUser:async(req, res)=>{
    const email = req.params.email;
    const user = req.body;
    const filter = { email: email };
    const options = { upsert: true };
    const updatedDoc = {
      $set: user,
    };
    const result = await usersCollection.updateOne(filter, updatedDoc, options);
    res.send(result)
  },
  deleteUserById: async(req, res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await usersCollection.deleteOne(query);
    res.send(result);
  },
  changeUserRole: async(req, res)=>{
    const email = req.params.email;
    const user = req.body;
    const filter = { email: email };
    const updatedDoc = {
      $set: user,
    };
    const result = await usersCollection.updateOne(filter, updatedDoc);
    res.send(result)
  },
  getAllOrder: async(req, res)=>{
    const orders = await orderCollection.find({}).toArray();
    res.send(orders)
  },
  postReview: async(req, res)=>{
    const review = req.body;
    const submitedReview = await reviewsCollection.insertOne(review);
    res.send(submitedReview)
  },
  getAllReview: async (req, res)=>{
    const reviews = await reviewsCollection.find({}).toArray();
    res.send(reviews);
  },
  getReviewByEmail: async (req, res)=>{
    const email = req.params.email;
    const review = await reviewsCollection.find({email: email}).toArray();
    res.send(review);
  },
  postProduct: async(req, res)=>{
    const product = req.body;
    const result = await serviceCollection.insertOne(product);
    res.send(result)
  },
  payment: async(req, res)=>{
    const {price} = req.body;
    const amount = price*100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card']
    })
    res.send({clientSecret: paymentIntent.client_secret})
  }
};
