'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DomainSchema = new Schema({
    code: { type: String, unique: true, required: true },
    description: { type: String, required: true }
});
exports.default = mongoose.model('Domain', DomainSchema);
