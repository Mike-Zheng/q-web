var fs = require("fs");
var host = "127.0.0.1";
var port = 1337;
var express = require("express");

var app = express();
app.use(express.static(__dirname )); //use static files in ROOT/public folder


var server = app.listen(port, function (){
  
  console.log('Start app at http://%s:%s', host, port);
});

