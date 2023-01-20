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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const historicalCotizationCoins_1 = __importDefault(require("../models/historicalCotizationCoins"));
const commons_1 = require("../commons");
const binanceService_1 = __importDefault(require("./binanceService"));
const updateHistoryCoin = (newHistoricalCotizationCoin) => {
    return new Promise((resolve, reject) => {
        const historicalCotizationCoin = new historicalCotizationCoins_1.default(newHistoricalCotizationCoin);
        historicalCotizationCoin.save((error, savedHistoricalCotizationCoin) => {
            if (error) {
                reject(error);
                commons_1.logger.error(error);
            }
            resolve(savedHistoricalCotizationCoin);
        });
    });
};
const getHistoricalCoinsFromDB = (criteria = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const historicalCotizationCoins = yield historicalCotizationCoins_1.default.find(criteria, { lastPrice: 1 }, (error) => {
        if (error) {
            commons_1.logger.error(error);
        }
    });
    return historicalCotizationCoins;
});
/** GET JUMPS BY SYMBOL */
const getJumpsSimulation = (criteria = {}, percentage, investment, sinceDate, untilDate) => __awaiter(void 0, void 0, void 0, function* () {
    let coinsJumpsResult = [];
    const coinSymbols = yield binanceService_1.default.getAllSymbolsUSDT().catch(error => commons_1.logger.error(error));
    for (let i = 0; i < coinSymbols.length; i++) {
        const historicalCoinCriteria = { symbol: coinSymbols[i].symbol, date: {} };
        if (sinceDate && untilDate) {
            historicalCoinCriteria.date = { $gte: sinceDate, $lte: untilDate };
        }
        const historicalCotizationCoins = yield getHistoricalCoinsFromDB(historicalCoinCriteria);
        if (criteria.name && (percentage - Math.floor(percentage) === 0)) {
            coinsJumpsResult = getCoinJumpsWithIntervalPercentage(coinSymbols[i].symbol, percentage, investment, sinceDate, untilDate, historicalCotizationCoins);
            return coinsJumpsResult;
        }
        else {
            const coinJumps = getCoinJumps(commons_1.utils.getCoinName(coinSymbols[i].symbol), percentage, investment, sinceDate, untilDate, historicalCotizationCoins);
            coinsJumpsResult.push(coinJumps);
        }
    }
    return coinsJumpsResult;
});
/** GET JUMPS BY COIN BY PERCENTAGE INTERVAL JUST FOR A SINGLE COIN*/
const getCoinJumpsWithIntervalPercentage = (name, percentage, investment, sinceDate, untilDate, historicalCotizationCoins) => {
    const INTERVAL = 0.1;
    let iterations = percentage / INTERVAL;
    let currentPercentage = INTERVAL;
    let coinsJumpsResult = [];
    for (let i = 0; i <= iterations; i++) {
        const coinJumps = getCoinJumps(name, currentPercentage, investment, sinceDate, untilDate, historicalCotizationCoins);
        coinsJumpsResult.push(coinJumps);
        currentPercentage += INTERVAL;
    }
    return coinsJumpsResult;
};
/** GET JUMPS BY COIN BY PERCENTAGE */
const getCoinJumps = (name, percentage, investment, sinceDate, untilDate, historicalCotizationCoins) => {
    let rises = 0;
    let falls = 0;
    let lastJumpPrice = 0;
    let initialValue = 0;
    let finalValue = 0;
    percentage = 1 - (percentage / 100);
    if (historicalCotizationCoins) {
        initialValue = historicalCotizationCoins[0].lastPrice;
        finalValue = historicalCotizationCoins[historicalCotizationCoins.length - 1].lastPrice;
        lastJumpPrice = historicalCotizationCoins[0].lastPrice;
        historicalCotizationCoins.forEach(coinData => {
            const jumpRise = coinData.lastPrice * percentage > lastJumpPrice;
            const jumpFall = coinData.lastPrice / percentage < lastJumpPrice;
            if (jumpRise) {
                rises++;
                lastJumpPrice = coinData.lastPrice;
            }
            else if (jumpFall) {
                falls++;
                lastJumpPrice = coinData.lastPrice;
            }
        });
    }
    const cotizationGain = commons_1.utils.getCotizationGain(initialValue, finalValue, (1 - percentage), investment);
    const botGain = commons_1.utils.getBotGain(rises, cotizationGain, initialValue, finalValue, (1 - percentage), investment);
    const absoluteGain = parseFloat(cotizationGain) + parseFloat(botGain);
    const result = {
        symbol: name,
        rises,
        falls,
        sinceDate,
        untilDate,
        initialValue,
        finalValue,
        cotizationGain: parseFloat(cotizationGain).toFixed(2),
        botGain: parseFloat(botGain).toFixed(2),
        percentage: ((1 - percentage) * 100).toFixed(2),
        absoluteGain: absoluteGain.toFixed(2),
    };
    return result;
};
exports.default = {
    getJumpsSimulation,
    updateHistoryCoin,
};
