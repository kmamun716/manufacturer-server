const { services, dbConnection, serviceById } = require('../controllers/manufacturerControlers');

const router = require('express').Router();

//database connection
router.all('*', dbConnection)

//get all services
router.get('/services', services)

//get single service by id
router.get('/service/:id', serviceById)


module.exports = router;