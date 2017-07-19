/**
 * @author ashutosh
 * @type type
 * legislation controller
 */
var legislation = require('../models/legislation.js');
var policy = require('../models/policy.js');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
var procedure = require('../models/procedure.js');
var fs = require('fs');
var officegen = require('officegen');// for the doc file generator
var docx = officegen('docx'); // for the doc file generator
var http = require('http');
var controller = function() {
};
controller.prototype = {
    'addlegislation': function(req, res, done) {
        var newlegislation = new legislation();
        newlegislation.text = req.body.text;
        newlegislation.mainheading = req.body.mainheading;
        newlegislation.subheading = req.body.subheading;
        newlegislation.section = req.body.section;
        newlegislation.policy = req.body.policy;
        newlegislation.procedure = req.body.procedure;
        newlegislation.summary = req.body.summary;
        process.nextTick(function() {
            newlegislation.save(function(err) {
                if (err) {
                    // return done(null, false, req.flash('sucess', 'Error! Couldn\'t insert data successfully.'));
                }
                else {
                    //return done(null, false, req.flash('sucess', 'You have submitted the data'));           
                }
            });
        });
    },
    'generatedoc': function(req, res) { // get legislation data by id
        process.nextTick(function() {
            legislation.findOne({'_id': req.params.uid}, function(err, data) {
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
                pObj.addText('Legislation Data', {bold: true, underline: true});
                //pObj.addImage ( path.resolve(__dirname, 'images_for_examples/image3.png' ) );
                //docx.putPageBreak();
                //1st
                var pObj = docx.createListOfNumbers();
                pObj.options.align = 'left';
                pObj.addText('Legislation Name:', {bold: true});
                //2nd
                pObj.options.align = 'left';
                pObj.addText('   ' + data.mainheading);
                //3rd
                var pObj = docx.createListOfNumbers();
                pObj.addText('Legislation Subheading:', {bold: true});
                pObj.options.align = 'left';
                pObj.addText('   ' + data.subheading);
                //4th
                var pObj = docx.createListOfNumbers();
                pObj.addText('Legislation Section:', {bold: true});
                pObj.options.align = 'left';
                pObj.addText('   ' + data.section);
                //5th
                var pObj = docx.createListOfNumbers();
                pObj.addText('Text:', {bold: true});
                pObj.options.align = 'left';
                pObj.addText('   ' + data.text);
                //6th
                var pObj = docx.createListOfNumbers();
                pObj.addText('Summary:', {bold: true});
                pObj.options.align = 'left';
                pObj.addText('   ' + data.summary);
                var wordrand = Math.floor((Math.random() * 100000) + 1000000);// generate the random number for the doc file
                var out = fs.createWriteStream(wordrand + 'out.docx');
                out.on('error', function(err) {
                    console.log(err);
                });
                docx.generate(out);
                console.log(out.path);
            });
        });
    }, 'getalllegislation': function(req, res) { // get all legislative data 
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
                console.log(alldata);
                res.render('addresearch', {'result': alldata, layout: "login"});
            });
        });
    }, 'addresearchldata': function(req, res) { // get all legislative data by id
        process.nextTick(function() {
            legislation.findOne({'_id': req.params.uid}, function(err, data) {
                console.log(data);
                res.render('addresearchedit', {'lresult': data, layout: "login"});
            });
        });
    }, 'deletedatabylid': function(req, res) {
        process.nextTick(function() {
            legislation.remove({'_id': req.params.uid}, function(err, data) {
                console.log(data);
                // res.render('addresearchedit', {'lresult': data, layout: "login"});
            });
        });
    }, 'updatedatabylid': function(req, res) {
        process.nextTick(function() {
            legislation.update({'_id': req.body.id}, {$set: {'text': req.body.text, 'mainheading': req.body.mainheading, 'subheading': req.body.subheading, 'section': req.body.section, 'summary': req.body.summary, 'policy': req.body.policy,
                    'procedure': req.body.procedure}}, function(err, results) {
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
            
            legislation.findOne({'_id': req.params.uid}, function(err, sdata) {              
                if (sdata.policy) {
                    var asdfghk=[];
                    var spldata = sdata.policy.split(',');   
                    var j=0;
                    for (i in spldata) {  
                       // console.log(i);
                        policy.findOne({'_id': spldata[i]}, function(err, seldata) {
                         //  console.log(seldata.policyname);                            
                           localStorage.setItem('aaaaaa',seldata.policyname);
                        }); 
                             asdfghk[j]=localStorage.getItem('aaaaaa');
                             // console.log(j);
                             localStorage.removeItem('aaaaaa');
                             j++;
                    }                      
                }
                if (sdata.procedure) {
                   var asdfghkpro=[];
                    var splprodata = sdata.procedure.split(',');   
                    var j=0;
                    for (i in splprodata) {  
                       // console.log(i);
                        procedure.findOne({'_id': splprodata[i]}, function(err, selprodata) {
                           console.log(selprodata.procedurename);                            
                           localStorage.setItem('proaaaaaa',selprodata.procedurename);
                        }); 
                             asdfghkpro[j]=localStorage.getItem('proaaaaaa');
                             // console.log(j);
                             localStorage.removeItem('proaaaaaa');
                             j++;
                    }   
                }
               // console.log(asdfghk);
                alldata['selectdata']=asdfghk;
                alldata['selectprodata']=asdfghkpro;
            });
            legislation.findOne({'_id': req.params.uid}, function(err, sdata) {
                 alldata['sldata'] = sdata;
                res.render('addresearchupdate', {'result': alldata, layout: "login"});
            });
        });
    }
};
module.exports = new controller();