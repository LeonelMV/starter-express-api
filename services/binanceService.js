import axios from 'axios';
import moment from 'moment-timezone';
import { 
  binanceUtils, 
  utils, 
  logger 
} from '../commons';

import {
  botConfigService,
} from './index';

import { 
  BTC_USD_SYMBOL,
  BTC,
  USDT,
  BINANCE_OPERATION_TYPES,
} from '../commons/constants';

const axiosInstance = axios.create({
  baseURL: process.env.BINANCE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-MBX-APIKEY': process.env.BINANCE_API_KEY,
    'binance-api-secret': process.env.BINANCE_API_SECRET,
  },
});

/** GET COIN DATA FOR A SYMBOL */
const getCoinData = async (symbol) => {
  let result;
  try{
    const url = `/api/v3/ticker/24hr?${symbol ? `symbol=${symbol}` : ''}`;
    const response = await axiosInstance.get(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });
    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch (error){
    throw error;
  }
  return result;
};

const getAllSymbolsUSDT = async () => {
  const coinsData = await getCoinData();
  const result = coinsData.filter(coinData => {
    const isUSDTSymbol = coinData.symbol.includes('USDT');
    const isInBlackList = utils.isSymbolInBlackList(coinData.symbol);
    return isUSDTSymbol && !isInBlackList;
  });
  return result;
}

/** CREATES A NEW ORDER */
const createNewOrder = async (symbol, side, quantity, price, type = 'LIMIT', timeInForce = 'GTC') => {
  let result;
  try {
    const timestamp = Date.now();
    const queryParams = `symbol=${symbol}&side=${side}&type=${type}&timeInForce=${timeInForce}&quantity=${quantity}&price=${price}&timestamp=${timestamp}`;
    const signature = binanceUtils.sign(queryParams);
    
    const url = `/api/v3/order?${queryParams}&signature=${signature}`;
    const response = await axiosInstance.post(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });
    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
};

/** CREATES A LISTEN KEY USED FOR WEBSOCKET STREAM DATA */
const createListenKey = async () => {
  let result;
  try {
    const url = `/api/v3/userDataStream`;
    const response = await axiosInstance.post(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });
    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
};

/** RENEWS A LISTEN KEY SESSION USED FOR WEBSOCKET STREAM DATA */
const updateListenKey = async (listenKey) => {
  let result;
  try {
    const queryParams = `listenKey=${listenKey}`;
    const url = `/api/v3/userDataStream?${queryParams}`;
    const response = await axiosInstance.put(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });
    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
};

/** CANCEL SPECIFIC ORDER */
const cancelOrder = async (symbol, orderId, origClientOrderId, newClientOrderId) => {
  let result;
  try {
    const timestamp = Date.now();
    const queryParams = `symbol=${symbol}&orderId=${orderId}&origClientOrderId=${origClientOrderId}${newClientOrderId ? `&newClientOrderId=${newClientOrderId}` : ''}&timestamp=${timestamp}`;
    const signature = binanceUtils.sign(queryParams);

    const url = `/api/v3/order?${queryParams}&signature=${signature}`;
    const response = await axiosInstance.delete(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });
    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
};

/** CANCEL ALL OPEN ORDERS */
const cancelAllOrders = async (symbol) => {
  let result;
  try {
    const timestamp = Date.now();
    const queryParams = `symbol=${symbol}&timestamp=${timestamp}`;
    const signature = binanceUtils.sign(queryParams);
    
    const url = `/api/v3/openOrders?${queryParams}&signature=${signature}`;
    const response = await axiosInstance.delete(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });
    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
};

/** RETURN ALL ACCOUNT INFORMATION, LIKE BALANCES, ETC */
const getAccountInformation = async () => {
  let result;
  try {
    const timestamp = Date.now();
    const signature = binanceUtils.sign(`timestamp=${timestamp}`);

    const url = `/api/v3/account?timestamp=${timestamp}&signature=${signature}`;
    const response = await axiosInstance.get(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });
    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
};

/** RETURN ALL OPEN ORDERS */
const getAllCurrentOpenOrders = async (symbol) => {
  let result;
  try {
    const timestamp = Date.now();
    const queryParams = `${symbol ? `symbol=${symbol}&` : ''}timestamp=${timestamp}`;
    const signature = binanceUtils.sign(queryParams);

    const url = `/api/v3/openOrders?${queryParams}&signature=${signature}`;
    const response = await axiosInstance.get(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });
    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
}

/** RETURN A SPECIFIC ORDER BY SYMBOL AND ID */
const getOrderById = async (symbol, orderId) => {
  let result;
  try {
    const timestamp = Date.now();
    const queryParams = `symbol=${symbol}&orderId=${orderId}&origClientOrderId&timestamp=${timestamp}`;
    const signature = binanceUtils.sign(queryParams);

    const url = `/api/v3/order?${queryParams}&signature=${signature}`;
    const response = await axiosInstance.get(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });
    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
}

/** GET ALL ORDERS  */
const getAllOrders = async (symbol, orderId, startTime, endTime = Date.now(), limit = 500) => {
  let result;
  try {
    const timestamp = Date.now();
    const queryParams = `symbol=${symbol}&orderId=${orderId}&startTime=${startTime}&endTime=${endTime}&limit=${limit}&timestamp=${timestamp}`;
    const signature = binanceUtils.sign(queryParams);
  
    const url = `/api/v3/allOrders?${queryParams}&signature=${signature}`;
    const response = await axiosInstance.get(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });
    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
}

/** RETURN ALL ACCOUNT TRADES BY FILTERS */
const getAccountTrades = async (symbol, startTime = '', endTime = '', fromId = '', limit = 1000000) => {
  let result;
  try {
    const timestamp = Date.now();
    const queryParams = `${symbol ? `symbol=${symbol}` : ''}&${startTime ? `&startTime=${startTime}` : ''}${endTime ? `&endTime=${endTime}` : ''}${fromId ? `&fromId=${fromId}` : ''}&limit=${limit}&timestamp=${timestamp}`;
    const signature = binanceUtils.sign(queryParams);
  
    const url = `/api/v3/myTrades?${queryParams}&signature=${signature}`;
    const response = await axiosInstance.get(url)
    .catch(error => {
      logger.error(`${url} ${JSON.stringify(error?.response?.data)} ${utils.getCurrentTime()}`);
      throw error;
    });

    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
}

const cancelSymbolOrdersIndividually = async (symbol) => {
    const currentOpenOrders = await getAllCurrentOpenOrders(symbol).catch(error => logger.error(error));
    if(currentOpenOrders && currentOpenOrders.length > 0) {
      currentOpenOrders.forEach((openOrder) => {
        cancelOrder(symbol, openOrder.orderId, openOrder.clientOrderId).catch(error => logger.error(error));
      });
    }
}

const launchBotOperations = async () => {
  //GETTING BOT CONFIGURATION TO MAKE ORDERS FOR ALL SYMBOLS
  const configs = await botConfigService.getBotConfig().catch(error => logger.error(error));
  configs.forEach(async config => {
    const { symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell } = config;
      //CANCELL PREVIOUS ORDERS
      if(enabled) {
        await cancelAllOrders(symbol).catch(error => logger.error(error));
        //GETTING LAST EXECUTION PRICE TO START FROM LAST COIN OPERATION VALUE
        const startDate = moment().startOf("day").toDate().getTime();
        const endDate = moment().endOf("day").toDate().getTime();
        const lastTrades = await getAccountTrades(symbol, startDate, endDate, 2).catch(error => logger.error(error));
        if(lastTrades && lastTrades.length > 0) {
          const coinPrice = lastTrades[lastTrades.length - 1].price;
          const coinName = utils.getCoinName(symbol);
          await launchNewOrders(symbol, coinName, coinPrice, percentage, commission, automaticReinvestment, allowedToBuy, allowedToSell);
        } else {
          logger.warn('No hay un historico de trades para la moneda seleccionada. El BOT solo funciona con historico de operaciones.', utils.getCurrentTime());
        }
      }
  });

}

const relaunchOrdersSymbol = async (symbol, price) => {
  //GETTING BOT CONFIGURATION TO MAKE ORDERS FOR SYMBOLS
  const configs = await botConfigService.getBotConfig({ symbol }).catch(error => logger.error(error));
  configs.forEach(async config => {
    const { symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell } = config;
    if(enabled) {
      const coinName = utils.getCoinName(symbol);
      //CANCELL PREVIOUS ORDERS
      await cancelAllOrders(symbol).catch(error => logger.error(error));
      await launchNewOrders(symbol, coinName, price, percentage, commission, automaticReinvestment, allowedToBuy, allowedToSell);
    }
  });
}

/** LAUNCH COIN ORDERS USING JUMPING PERCENTS */
const launchNewOrders = async (symbol, coinName, coinPrice, percentage, commission, automaticReinvestment = false, allowedToBuy = true, allowedToSell = true) => {
  const accountInformation = await getAccountInformation().catch(error => logger.error(error));
  if(accountInformation && accountInformation.balances){
    const USDTBalance = accountInformation.balances.find(accountBalance => accountBalance.asset === USDT);
    const coinBalance = accountInformation.balances.find(accountBalance => accountBalance.asset === coinName);
    
    //Getting symbol detail to get the precision
    const symbolDetail = await getSymbolDetail(symbol);

    const quantityFixedSize = getQuantityFixedSize(symbolDetail);
    const priceFixedSize = getPriceFixedSize(symbolDetail);
    
    const totalBalance = parseFloat(coinBalance.free) + parseFloat(coinBalance.locked);
    const coinToBuy = parseFloat((totalBalance * percentage / (1 - percentage) / commission).toPrecision(2)).toFixed(quantityFixedSize);
    
    let coinToSell;
    if(automaticReinvestment){
      coinToSell = parseFloat((totalBalance * percentage * (1 - (percentage * 2 / 3))).toPrecision(2)).toFixed(quantityFixedSize);
    }else{
      coinToSell = parseFloat((totalBalance * percentage).toPrecision(2)).toFixed(quantityFixedSize);
    }
  
    const maxPriceToBuy = parseFloat((coinPrice * (1 - percentage)).toPrecision(4)).toFixed(priceFixedSize);
    const minPriceToSell = parseFloat((coinPrice / (1 - percentage)).toPrecision(4)).toFixed(priceFixedSize);
    
    if(allowedToBuy && (USDTBalance.free >= parseFloat((coinToBuy * coinPrice)))){
      createNewOrder(symbol, BINANCE_OPERATION_TYPES.BUY, coinToBuy, maxPriceToBuy);
    }
    if(allowedToSell && (coinBalance.free >= parseFloat(coinToSell))) {
      createNewOrder(symbol, BINANCE_OPERATION_TYPES.SELL, coinToSell, minPriceToSell);
    }
  }
}

/** STOP LOSS ON SPECIFIC COIN VALUE */
const stopLoss = async () => {
  try{
    await cancelAllOrders();
    const accountInformation = await getAccountInformation();
    const BTCBalance = accountInformation.balances.find(accountBalance => accountBalance.asset === BTC);
    const coinData = await getCoinData(BTC_USD_SYMBOL);
    await createNewOrder(BTC_USD_SYMBOL, BINANCE_OPERATION_TYPES.SELL, BTCBalance.free, coinData.lastPrice);
    process.exit();
  }catch(error){
    logger.error(error);
    throw error;
  }
}

/** FILTER BALANCES WHERE THE ACCOUNT HAS SOME ACTIVES */
const getBalanceForAllCoins = async () => {
  const accountInformation = await getAccountInformation().catch(error => logger.error(error));
    if(accountInformation && accountInformation.balances?.length > 0){
      let balances = accountInformation.balances.filter(accountBalance => accountBalance.free > 0 || accountBalance.locked > 0);

      const configs = await botConfigService.getBotConfig().catch(error => logger.error(error));
      const promises = balances.map(async (balance) => {
        const config = configs.find(config => utils.getCoinName(config.symbol) === balance.asset);
        balance.cotizationGain = 0;
        balance.botGain = 0;
        if(config && utils.getCoinName(config.symbol) === balance.asset) {
          const trades = await getAccountTrades(config.symbol);
          if(trades.length > 0){
            const initialTrade = trades[0];
            const finalTrade = trades[trades.length - 1];
            const investment = initialTrade.price * initialTrade.qty;
            const sellsTrades = trades.filter(trade => !trade.isBuyer);
            balance.cotizationGain = utils.getCotizationGain(initialTrade.price, finalTrade.price, config.percentage, investment);
            balance.botGain = utils.getBotGain(sellsTrades.length, balance.cotizationGain, initialTrade.price, finalTrade.price, config.percentage, investment);
          }
        }
        return balance; 
      });
      balances = await Promise.all(promises);
      return balances;
    }
}

const getExchangeInfo = async () => {
  let result;
  try {
    const url = `/api/v3/exchangeInfo`;
    const response = await axiosInstance.get(url)
    .catch(error => {
      logger.error(url, JSON.stringify(error?.response?.data))
      throw error;
    });

    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
}

const getHistoricalCoin = async (symbol, interval = '1m', limit = 1000, startTime, endTime) => {
  let result;
  try {
    const url = `/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}${startTime ? `&startTime=${startTime}` : ''}${endTime ? `&endTime=${endTime}` : ''}`;
    const response = await axiosInstance.get(url)
    .catch(error => {
      logger.error(url, JSON.stringify(error?.response?.data))
      throw error;
    });

    if(!response || !response.data){
      throw new Error('Error en llamada al servicio.');
    }
    result = response.data;
  } catch(error) {
    throw error;
  }
  return result;
}

const getSymbolDetail = async (symbol) => {
  const exchangeInfo = await getExchangeInfo();
  const symbolInfo = exchangeInfo.symbols.find(symbolInfo => symbolInfo.symbol === symbol);
  return symbolInfo;
}

const getQuantityFixedSize = (symbolDetail) => {
  const lotSizeFilter = symbolDetail.filters.find(filter => filter.filterType === 'LOT_SIZE');
  const quantityFixedSize = Math.log10(parseFloat(lotSizeFilter.stepSize));
  return  Math.abs(quantityFixedSize);
}

const getPriceFixedSize = (symbolDetail) => {
  const lotSizeFilter = symbolDetail.filters.find(filter => filter.filterType === 'PRICE_FILTER');
  const priceFixedSize = Math.log10(parseFloat(lotSizeFilter.tickSize));
  return  Math.abs(priceFixedSize);
}

const getAccountTradesBetweenDates = async (startTime, endTime, fromId = '', limit = 1000000) => {
  let promises;
  let trades = [];
  try {
    const botConfigs = await botConfigService.getBotConfig().catch(error => logger.error(error));
    promises = botConfigs.map(async botConfig => {
      startTime = startTime ? startTime : moment().startOf("day").toDate().getTime();
      endTime = endTime ? endTime : moment().endOf("day").toDate().getTime();
      const accountTrades = await getAccountTrades(botConfig.symbol, startTime, endTime, fromId, limit).catch(error => res.status(500).send(error));
      return accountTrades;
    });
  }catch(error){
    logger.error(error);
    throw error;
  }
  trades = await Promise.all(promises);
  return trades.filter(trade => trade.length > 0);
}

export default { 
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