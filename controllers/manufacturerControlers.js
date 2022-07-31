const { MongoClient, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1juc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let serviceCollection;
let orderCollection;

module.exports = {
  dbConnection: function (req, res, next) {
    client.connect((err) => {
      const db = client.db("tools-manufacturer");
      serviceCollection = db.collection("services");
      orderCollection = db.collection("orders");
      next();
    });
  },
  //get all services
  services: async function (req, res) {
    const query = {};
    const cursor = serviceCollection.find(query);
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
  getOrderById: async(req, res)=>{
    const user = req.params.email;
    const orders = await orderCollection.find({email: user}).toArray();
    res.send(orders)
  },
  deleteOrderById: async(req, res)=>{
    const order = req.params.id;
    const query={_id: ObjectId(order)}
    const result = await orderCollection.deleteOne(query);
    res.send(result)
  }
};
