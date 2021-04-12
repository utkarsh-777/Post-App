const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
require('dotenv').config();

const {MONGOURI} = require('./keys');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

const PORT = 5000 || process.env.PORT;

app.use(cors());
app.use(bodyparser.json());

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
    console.log('DB connected!');
})

mongoose.connection.on('error',()=>{
    console.log('error in connection');
})

app.use('/api',authRoutes);
app.use('/api',postRoutes);

app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`);
})
