const path = require("path")
const bodyParser = require("body-parser");
const express = require("express")

const app = express()
const postsRoutes = require('./routes/posts')

const mongoose = require("mongoose")


mongoose.connect("mongodb+srv://kelany:m8Tx!$K2jaa3a4m@cluster0.yplch.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("connected to database")
}).catch(()=>{ 
    console.log("connection failed")
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use("/images",express.static(path.join("backend/images")))


app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH,PUT, DELETE, OPTIONS"
        );
        next();

})

app.use("/api/posts",postsRoutes)



module.exports = app