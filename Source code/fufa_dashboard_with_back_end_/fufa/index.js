const path=require('path')
require('dotenv').config({path:path.join(__dirname, '.env')})
const express=require('express')
const cors =require('cors')
const bodyParser=require('body-parser')
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;



if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);
 
  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
 
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {

  //app server
  var corsOptions = {
    origin: "*"
  };
const app=express()
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.json())
app.use(cors(corsOptions))


app.use(require('./routes/routes'))

app.listen(process.env.PORT,()=>{
    console.log(`App listening on PORT ${process.env.PORT}`)
})
}

