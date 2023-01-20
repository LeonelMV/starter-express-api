'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DomainSchema = new Schema({
   code: {type: String, unique: true, required: true},
   description: {type: String, required: true}
});

module.exports = mongoose.model('Domain', DomainSchema);
