var express = require ("express");
var path = require("path");
var routes = require ("./routes")
var app = express();


app.set("port",process.env.PORT||3001);

app.use(routes);

app.listen(app.get("port"),function(){
    console.log("The server start at port"+app.get(" port"))
});
