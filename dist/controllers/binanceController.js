"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const getCoinData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const symbol = req.query.symbol;
        const data = yield services_1.binanceService.getCoinData(symbol).catch(error => error);
        return res.status(200).send(data);
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send((error === null || error === void 0 ? void 0 : error.data) || "Se ha producido un error");
    }
});
const getAllSymbolsUSDT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield services_1.binanceService.getAllSymbolsUSDT().catch(error => error);
        return res.status(200).send(data);
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send((error === null || error === void 0 ? void 0 : error.data) || "Se ha producido un error");
    }
});
const createNewOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol, side, quantity, price } = req.query;
        const data = yield services_1.binanceService.createNewOrder(symbol, side, quantity, price).catch(error => error);
        return res.status(200).send(data);
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send((error === null || error === void 0 ? void 0 : error.data) || "Se ha producido un error");
    }
});
const getAccountInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield services_1.binanceService.getAccountInformation().catch(error => error);
        return res.status(200).send(data);
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send((error === null || error === void 0 ? void 0 : error.data) || "Se ha producido un error");
    }
});
const getAllCurrentOpenOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const symbol = req.query.symbol;
        const data = yield services_1.binanceService.getAllCurrentOpenOrders(symbol).catch(error => error);
        return res.status(200).send(data);
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send((error === null || error === void 0 ? void 0 : error.data) || "Se ha producido un error");
    }
});
const cancelAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const symbol = req.query.symbol;
        const data = yield services_1.binanceService.cancelAllOrders(symbol).catch(error => error);
        return res.status(200).send(data);
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send((error === null || error === void 0 ? void 0 : error.data) || "Se ha producido un error");
    }
});
const getAccountTrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { symbol, startTime, endTime, fromId, limit } = req.query;
        const data = yield services_1.binanceService.getAccountTrades(symbol, startTime, endTime, fromId, limit).catch(error => error);
        return res.status(200).send(data);
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send((error === null || error === void 0 ? void 0 : error.data) || "Se ha producido un error");
    }
});
const getBalanceForAllCoins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield services_1.binanceService.getBalanceForAllCoins().catch(error => error);
        return res.status(200).send(data);
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send((error === null || error === void 0 ? void 0 : error.data) || "Se ha producido un error");
    }
});
const getAccountTradesBetweenDates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield services_1.binanceService.getAccountTradesBetweenDates().catch(error => error);
        return res.status(200).send(data);
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send((error === null || error === void 0 ? void 0 : error.data) || "Se ha producido un error");
    }
});
exports.default = {
    getCoinData,
    createNewOrder,
    getAccountInformation,
    getAllCurrentOpenOrders,
    cancelAllOrders,
    getAccountTrades,
    getBalanceForAllCoins,
    getAccountTradesBetweenDates,
    getAllSymbolsUSDT,
};
