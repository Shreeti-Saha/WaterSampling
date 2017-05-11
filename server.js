var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));

app.listen(4000);
console.log('server is running on port 4000');