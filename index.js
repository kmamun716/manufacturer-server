const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;


//Routes
app.use('/mf',require('./routes/manufacturerRoutes'));

app.get('/',(req, res)=>{
    res.send('server is running')
})


app.listen(port,()=>{
    console.log(`manufacturer server is running at port: ${port}`)
})