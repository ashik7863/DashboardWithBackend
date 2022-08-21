const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const app = express();
const port=process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Application started and Listening on port ${port}`);
});
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb+srv://ashik123:7872145792@cluster0.iptlfq6.mongodb.net/youth?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));

db.once('open',()=>console.log("Connected to Database"))

//Check schema ***
const playListSc=new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    password:String,
    confirmpassword:String
});

const Playlist=new mongoose.model("users",playListSc);
//******* */


app.post("/sign_up",async(req,res)=>{

    const name = req.body.name;

    const email = req.body.email;

    const phno = req.body.phno;

    const password = req.body.password;

    const confirmpassword=req.body.confirmpassword;

    const data = {

        "name": name,

        "email" : email,

        "phno": phno,

        "password" : password,

        "confirmpassword":confirmpassword
    }

    const userEmail=await Playlist.findOne({email: email});
        
    if(userEmail.email===email){
        res.send("You have already an account....!");
    }

    if(password===confirmpassword){
        db.collection('users').insertOne(data,(err,collection)=>{
            if(err){
                throw err;
            }
            console.log("Record Inserted Successfully");
        });
    }else{
        res.send("Password are not matching....!");
    }

    return res.redirect('index.html')

})

app.get("/",(req,res)=>{

    res.set({

        "Allow-access-Allow-Origin": '*'

    })

    return res.redirect('signup_success.html');

})
//*********Log In*********** */



app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/login", async(req, res) => {
    try{
        const email=req.body.email;
        const password=req.body.password;
        const userEmail= await Playlist.findOne({email: email});
        
        if(userEmail.password===password){
           return res.redirect('dashboard.html');
        }else{
            res.send("Invalid Password");
        }
    }catch(error){
        res.status(400).send("Invalid Email");
    }
  })