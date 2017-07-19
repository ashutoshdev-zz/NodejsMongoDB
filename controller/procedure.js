/**
 * @author ashutosh
 * @type type
 */
var procedure = require('../models/procedure.js');
var policy = require('../models/policy.js');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
var legislation = require('../models/legislation.js');
var fs = require('fs');
var officegen = require('officegen');// for the doc file generator
var docx = officegen('docx'); // for the doc file generator
var http = require('http');
var procedurecontroller = function() {
};
procedurecontroller.prototype = {
    'addprocedure': function(req, res, done) {
        var newlprocedure = new procedure();
        newlprocedure.procedurename = req.body.procedurename;
        newlprocedure.proceduretext = req.body.proceduretext;
        newlprocedure.legislation = req.body.legislation;
        newlprocedure.policy = req.body.policy;
        process.nextTick(function() {
            newlprocedure.save(function(err) {
                if (err) {
                    console.log("Error! Couldn't insert data successfully.");
                }
                else {
                    console.log("You have submitted the data");
                }
            });
        });
    }, 'getdatabyproid': function(req, res) { // get all procedure data 
        process.nextTick(function() {
            procedure.find({'_id': req.params.uid}, function(err, data) {
                res.render('addresearchedit', {'resultprocedure': data, layout: "login"});
            });
        });
    },
    'generatedoc': function(req, res) { // get legislation data by id
        process.nextTick(function() {
            procedure.findOne({'_id': req.params.uid}, function(err, data) {
                console.log('data');
                console.log(data);
                console.log(req.params.uid);
                docx.on('finalize', function(written) {
                    console.log('Finish to create Word file.\nTotal bytes created: ' + written + '\n');
                });
                docx.on('error', function(err) {
                    console.log(err);
                });
                var pObj = docx.createP({align: 'center'});
                pObj.addText('Procedure Data', {bold: true, underline: true});
                //pObj.addImage ( path.resolve(__dirname, 'images_for_examples/image3.png' ) );
                //docx.putPageBreak();
                //1st
                var pObj = docx.createListOfNumbers();
                pObj.addText('Procedure Name:', {bold: true});
                pObj.options.align = 'left';
                pObj.addText('   ' + data.procedurename);
                //2nd
                var pObj = docx.createListOfNumbers();
                pObj.addText('Procedure Text:', {bold: true});
                pObj.options.align = 'left';
                pObj.addText('   ' + data.proceduretext);
                var wordrand = Math.floor((Math.random() * 100000) + 1000000);// generate the random number for the doc file
                var out = fs.createWriteStream(wordrand + 'out.docx');
                out.on('error', function(err) {
                    console.log(err);
                });
                docx.generate(out);
                console.log(out.path);
//               var request = http.get("http://localhost:3300/"+out.path, function(response) {
//                    response.pipe(out);
//                        out.on('finish', function() {
//      out.close();
//    });
//                  });
            });
        });
    },
    'deletedatabylid': function(req, res) {
        process.nextTick(function() {
            procedure.remove({'_id': req.params.uid}, function(err, data) {
                console.log(data);
                //es.render('addresearchedit', {'lresult': data, layout: "login"});
            });
        });
    }, 'updatedatabylid': function(req, res) {
        process.nextTick(function() {
            procedure.update({'_id': req.body.id}, {$set: {'procedurename': req.body.procedurename, 'proceduretext': req.body.proceduretext, 'legislation': req.body.legislation, 'policy': req.body.policy}}, function(err, results) {
            });
        });
    }, 'getupdatedata': function(req, res) { // get all legislative data by id
        var alldata = [];
        process.nextTick(function() {
            policy.find({}, function(err, policydata) {
                alldata['podata'] = policydata;
            });
            procedure.find({}, function(err, proceduredata) {
                alldata['prodata'] = proceduredata;
            });
            legislation.find({}, function(err, d) {
                alldata['ldata'] = d;
            });
             procedure.findOne({'_id': req.params.uid}, function(err, sdata) {              
                if (sdata.legislation) {
                    var asdfghk=[];
                    var spldata = sdata.legislation.split(',');   
                    var j=0;
                    for (i in spldata) {  
                       // console.log(i);
                        legislation.findOne({'_id': spldata[i]}, function(err, seldata) {
                         //  console.log(seldata.policyname);                            
                           localStorage.setItem('mainheadinga',seldata.mainheading);
                        }); 
                             asdfghk[j]=localStorage.getItem('mainheadinga');
                             // console.log(j);
                             localStorage.removeItem('mainheadinga');
                             j++;
                    }                      
                }
                 if (sdata.policy) {
                    var asdfghkpro=[];
                    var spldata = sdata.policy.split(',');   
                    var j=0;
                    for (i in spldata) {  
                       // console.log(i);
                        policy.findOne({'_id': spldata[i]}, function(err, seldata) {
                         //  console.log(seldata.policyname);                            
                           localStorage.setItem('pa',seldata.policyname);
                        }); 
                             asdfghkpro[j]=localStorage.getItem('pa');
                             // console.log(j);
                             localStorage.removeItem('pa');
                             j++;
                    }                      
                }
               // console.log(asdfghk);
                alldata['selectdata']=asdfghk;
                alldata['selectprodata']=asdfghkpro;
            });
            procedure.findOne({'_id': req.params.uid}, function(err, sdata) {
                alldata['sldata'] = sdata;
                // alldata['expldata']=sdata.policy.split(',');
                //console.log(sdata.policy);
                res.render('addresearchupdateprocedure', {'result': alldata, layout: "login"});
            });
        });
    }
};
module.exports = new procedurecontroller();