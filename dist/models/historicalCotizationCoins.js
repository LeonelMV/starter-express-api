'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const HistoricalCotizationCoinsSchema = new Schema({
    symbol: { type: String, required: true },
    lastPrice: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});
module.exports = mongoose_1.default.model('HistoricalCotizationCoins', HistoricalCotizationCoinsSchema);
