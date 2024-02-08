import express from "express";
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

/* Not Fround Handler 404 */
app.get('*', (req, res)=>{
    res.status(404).send({status: false, msg: "Not Found"})
});

app.post('*', (req, res)=>{
    res.status(404).send({status: false, msg: "Not Found"})
});

/* Application Lister */
app.listen(PORT,async ()=>{
    console.log(`Server is running on port ${PORT}`);
});