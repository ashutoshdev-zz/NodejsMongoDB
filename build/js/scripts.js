var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var app = express();
var connect= require('connect');
var serveStatic = require('serve-static');

console.log('this is the plain branch');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3300);//this allows the server to set the port otherwise it will default to 3300 as a local sever


app.use('/public/',serveStatic(path.join(__dirname, '/public'))); //this is required to allow handlebars to recognise the 'public' folder
console.log("dirpath "+path.join(__dirname, '/public')); //this is required to allow handlebars to recognise the 'build' folder

app.use('/build/',serveStatic(path.join(__dirname, '/build'))); //this is required to allow handlebars to recognise the 'public' folder
console.log("dirpath "+path.join(__dirname, '/build'));

app.get('/', function (req, res) {
    res.render('homepage');
});

var server = app.listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});