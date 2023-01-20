'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BotConfigSchema = new Schema({
    automaticReinvestment: { type: Boolean, required: true },
    symbol: { type: String, required: true },
    percentage: { type: Number, required: true },
    quantityPrecision: { type: Number, required: true, default: 3 },
    commission: { type: Number, required: true },
    enabled: { type: Boolean, required: true, default: true },
    allowedToBuy: { type: Boolean, required: true, default: true },
    allowedToSell: { type: Boolean, required: true, default: true },
});
module.exports = mongoose.model('BotConfig', BotConfigSchema);
