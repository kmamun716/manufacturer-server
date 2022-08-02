const { MongoClient, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1juc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const verifyAdmin=(req, res, next)=>{
    const email = req.query.email;
    client.connect(err=>{
        const db = client.db("tools-manufacturer");
        const usersCollection = db.collection('users');
        const user = usersCollection.find({email: email});
        console.log(user)
        if(user.role === "admin"){
          req.access = true;
        }else{
          res.status(401).send({message: 'You Are Not Admin'})
        }
    })
  }
module.exports = verifyAdmin;