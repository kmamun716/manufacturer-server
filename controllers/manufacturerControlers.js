const { MongoClient, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1juc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let serviceCollection;

module.exports = {
  dbConnection: function (req, res, next) {
    client.connect((err) => {
      const db = client.db("tools-manufacturer");
      serviceCollection = db.collection("services");
      next();
    });
  },
  services: async function (req, res) {
    const query = {};
    const cursor = serviceCollection.find(query);
    const services = await cursor.toArray();
    console.log(services);
    res.send(services);
  },
  serviceById: async function(req, res){
    const id = req.params.id;
    const service = await serviceCollection.findOne({_id: ObjectId(id)});
    res.send(service)
  }
};
