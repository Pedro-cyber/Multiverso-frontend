const express = require('express');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');


const eventsRoutes= require('./routes/events');
const userRoutes= require('./routes/user');
const chatRoutes = require('./routes/chat')
const path = require('path');

const app = express();


mongoose.connect("mongodb+srv://peter2:lOSumLG9LxSBcm7N@cluster0.deq5o.mongodb.net/multiverso?retryWrites=true&w=majority",
 { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
  console.log('Connected to database!')
}).catch((err)=> {
  console.log('Connection failed!', err)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/", express.static(path.join(__dirname, "angular")));


app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use('/api/events', eventsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});


module.exports = app;
