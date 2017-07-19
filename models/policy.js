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
var PolicySchema = new Schema({
    policyname:  {type: String},
    policytext:  {type: String},
    legislation: {type: String},
    procedure:   {type: String},
});
console.log('exporting Legislation Model');
module.exports = mongoose.model('Policy', PolicySchema);