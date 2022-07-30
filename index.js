const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

app.get('/',(req, res)=>{
    res.send('server is running')
})


app.listen(port,()=>{
    console.log(`menufacturer server is running at port: ${port}`)
})