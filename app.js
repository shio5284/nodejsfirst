var express = require ("express");
var path = require("path");
//var routes = require ("./routes")

var mongoose = require('mongoose');
var cookieParser = require("cookie-parser");
var passport = require ("passport");
var session = require ("express-session");
var flash = require ("connect-flash");

var bodyParser = require("body-parser");
var params = require ("./params/params");
var setUpPassport = require("./setuppassport")
var app = express();
//console.log(params);
//mongoose.connect(params.DATABASECONNECTION)
 mongoose.connect(params.DATABASECONNECTION).
  catch(error => handleError(error)); 

 setUpPassport();

/*   async

  try {
 await mongoose.connect(params.DATABASECONNECTION);
} catch (error) {
handleError(error);
} */


//mongoose.connect("mongodb+srv://franciscodelacruz002:p2ssw0rdmon@cluster0.sckh7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//mongoose.connect(params);
//mongoose.connect("mongodb://localhost:27017/ATIBD")

/*const userSchema = new mongoose.Schema({
    name:String,
    age:Number,
    lname:String

});

 const Model = mongoose.model( "user", userSchema );


const emp = new Model({
    name:"franz",
    age: 30,
    lname:"jonh"
    

}) 
emp.save(); */


app.set("port",process.env.PORT||3001);
app.set("views",path.join(__dirname, "views"));
app.set("view engine",'ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
  secret:"jlssjljsljs",
  resave:false,
  saveUninitialized:false
}));

app.use("/uploads",express.static(path.resolve(__dirname, 'uploads')));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); 



//app.use(routes);


app.use("/",require("./routes/web"))

app.use("/api",require("./routes/api"))

app.listen(app.get("port"),function(){
    console.log("The server start at port "+app.get("port"))
});
