import HistoricalCotizationCoins from '../models/historicalCotizationCoins';
import {
    logger,
    utils,
} from '../commons';
import binanceService from './binanceService';

const updateHistoryCoin = (newHistoricalCotizationCoin: any) => {
    return new Promise((resolve, reject) => {
        const historicalCotizationCoin = new HistoricalCotizationCoins(newHistoricalCotizationCoin);
        historicalCotizationCoin.save((error, savedHistoricalCotizationCoin) => {
            if(error){
                reject(error);
                logger.error(error);
            }
            resolve(savedHistoricalCotizationCoin);
        });
    });
};

const getHistoricalCoinsFromDB = async (criteria: any = {}) => {
    const historicalCotizationCoins = await HistoricalCotizationCoins.find(criteria, { lastPrice: 1 }, (error) => {
        if(error){
            logger.error(error);
        }
    });
    return historicalCotizationCoins;
}

/** GET JUMPS BY SYMBOL */
const getJumpsSimulation = async (criteria: any = {}, percentage: any, investment: any, sinceDate: any, untilDate: any) => {
    let coinsJumpsResult: any = [];
    const coinSymbols = await binanceService.getAllSymbolsUSDT().catch(error => logger.error(error));
    for(let i=0; i < coinSymbols.length; i++) {
        const historicalCoinCriteria = { symbol: coinSymbols[i].symbol, date: {} };
        if(sinceDate && untilDate){
            historicalCoinCriteria.date = { $gte: sinceDate, $lte: untilDate }
        }
        const historicalCotizationCoins = await getHistoricalCoinsFromDB(historicalCoinCriteria);
        if(criteria.name && (percentage - Math.floor(percentage) === 0)) {
            coinsJumpsResult = getCoinJumpsWithIntervalPercentage(coinSymbols[i].symbol, percentage, investment, sinceDate, untilDate, historicalCotizationCoins);
            return coinsJumpsResult;
        } else {
            const coinJumps = getCoinJumps(utils.getCoinName(coinSymbols[i].symbol), percentage, investment, sinceDate, untilDate, historicalCotizationCoins);
            coinsJumpsResult.push(coinJumps);
        }
    }
    return coinsJumpsResult;
}

/** GET JUMPS BY COIN BY PERCENTAGE INTERVAL JUST FOR A SINGLE COIN*/
const getCoinJumpsWithIntervalPercentage = (name, percentage, investment, sinceDate, untilDate, historicalCotizationCoins) => {
    const INTERVAL = 0.1;
    let iterations = percentage / INTERVAL;
    let currentPercentage = INTERVAL;
    let coinsJumpsResult: any = [];
    for(let i = 0; i <= iterations; i++){
        const coinJumps = getCoinJumps(name, currentPercentage, investment, sinceDate, untilDate, historicalCotizationCoins);
        coinsJumpsResult.push(coinJumps);
        currentPercentage += INTERVAL;
    }

    return coinsJumpsResult;
}

/** GET JUMPS BY COIN BY PERCENTAGE */
const getCoinJumps = (name, percentage, investment, sinceDate, untilDate, historicalCotizationCoins) => {
    let rises = 0;
    let falls = 0;
    let lastJumpPrice = 0;
    let initialValue = 0;
    let finalValue = 0;
    percentage = 1 - (percentage / 100)
    if(historicalCotizationCoins) {
        initialValue = historicalCotizationCoins[0].lastPrice;
        finalValue = historicalCotizationCoins[historicalCotizationCoins.length - 1].lastPrice;
        lastJumpPrice = historicalCotizationCoins[0].lastPrice;
        historicalCotizationCoins.forEach(coinData => {
            const jumpRise = coinData.lastPrice * percentage > lastJumpPrice;
            const jumpFall = coinData.lastPrice / percentage < lastJumpPrice;
            if(jumpRise){
                rises++;
                lastJumpPrice = coinData.lastPrice;
            }else if(jumpFall){
                falls++;
                lastJumpPrice = coinData.lastPrice;
            }
        });
    }
    const cotizationGain: any = utils.getCotizationGain(initialValue, finalValue, (1 - percentage), investment);
    const botGain = utils.getBotGain(rises, cotizationGain, initialValue, finalValue, (1 - percentage), investment);
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
}

export default {
    getJumpsSimulation,
    updateHistoryCoin,
}