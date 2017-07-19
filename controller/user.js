/**
 * @author ashutosh
 * @type @call;require@pro;Strategy
 * user controller
 */
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
var controller = function() {
};
controller.prototype = {
    'verifyemail': function(req, res) {// this find and update the status
        process.nextTick(function() {
            User.findOne({'_id': req.query.id}, function(err, data) {
                //console.log(req.query.id);
                //console.log(data);
                User.update({'_id': req.query.id}, {$set: {'user.status':'1'}}, function(err, results) {
                   // console.log('data');
                    console.log(results);        
                });
            });
        });
    },'adminverifyemail': function(req, res) {// this find and update the status
        process.nextTick(function() {
            User.findOne({'_id': req.query.id}, function(err, data) {
                //console.log(req.query.id);
                //console.log(data);
                User.update({'_id': req.query.id}, {$set: {'user.adminstatus':'1'}}, function(err, results) {
                   // console.log('data');
                    console.log(results);        
                });
            });
        });
    }
};
module.exports = new controller();