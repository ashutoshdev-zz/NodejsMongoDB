/**
 * @author ashutosh
 * @param {type} param
 */
var mongoose = require('mongoose'),
        //  developer module
        util = require('util'),
        Schema = mongoose.Schema,
        path = require('path');
console.log('creating Legislation Model');
var LegislationSchema = new Schema({
    text: {type: String},
    mainheading: {type: String},
    subheading: {type: String},
    section: {type: String},
    summary: {type: String},
    policy: {type: String},
    procedure: {type: String},
});
console.log('exporting Legislation Model');
module.exports = mongoose.model('Legislation', LegislationSchema);