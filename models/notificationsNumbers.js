'use strict'

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NotificationsNumbersSchema = new Schema({
  name: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  apikey: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: true },
});

module.exports = mongoose.model('NotificationsNumbers', NotificationsNumbersSchema);
