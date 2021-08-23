//jshint esversion:6
require("dotenv").config();
const express=require("express");
// const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encryption=require("mongoose-encryption")

//--database connections
mongoose.connect("mongodb://localhost:27017/UserDB",{useNewUrlParser: true,useUnifiedTopology: true})

//--userSchema
const userSchema= new mongoose.Schema({
    email:String,
    password:String
})
//--encryption
const secret="a";
userSchema.plugin(encryption,{secret:process.env.SECRET,encryptedFields:["password"]})
//--model
const User=new mongoose.model("users",userSchema)
const app=express();

app.use(express.static("public"))
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render("home")
})
app.get("/login",function(req,res){
    res.render("login")
})
app.get("/register",function(req,res){
    res.render("register")
   
})

//----handling post requests


app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if(!err){
            res.render("secrets")
        }
    })
})

app.post("/login",function(req,res){
    User.findOne({email:req.body.username , password:req.body.password},function(err){
        if(!err){
            res.render("secrets")
        }
    })
})











app.listen(3000,function(req,res){
    console.log("server is running on port 3000...")
})