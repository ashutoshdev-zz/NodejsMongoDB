/**
 * @author ashutosh
 * @type type
 */
var policy = require('../models/policy.js');
var legislation = require('../models/legislation.js');
var LocalStorage = require('node-localstorage').LocalStorage,
        localStorage = new LocalStorage('./scratch');
var procedure = require('../models/procedure.js');
var fs = require('fs');
var officegen = require('officegen');// for the doc file generator
var docx = officegen('docx'); // for the doc file generator
var http = require('http');
var policycontroller = function() {
};
policycontroller.prototype = {
    'addpolicy': function(req, res, done) {
        var newpolicy = new policy();
        newpolicy.policyname = req.body.policyname;
        newpolicy.policytext = req.body.policytext;
        newpolicy.legislation = req.body.legislation;
        newpolicy.procedure = req.body.procedure;
        process.nextTick(function() {
            newpolicy.save(function(err) {
                if (err) {
                    console.log("Error! Couldn't insert data successfully.");
                }
                else {
                    console.log("You have submitted the data");
                }
            });
        });
    }, 'getdatabypoid': function(req, res) { // get all policy data 
        process.nextTick(function() {
            policy.find({'_id': req.params.uid}, function(err, d) {
                console.log(d);
                res.render('addresearchedit', {'repolicy': d, layout: "login"});
            });
        });
    },
    'generatedoc': function(req, res) { // get legislation data by id
        process.nextTick(function() {
            policy.findOne({'_id': req.params.uid}, function(err, data) {
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
                pObj.addText('Policy Data', {bold: true, underline: true});
                //pObj.addImage ( path.resolve(__dirname, 'images_for_examples/image3.png' ) );
                //docx.putPageBreak();
                //1st
                var pObj = docx.createListOfNumbers();
                pObj.addText('Policy Name:', {bold: true});
                pObj.options.align = 'left';
                pObj.addText('   ' + data.policyname);
                //2nd
                var pObj = docx.createListOfNumbers();
                pObj.addText('Policy Text:', {bold: true});
                pObj.options.align = 'left';
                pObj.addText('   ' + data.policytext);
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
            policy.remove({'_id': req.params.uid}, function(err, data) {
                console.log(data);
                //res.render('addresearchedit', {'lresult': data, layout: "login"});
            });
        });
    }, 'updatedatabylid': function(req, res) {
        process.nextTick(function() {
            policy.update({'_id': req.body.id}, {$set: {'policyname': req.body.policyname, 'policytext': req.body.policytext, 'legislation': req.body.legislation, 'procedure': req.body.procedure}}, function(err, results) {
                //console.log(results);
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
            policy.findOne({'_id': req.params.uid}, function(err, sdata) {
                if (sdata.legislation) {
                    var asdfghk = [];
                    var spldata = sdata.legislation.split(',');
                    var j = 0;
                    for (i in spldata) {
                        // console.log(i);
                        legislation.findOne({'_id': spldata[i]}, function(err, seldata) {
                            //  console.log(seldata.policyname);                            
                            localStorage.setItem('mainheading', seldata.mainheading);
                        });
                        asdfghk[j] = localStorage.getItem('mainheading');
                        // console.log(j);
                        localStorage.removeItem('mainheading');
                        j++;
                    }
                }
                if (sdata.procedure) {
                    var asdfghkpro = [];
                    var splprodata = sdata.procedure.split(',');
                    var j = 0;
                    for (i in splprodata) {
                        // console.log(i);
                        procedure.findOne({'_id': splprodata[i]}, function(err, selprodata) {
                            console.log(selprodata.procedurename);
                            localStorage.setItem('proa', selprodata.procedurename);
                        });
                        asdfghkpro[j] = localStorage.getItem('proa');
                        // console.log(j);
                        localStorage.removeItem('proa');
                        j++;
                    }
                }
                // console.log(asdfghk);
                alldata['selectdata'] = asdfghk;
                alldata['selectprodata'] = asdfghkpro;
            });
            policy.findOne({'_id': req.params.uid}, function(err, sdata) {
                alldata['sldata'] = sdata;
                // alldata['expldata']=sdata.policy.split(',');
                //console.log(sdata.policy);
                res.render('addresearchupdatepolicy', {'result': alldata, layout: "login"});
            });
        });
    }, 'uploadfiles': function(req, res) {
        console.log(req.file);
        console.log(req.files);
        console.log(req.url);
        console.log('body: ' + JSON.stringify(req.body));
        //console.log(req);
    }
};
module.exports = new policycontroller();