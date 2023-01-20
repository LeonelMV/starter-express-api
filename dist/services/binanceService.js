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
const axios_1 = __importDefault(require("axios"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const commons_1 = require("../commons");
const index_1 = require("./index");
const constants_1 = require("../commons/constants");
const axiosInstance = axios_1.default.create({
    baseURL: process.env['BINANCE_BASE_URL'],
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': process.env['BINANCE_API_KEY'],
        'binance-api-secret': process.env['BINANCE_API_SECRET'],
    },
});
/** GET COIN DATA FOR A SYMBOL */
const getCoinData = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const url = `/api/v3/ticker/24hr?${symbol ? `symbol=${symbol}` : ''}`;
        const response = yield axiosInstance.get(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
const getAllSymbolsUSDT = () => __awaiter(void 0, void 0, void 0, function* () {
    const coinsData = yield getCoinData();
    const result = coinsData.filter(coinData => {
        const isUSDTSymbol = coinData.symbol.includes('USDT');
        const isInBlackList = commons_1.utils.isSymbolInBlackList(coinData.symbol);
        return isUSDTSymbol && !isInBlackList;
    });
    return result;
});
/** CREATES A NEW ORDER */
const createNewOrder = (symbol, side, quantity, price, type = 'LIMIT', timeInForce = 'GTC') => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const timestamp = Date.now();
        const queryParams = `symbol=${symbol}&side=${side}&type=${type}&timeInForce=${timeInForce}&quantity=${quantity}&price=${price}&timestamp=${timestamp}`;
        const signature = commons_1.binanceUtils.sign(queryParams);
        const url = `/api/v3/order?${queryParams}&signature=${signature}`;
        const response = yield axiosInstance.post(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
/** CREATES A LISTEN KEY USED FOR WEBSOCKET STREAM DATA */
const createListenKey = () => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const url = `/api/v3/userDataStream`;
        const response = yield axiosInstance.post(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
/** RENEWS A LISTEN KEY SESSION USED FOR WEBSOCKET STREAM DATA */
const updateListenKey = (listenKey) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const queryParams = `listenKey=${listenKey}`;
        const url = `/api/v3/userDataStream?${queryParams}`;
        const response = yield axiosInstance.put(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
/** CANCEL SPECIFIC ORDER */
const cancelOrder = (symbol, orderId, origClientOrderId, newClientOrderId) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const timestamp = Date.now();
        const queryParams = `symbol=${symbol}&orderId=${orderId}&origClientOrderId=${origClientOrderId}${newClientOrderId ? `&newClientOrderId=${newClientOrderId}` : ''}&timestamp=${timestamp}`;
        const signature = commons_1.binanceUtils.sign(queryParams);
        const url = `/api/v3/order?${queryParams}&signature=${signature}`;
        const response = yield axiosInstance.delete(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
/** CANCEL ALL OPEN ORDERS */
const cancelAllOrders = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const timestamp = Date.now();
        const queryParams = `symbol=${symbol}&timestamp=${timestamp}`;
        const signature = commons_1.binanceUtils.sign(queryParams);
        const url = `/api/v3/openOrders?${queryParams}&signature=${signature}`;
        const response = yield axiosInstance.delete(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
/** RETURN ALL ACCOUNT INFORMATION, LIKE BALANCES, ETC */
const getAccountInformation = () => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const timestamp = Date.now();
        const signature = commons_1.binanceUtils.sign(`timestamp=${timestamp}`);
        const url = `/api/v3/account?timestamp=${timestamp}&signature=${signature}`;
        const response = yield axiosInstance.get(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
/** RETURN ALL OPEN ORDERS */
const getAllCurrentOpenOrders = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const timestamp = Date.now();
        const queryParams = `${symbol ? `symbol=${symbol}&` : ''}timestamp=${timestamp}`;
        const signature = commons_1.binanceUtils.sign(queryParams);
        const url = `/api/v3/openOrders?${queryParams}&signature=${signature}`;
        const response = yield axiosInstance.get(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
/** RETURN A SPECIFIC ORDER BY SYMBOL AND ID */
const getOrderById = (symbol, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const timestamp = Date.now();
        const queryParams = `symbol=${symbol}&orderId=${orderId}&origClientOrderId&timestamp=${timestamp}`;
        const signature = commons_1.binanceUtils.sign(queryParams);
        const url = `/api/v3/order?${queryParams}&signature=${signature}`;
        const response = yield axiosInstance.get(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
/** GET ALL ORDERS  */
const getAllOrders = (symbol, orderId, startTime, endTime = Date.now(), limit = 500) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const timestamp = Date.now();
        const queryParams = `symbol=${symbol}&orderId=${orderId}&startTime=${startTime}&endTime=${endTime}&limit=${limit}&timestamp=${timestamp}`;
        const signature = commons_1.binanceUtils.sign(queryParams);
        const url = `/api/v3/allOrders?${queryParams}&signature=${signature}`;
        const response = yield axiosInstance.get(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
/** RETURN ALL ACCOUNT TRADES BY FILTERS */
const getAccountTrades = (symbol, startTime = '', endTime = '', fromId = '', limit = 1000000) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const timestamp = Date.now();
        const queryParams = `${symbol ? `symbol=${symbol}` : ''}&${startTime ? `&startTime=${startTime}` : ''}${endTime ? `&endTime=${endTime}` : ''}${fromId ? `&fromId=${fromId}` : ''}&limit=${limit}&timestamp=${timestamp}`;
        const signature = commons_1.binanceUtils.sign(queryParams);
        const url = `/api/v3/myTrades?${queryParams}&signature=${signature}`;
        const response = yield axiosInstance.get(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(`${url} ${JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data)} ${commons_1.utils.getCurrentTime()}`);
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
const cancelSymbolOrdersIndividually = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const currentOpenOrders = yield getAllCurrentOpenOrders(symbol).catch(error => commons_1.logger.error(error));
    if (currentOpenOrders && currentOpenOrders.length > 0) {
        currentOpenOrders.forEach((openOrder) => {
            cancelOrder(symbol, openOrder.orderId, openOrder.clientOrderId).catch(error => commons_1.logger.error(error));
        });
    }
});
const launchBotOperations = () => __awaiter(void 0, void 0, void 0, function* () {
    //GETTING BOT CONFIGURATION TO MAKE ORDERS FOR ALL SYMBOLS
    const configs = yield index_1.botConfigService.getBotConfig().catch(error => commons_1.logger.error(error));
    configs.forEach((config) => __awaiter(void 0, void 0, void 0, function* () {
        const { symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell } = config;
        //CANCELL PREVIOUS ORDERS
        if (enabled) {
            yield cancelAllOrders(symbol).catch(error => commons_1.logger.error(error));
            //GETTING LAST EXECUTION PRICE TO START FROM LAST COIN OPERATION VALUE
            const startDate = (0, moment_timezone_1.default)().startOf("day").toDate().getTime();
            const endDate = (0, moment_timezone_1.default)().endOf("day").toDate().getTime();
            const lastTrades = yield getAccountTrades(symbol, startDate, endDate, 2).catch(error => commons_1.logger.error(error));
            if (lastTrades && lastTrades.length > 0) {
                const coinPrice = lastTrades[lastTrades.length - 1].price;
                const coinName = commons_1.utils.getCoinName(symbol);
                yield launchNewOrders(symbol, coinName, coinPrice, percentage, commission, automaticReinvestment, allowedToBuy, allowedToSell);
            }
            else {
                commons_1.logger.warn('No hay un historico de trades para la moneda seleccionada. El BOT solo funciona con historico de operaciones.', commons_1.utils.getCurrentTime());
            }
        }
    }));
});
const relaunchOrdersSymbol = (symbol, price) => __awaiter(void 0, void 0, void 0, function* () {
    //GETTING BOT CONFIGURATION TO MAKE ORDERS FOR SYMBOLS
    const configs = yield index_1.botConfigService.getBotConfig({ symbol }).catch(error => commons_1.logger.error(error));
    configs.forEach((config) => __awaiter(void 0, void 0, void 0, function* () {
        const { symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell } = config;
        if (enabled) {
            const coinName = commons_1.utils.getCoinName(symbol);
            //CANCELL PREVIOUS ORDERS
            yield cancelAllOrders(symbol).catch(error => commons_1.logger.error(error));
            yield launchNewOrders(symbol, coinName, price, percentage, commission, automaticReinvestment, allowedToBuy, allowedToSell);
        }
    }));
});
/** LAUNCH COIN ORDERS USING JUMPING PERCENTS */
const launchNewOrders = (symbol, coinName, coinPrice, percentage, commission, automaticReinvestment = false, allowedToBuy = true, allowedToSell = true) => __awaiter(void 0, void 0, void 0, function* () {
    const accountInformation = yield getAccountInformation().catch(error => commons_1.logger.error(error));
    if (accountInformation && accountInformation.balances) {
        const USDTBalance = accountInformation.balances.find(accountBalance => accountBalance.asset === constants_1.USDT);
        const coinBalance = accountInformation.balances.find(accountBalance => accountBalance.asset === coinName);
        //Getting symbol detail to get the precision
        const symbolDetail = yield getSymbolDetail(symbol);
        const quantityFixedSize = getQuantityFixedSize(symbolDetail);
        const priceFixedSize = getPriceFixedSize(symbolDetail);
        const totalBalance = parseFloat(coinBalance.free) + parseFloat(coinBalance.locked);
        const coinToBuy = parseFloat((totalBalance * percentage / (1 - percentage) / commission).toPrecision(2)).toFixed(quantityFixedSize);
        let coinToSell;
        if (automaticReinvestment) {
            coinToSell = parseFloat((totalBalance * percentage * (1 - (percentage * 2 / 3))).toPrecision(2)).toFixed(quantityFixedSize);
        }
        else {
            coinToSell = parseFloat((totalBalance * percentage).toPrecision(2)).toFixed(quantityFixedSize);
        }
        const maxPriceToBuy = parseFloat((coinPrice * (1 - percentage)).toPrecision(4)).toFixed(priceFixedSize);
        const minPriceToSell = parseFloat((coinPrice / (1 - percentage)).toPrecision(4)).toFixed(priceFixedSize);
        if (allowedToBuy && (USDTBalance.free >= parseFloat((coinToBuy * coinPrice)))) {
            createNewOrder(symbol, constants_1.BINANCE_OPERATION_TYPES.BUY, coinToBuy, maxPriceToBuy);
        }
        if (allowedToSell && (coinBalance.free >= parseFloat(coinToSell))) {
            createNewOrder(symbol, constants_1.BINANCE_OPERATION_TYPES.SELL, coinToSell, minPriceToSell);
        }
    }
});
/** STOP LOSS ON SPECIFIC COIN VALUE */
const stopLoss = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cancelAllOrders();
        const accountInformation = yield getAccountInformation();
        const BTCBalance = accountInformation.balances.find(accountBalance => accountBalance.asset === constants_1.BTC);
        const coinData = yield getCoinData(constants_1.BTC_USD_SYMBOL);
        yield createNewOrder(constants_1.BTC_USD_SYMBOL, constants_1.BINANCE_OPERATION_TYPES.SELL, BTCBalance.free, coinData.lastPrice);
        process.exit();
    }
    catch (error) {
        commons_1.logger.error(error);
        throw error;
    }
});
/** FILTER BALANCES WHERE THE ACCOUNT HAS SOME ACTIVES */
const getBalanceForAllCoins = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accountInformation = yield getAccountInformation().catch(error => commons_1.logger.error(error));
    if (accountInformation && ((_a = accountInformation.balances) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        let balances = accountInformation.balances.filter(accountBalance => accountBalance.free > 0 || accountBalance.locked > 0);
        const configs = yield index_1.botConfigService.getBotConfig().catch(error => commons_1.logger.error(error));
        const promises = balances.map((balance) => __awaiter(void 0, void 0, void 0, function* () {
            const config = configs.find(config => commons_1.utils.getCoinName(config.symbol) === balance.asset);
            balance.cotizationGain = 0;
            balance.botGain = 0;
            if (config && commons_1.utils.getCoinName(config.symbol) === balance.asset) {
                const trades = yield getAccountTrades(config.symbol);
                if (trades.length > 0) {
                    const initialTrade = trades[0];
                    const finalTrade = trades[trades.length - 1];
                    const investment = initialTrade.price * initialTrade.qty;
                    const sellsTrades = trades.filter(trade => !trade.isBuyer);
                    balance.cotizationGain = commons_1.utils.getCotizationGain(initialTrade.price, finalTrade.price, config.percentage, investment);
                    balance.botGain = commons_1.utils.getBotGain(sellsTrades.length, balance.cotizationGain, initialTrade.price, finalTrade.price, config.percentage, investment);
                }
            }
            return balance;
        }));
        balances = yield Promise.all(promises);
        return balances;
    }
});
const getExchangeInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const url = `/api/v3/exchangeInfo`;
        const response = yield axiosInstance.get(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(url, JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data));
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
const getHistoricalCoin = (symbol, interval = '1m', limit = 1000, startTime, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const url = `/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}${startTime ? `&startTime=${startTime}` : ''}${endTime ? `&endTime=${endTime}` : ''}`;
        const response = yield axiosInstance.get(url)
            .catch(error => {
            var _a;
            commons_1.logger.error(url, JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data));
            throw error;
        });
        if (!response || !response.data) {
            throw new Error('Error en llamada al servicio.');
        }
        result = response.data;
    }
    catch (error) {
        throw error;
    }
    return result;
});
const getSymbolDetail = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const exchangeInfo = yield getExchangeInfo();
    const symbolInfo = exchangeInfo.symbols.find(symbolInfo => symbolInfo.symbol === symbol);
    return symbolInfo;
});
const getQuantityFixedSize = (symbolDetail) => {
    const lotSizeFilter = symbolDetail.filters.find(filter => filter.filterType === 'LOT_SIZE');
    const quantityFixedSize = Math.log10(parseFloat(lotSizeFilter.stepSize));
    return Math.abs(quantityFixedSize);
};
const getPriceFixedSize = (symbolDetail) => {
    const lotSizeFilter = symbolDetail.filters.find(filter => filter.filterType === 'PRICE_FILTER');
    const priceFixedSize = Math.log10(parseFloat(lotSizeFilter.tickSize));
    return Math.abs(priceFixedSize);
};
const getAccountTradesBetweenDates = (startTime, endTime, fromId = '', limit = 1000000) => __awaiter(void 0, void 0, void 0, function* () {
    let promises;
    let trades = [];
    try {
        const botConfigs = yield index_1.botConfigService.getBotConfig().catch(error => commons_1.logger.error(error));
        promises = botConfigs.map((botConfig) => __awaiter(void 0, void 0, void 0, function* () {
            startTime = startTime ? startTime : (0, moment_timezone_1.default)().startOf("day").toDate().getTime();
            endTime = endTime ? endTime : (0, moment_timezone_1.default)().endOf("day").toDate().getTime();
            const accountTrades = yield getAccountTrades(botConfig.symbol, startTime, endTime, fromId, limit).catch(error => res.status(500).send(error));
            return accountTrades;
        }));
    }
    catch (error) {
        commons_1.logger.error(error);
        throw error;
    }
    trades = yield Promise.all(promises);
    return trades.filter(trade => trade.length > 0);
});
exports.default = {
    getCoinData,
    createNewOrder,
    getAccountInformation,
    cancelOrder,
    cancelAllOrders,
    getAllCurrentOpenOrders,
    getOrderById,
    getAllOrders,
    createListenKey,
    updateListenKey,
    launchNewOrders,
    getBalanceForAllCoins,
    stopLoss,
    getAccountTrades,
    launchBotOperations,
    relaunchOrdersSymbol,
    cancelSymbolOrdersIndividually,
    getExchangeInfo,
    getSymbolDetail,
    getQuantityFixedSize,
    getPriceFixedSize,
    getAccountTradesBetweenDates,
    getHistoricalCoin,
    getAllSymbolsUSDT,
};
