/**
 * @author ashutosh
 * @param {type} param
 */
var mongoose = require('mongoose'),
    //  developer module
    util=require('util'),
    Schema = mongoose.Schema,
    path = require('path');
console.log('creating Legislation Model');
var ProcedureSchema = new Schema({
    proceduretext:            {type: String},
    procedurename:            {type: String},
    legislation:              {type: String},
    policy:                   {type: String},  
});
console.log('exporting Legislation Model');
module.exports = mongoose.model('Procedure', ProcedureSchema);