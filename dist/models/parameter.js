'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ParameterSchema = new Schema({
    domain: [{ type: Schema.Types.ObjectId, ref: 'Domain' }],
    code: { type: String, required: true },
    description: { type: String, required: true }
});
exports.default = mongoose.model('Parameter', ParameterSchema);
