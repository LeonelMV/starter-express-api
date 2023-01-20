'use strict'

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const HistoricalCotizationCoinsSchema = new Schema({
    symbol: { type: String, required: true },
    lastPrice: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HistoricalCotizationCoins', HistoricalCotizationCoinsSchema);