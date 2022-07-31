const {
  services,
  dbConnection,
  serviceById,
  createOrder,
  availableQty,
  getOrderById,
  deleteOrderById,
} = require("../controllers/manufacturerControlers");

const router = require("express").Router();

//database connection
router.all("*", dbConnection);

//get all services
router.get("/services", services);

//get order with available quantity
router.put("/availableQty", availableQty);

//get single service by id
router.get("/service/:id", serviceById);

//post order
router.post("/createOrder", createOrder);

//get order by user
router.get('/orders/:email', getOrderById)

//order delete by id
router.delete('/orders/:id', deleteOrderById)

module.exports = router;
