const {
  services,
  dbConnection,
  serviceById,
  createOrder,
  availableQty,
  deleteOrderById,
  addUser,
  getUser,
  getAllUser,
  updateUser,
  changeUserRole,
  getAllOrder,
  postReview,
  getAllReview,
  getReviewByEmail,
  postProduct,
  getOrderByUser,
  getOrderById,
  payment,
  deleteUserById,
  editService,
} = require("../controllers/manufacturerControlers");
const {verifyToken} = require('../middlewares/vefiryToken');
const verifyAdmin = require("../middlewares/verifyAdmin");

const router = require("express").Router();

//database connection
router.all("*", dbConnection);

//get all services
router.get("/services", services);

//get order with available quantity
router.put("/availableQty", availableQty);

//get single service by id
router.get("/service/:id", serviceById);

//edit service
router.put('/edit/:id', editService);

//post order
router.post("/createOrder", createOrder);

//get all order
router.get('/orders', getAllOrder)

//get order by user
router.get('/orders/:email', verifyToken, getOrderByUser);

//get order by id
router.get('/getOrder/:id', verifyToken, getOrderById);

//order delete by id
router.delete('/orders/:id', verifyToken, deleteOrderById);

//add or update user in database
router.put('/addUser/:email', addUser);

//update user
router.put('/updateUser/:email', updateUser);

//change user role
router.put('/userRole/:email', changeUserRole);

//get all user
router.get('/allUser', getAllUser);

//get single user from database
router.get('/user/:email', getUser);

//delete user
router.delete('/user/:id', deleteUserById)

//post review
router.post('/addReview', verifyToken, postReview);

//get all review
router.get('/review', getAllReview);

//get review by user
router.get('/review/:email', verifyToken, getReviewByEmail);

//post product
router.post('/addProduct', verifyToken, postProduct);

//payment route
router.post('/payment', verifyToken, payment);

module.exports = router;
