"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const sign = (queryString) => {
    const binanceApiKey = process.env['BINANCE_API_SECRET'];
    return crypto_1.default
        .createHmac('sha256', binanceApiKey)
        .update(queryString)
        .digest('hex');
};
exports.default = {
    sign,
};
