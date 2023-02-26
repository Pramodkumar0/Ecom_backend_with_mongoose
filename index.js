
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./User')

async function run(){
    try{
        
    await mongoose.connect("")
    console.log('connected');
    
   // await mongoose.connect("mongodb://127.0.0.1:27017/LoginDeatils")

   await mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2")

   console.log('connected');
        // const user = new User({,email:"pramodkumar@gmail.com",password:"9849615686"})
        // const result = await User.insertMany(user)
        // console.log(result);
        // mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2
    }
    
    catch(er){
        console.log(er);
    }
}
run();

const app = express();
app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('Welcome to Ecom Api')
})

app.post('/register',async (req,res)=>{
    const { name,email,password } = req.body
    console.log( name,email,password);
    try{
        const oldUser = await User.find({email})
        if(oldUser.length!==0){
            console.log(oldUser);
            return res.send({error:"User Already Exists"})
        }
        const hashPass = await bcrypt.hash(password,7)
        const user = new User({name,email,password:hashPass})

        const result = await User.insertMany(user);
        res.send({status:"ok"})

        console.log('registered');
        console.log(result);
    }
    catch(er){
        res.send({status:"error"})
        console.log(er);
    }
})

const SECRET_KEY = "hekrjn8f45tkjsdf234h45j"
app.post('/login',async (req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.json({error:"User not found"})
    }
    if(await bcrypt.compare(password,user.password)){
        const token = jwt.sign({},SECRET_KEY);
        console.log(user,"hello");
        if(res.status(201)){
            return res.json({status:"ok",data:token,name:user.name})
        }else{
            return res.json({error: "error"})
        }
    }
    res.json({ status:"error",error:"Invalid Password"})
});

app.listen(5400,()=>{
    console.log('server started');
})