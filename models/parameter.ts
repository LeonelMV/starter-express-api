'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParameterSchema = new Schema({
  domain: [{ type: Schema.Types.ObjectId, ref: 'Domain' }],
  code: {type: String, required: true},
  description: {type: String, required: true}
});

module.exports = mongoose.model('Parameter', ParameterSchema);
