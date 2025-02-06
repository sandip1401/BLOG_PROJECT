const express=require('express')
const app=express()
const connectDB = require('./db/db');
connectDB();
require("dotenv").config();

const bodyParser=require('body-parser');
app.use(bodyParser.json());
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log('Listening on port 3000');
})

const userRoutes=require('./routes/userRoutes');
const postRoutes=require('./routes/postRoutes');

app.use('/user',userRoutes);
app.use('/post',postRoutes);