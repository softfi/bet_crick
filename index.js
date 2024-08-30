import express from "express";
import https from "https";
import http from "http";
import fs from 'fs';
import bodyParser from "body-parser";
import { PORT } from "./config/config.js";
import { api } from "./routes/api.js";
import database from "./config/database.js";   // Database Connection load
import User from "./models/User.js";
const app = express();

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use('/api', api);

/*********************
    SSL CERTIFICATE 
**********************/

const privateKey = fs.readFileSync('./ssl/credentials/privekey.pem', 'utf8');
const certificate = fs.readFileSync('./ssl/credentials/cert.pem', 'utf8');
const chain = fs.readFileSync('./ssl/credentials/chain.pem', 'utf8');


 const credentials = {
 	key: privateKey,
 	cert: certificate,
 	ca: chain
 };


/* Not Fround Handler 404 */
app.get('*', (req, res)=>{
    res.status(404).send({status: false, msg: "Not Found"})
});

app.post('*', (req, res)=>{
    res.status(404).send({status: false, msg: "Not Found"})
});

/**********************
   APPLICATION LISTER
***********************/
// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`);
// });

/********************************************
    APPLICATION LISTER HTTP & HTTPS SERVERS
*********************************************/
// Starting both http & https servers
// const httpServer = http.createServer(app);
 const httpsServer = https.createServer(credentials, app);

/ WEBSOCEKT ROUTE END /

// httpServer.listen(PORT,()=>{
//    console.log(`Server is running on port ${PORT}`);
// });

 httpsServer.listen(PORT,()=>{
     console.log(`Server is running on port ${PORT}`);
 });