/**
 * @author ashutosh
 * @type @call;require
 * main js file
 */
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var path = require('path');
var app = express();
var connect = require('connect');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');//required for passport flash messages
var passport = require('passport');
require('./config/passport')(passport);
var mongoose = require('mongoose');
var User = require('./models/user.js');
var Legislation = require('./models/legislation.js');
var Legislationcontroller = require('./controller/legislation.js');
var Policy = require('./models/policy.js');
var Policycontroller = require('./controller/policy.js');
var Procedure = require('./models/procedure.js');
var Procedurecontroller = require('./controller/procedure.js');
var Usercontroller = require('./controller/user.js');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');// for smtp
var smtpTransport = require('nodemailer-smtp-transport');// for smtp
var util = require('util');
var fileupload = require('fileupload').createFileUpload('/uploadDir').middleware;
var multer  = require('multer');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3300);//this allows the server to set the port otherwise it will default to 3300 as a local sever
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//PATHS
app.use('/public/', serveStatic(path.join(__dirname, '/public'))); //this is required to allow handlebars to recognise the 'public' folder
// PASSPORT CONFIG
app.use(cookieParser());//required by passport to parse cookies?
app.use(require('express-session')({//required for passport (sessions)
    secret: 'ninjatune',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());//required for passport (sessions)? 
app.use(flash());//required for passport flash messages
// for the loged in user 
var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.render('login', {layout: "loginpage", error: req.flash('error')});
}
/* Handle Login POST */
app.post('/login', passport.authenticate('user', {
    successRedirect: '/addresearch',
    failureRedirect: '/addresearch',
    failureFlash: true
}));
// Handle signup POST */
app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/checkmail',
    failureRedirect: '/logout',
    failureFlash: true
            // { message: request.flash('error') }
}));
//ROUTES
app.get('/', function(req, res) {
    console.log('fetching homepage');
    res.render('homepage');
});
// email validation check from database
app.get('/response', function(req, res) {
    User.findOne({'user.email': req.query.email}, function(err, user) {
        if (user) {
            if (!err && user.user.email === req.query.email) {
                res.send({valid: false});
            } else {
                res.send({valid: true});
            }
        } else {
            res.send({valid: true});
        }
    });
});
// attached file method
app.get('/attached', function(req, res) {
 });
var storage=multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now()+file.originalname);
  }
});
var upload = multer({ storage : storage}).single('file');

app.post('/policyupload',function(req, res) {
    //Policycontroller.uploadfiles(req, res);//        
        upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		res.end("File is uploaded");
	});
});
// logout function
app.get('/logout', function(request, response) {
    request.logout();
    response.redirect('/login');
});
//node mailer
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp-relay.gmail.com',
    port: 25,
    name: "alphacalibration.com",
}));
app.get('/checkmail', function(req, res) {
    rand = req.user._id;//create a random variable
    host = req.get('host');//remember the server (i.e host) address
    link = "http://" + req.get('host') + "/verify?id=" + rand;//create a url of the host server
    adminlink = "http://" + req.get('host') + "/adminverify?id=" + rand;//create a url of the host server
    //console.log(link);
    // adminverify
    var mailOptions = {
        from: 'noreply@alphacalibration.com', // sender address
//        to : req.query.to,//recipient email
        to: req.user.user.email, //recipient email
        // cc: 'management@alphacalibration.com',
        subject: "Please confirm your E-mail address",
        html: "Hello " + req.user.user.name + ",<br> Please Click on the link to verify.<br><a href=" + link + ">Click here to verify</a>"
    };
    var secondmailOptions = {
        from: 'noreply@alphacalibration.com', // sender address
//        to : req.query.to,//recipient email
        to: 'ashutosh@avainfotech.com,management@alphacalibration.com', //recipient email
        // cc: 'management@alphacalibration.com',
        subject: "Please confirm your E-mail address",
        html: req.user.user.name + ", has registered to use your tool. Please click if you approve.<br><a href=" + adminlink + ">click to approve</a>"
    };
// send mail with defined transport object
    transporter.sendMail(secondmailOptions);
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        // console.log('Message sent: ' + info.response);
        req.logout();
        res.redirect('/login');
    });
});
// url for password verification       
app.get('/verify', function(req, res) {//url for password verification    
    //console.log(req.query.id);
    Usercontroller.verifyemail(req, res);// for verify email
    res.send('Your account have been sucessfully verified');
});
// url for admin status verification       
app.get('/adminverify', function(req, res) {//url for password verification    
    //console.log(req.query.id);
    Usercontroller.adminverifyemail(req, res);// for verify email
    res.send('you have sucessfully verified to user');
});
//  // for addresearch get all legislation data and generate doc      
app.get('/addresearchdata/:uid', isAuthenticated, function(req, res) {
    Legislationcontroller.generatedoc(req, res);//for send id and generate the doc file
    res.redirect('/addresearch');
});
//  // for addresearch get all policy data and generate doc      
app.get('/genpodoc/:uid', isAuthenticated, function(req, res) {
    Policycontroller.generatedoc(req, res);//for send id and generate the doc file
    res.redirect('/addresearch');
});
//  // for addresearch get all procedure data and generate doc      
app.get('/genprodoc/:uid', isAuthenticated, function(req, res) {
    Procedurecontroller.generatedoc(req, res);//for send id and generate the doc file
    res.redirect('/addresearch');
});
// getting the lesilation data by id
app.get('/addresearchldata/:uid', isAuthenticated, function(req, res) {
    Legislationcontroller.addresearchldata(req, res);//for send id and generate the doc file   
});
// getting the policy data by id
app.get('/addresearchpodata/:uid', isAuthenticated, function(req, res) {
    Policycontroller.getdatabypoid(req, res);//for send id and generate the doc file   
});
// getting the procedure data by id
app.get('/addresearchprodata/:uid', isAuthenticated, function(req, res) {
    Procedurecontroller.getdatabyproid(req, res);//for send id and generate the doc file   
});
// get data for the input field for legislation
app.get('/updateldata/:uid', isAuthenticated, function(req, res) {
    Legislationcontroller.getupdatedata(req, res);//get data for update     
});
// get data for the input field policy
app.get('/updatepodata/:uid', isAuthenticated, function(req, res) {
    Policycontroller.getupdatedata(req, res);//get data for update
});
// get data for the input field procedure
app.get('/updateprodata/:uid', isAuthenticated, function(req, res) {
    Procedurecontroller.getupdatedata(req, res);//get data for update
});
// deleting the procedure data by id
app.get('/deleteldata/:uid', isAuthenticated, function(req, res) {
    Legislationcontroller.deletedatabylid(req, res);//for send id and generate the doc file   
    res.redirect('/addresearch');
});
// deleting the legislation data by id
app.get('/deletepodata/:uid', isAuthenticated, function(req, res) {
    Policycontroller.deletedatabylid(req, res);//for send id and generate the doc file  
    res.redirect('/addresearch');
});
// deleting the policy data by id
app.get('/deleteprodata/:uid', isAuthenticated, function(req, res) {
    Procedurecontroller.deletedatabylid(req, res);//for send id and generate the doc file   
    res.redirect('/addresearch');
});
// for legilation insert 
app.post('/addresearch', function(req, res) {
    console.log('fetching addresearch for legislation');
   // console.log(req.body);
    Legislationcontroller.addlegislation(req, res);
    Legislationcontroller.getalllegislation(req, res);// get the all menu data  
});
// for policy insert 
app.post('/policy', function(req, res) {
    console.log('fetching addresearch for policy');
    Policycontroller.addpolicy(req, res);
    //Legislationcontroller.getalllegislation(req, res);// get the all menu data 
    res.redirect('/addresearch');
});
// for procedure insert 
app.post('/procedure', function(req, res) {
    console.log('fetching addresearch for procedure');
    Procedurecontroller.addprocedure(req, res);
   // Legislationcontroller.getalllegislation(req, res);// get the all menu data
    res.redirect('/addresearch');
});
// for compliance page
app.get('/compliance', function(req, res) {
    console.log('fetching compliance page');
    res.render('compliance');
});
//for about us page
app.get('/aboutus', function(req, res) {
    console.log('fetching aboutus page');
    res.render('aboutus');
});
//for  documentation page
app.get('/documentation', function(req, res) {
    console.log('fetching documentation page');
    res.render('documentation');
});
// for resources page
app.get('/resources', function(req, res) {
    console.log('fetching resources page');
    res.render('resources');
});
// this is for the login page 
app.get('/addresearch', isAuthenticated, function(req, res) {
    Legislationcontroller.getalllegislation(req, res); // get all menu data
});
// addsearch edit
app.get('/addresearchedit', isAuthenticated, function(req, res) {
    //Legislationcontroller.getalllegislationforedit(req, res); // get all menu data
});
// addsearch update
app.get('/addresearchupdate', isAuthenticated, function(req, res) {
    // Legislationcontroller.getupdatedata(req,res);//for send id and generate the doc file   
    // res.render('addresearchupdate',{layout:'login'});   
});
// for update legislation  
app.post('/postupdateldata', function(req, res) {
    Legislationcontroller.updatedatabylid(req, res);
    res.redirect('/addresearch');
});
// for update policy  
app.post('/addresearchupdatepolicy', function(req, res) {
    Policycontroller.updatedatabylid(req, res);
    res.redirect('/addresearch');
});
// for update procedure  
app.post('/addresearchupdateprocedure', function(req, res) {
    Procedurecontroller.updatedatabylid(req, res);
    res.redirect('/addresearch');
});
// this is for the login page 
app.get('/login', isAuthenticated, function(req, res) {
    console.log('fetching login');
    res.render('addresearch', {layout: "login"});
});
// admin dashboard for dashboard
app.get('/admin', function(req, res) {
    console.log('fetching admin login');
    res.render('admin', {layout: "admin"});
});
//mongodb remote server connection
mongoose.connect('mongodb://node_fwrk1:node_fwrk1@ds061385.mongolab.com:61385/alphacalibration');
mongoose.connection.on('open', function() {
    console.log('Mongoose connected');
});
//LISTEN TO PORT
var server = app.listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});