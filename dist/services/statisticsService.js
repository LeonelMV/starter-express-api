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
const _1 = require(".");
const getOperationsCount = () => __awaiter(void 0, void 0, void 0, function* () {
    let statistics = {
        totalSells: 0,
        totalBuys: 0,
        symbolsStatistics: []
    };
    const botConfigs = yield _1.botConfigService.getBotConfig();
    let promises = botConfigs.map((botConfig) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let statisticsBySymbol = {
            symbol: botConfig.symbol,
            sells: 0,
            buys: 0
        };
        const trades = yield _1.binanceService.getAccountTrades(botConfig.symbol).catch(error => reject(error));
        statisticsBySymbol.sells = (_a = trades === null || trades === void 0 ? void 0 : trades.filter(trade => !trade.isBuyer)) === null || _a === void 0 ? void 0 : _a.length;
        statisticsBySymbol.buys = (_b = trades === null || trades === void 0 ? void 0 : trades.filter(trade => trade.isBuyer)) === null || _b === void 0 ? void 0 : _b.length;
        return statisticsBySymbol;
    }));
    const results = yield Promise.all(promises);
    results.forEach(result => {
        statistics.totalSells += result.sells;
        statistics.totalBuys += result.buys;
        statistics.symbolsStatistics.push(result);
    });
    return statistics;
});
const getOperationsCountByDate = (sinceDate, untilDate) => __awaiter(void 0, void 0, void 0, function* () {
    let statistics = {
        totalSells: 0,
        totalBuys: 0,
        symbolsStatistics: []
    };
    const botConfigs = yield _1.botConfigService.getBotConfig();
    let promises = botConfigs.map((botConfig) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        let statisticsBySymbol = {
            symbol: botConfig.symbol,
            sells: 0,
            buys: 0
        };
        const trades = yield _1.binanceService.getAccountTradesBetweenDates(sinceDate, untilDate).catch(error => reject(error));
        statisticsBySymbol.sells = (_c = trades === null || trades === void 0 ? void 0 : trades.filter(trade => !trade.isBuyer)) === null || _c === void 0 ? void 0 : _c.length;
        statisticsBySymbol.buys = (_d = trades === null || trades === void 0 ? void 0 : trades.filter(trade => trade.isBuyer)) === null || _d === void 0 ? void 0 : _d.length;
        return statisticsBySymbol;
    }));
    const results = yield Promise.all(promises);
    results.forEach(result => {
        statistics.totalSells += result.sells;
        statistics.totalBuys += result.buys;
        statistics.symbolsStatistics.push(result);
    });
    return statistics;
});
exports.default = {
    getOperationsCount,
    getOperationsCountByDate,
};
