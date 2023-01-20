import { 
    binanceService,
    botConfigService
} from '../services';

const getOperationsCount = async () => {
    let statistics = {
        totalSells: 0,
        totalBuys: 0,
        symbolsStatistics: []
    };
    const botConfigs = await botConfigService.getBotConfig();
    let promises = botConfigs.map(async (botConfig) => {
        let statisticsBySymbol = {
            symbol: botConfig.symbol,
            sells: 0,
            buys: 0
        }
        const trades = await binanceService.getAccountTrades(botConfig.symbol).catch(error => reject(error));
        statisticsBySymbol.sells = trades?.filter(trade => !trade.isBuyer)?.length;
        statisticsBySymbol.buys = trades?.filter(trade => trade.isBuyer)?.length;
        
        return statisticsBySymbol;
    });

    const results = await Promise.all(promises);
    results.forEach(result => {
        statistics.totalSells += result.sells;
        statistics.totalBuys += result.buys;
        statistics.symbolsStatistics.push(result);
    });
    
    return statistics;
}

const getOperationsCountByDate = async (sinceDate, untilDate) => {
    let statistics = {
        totalSells: 0,
        totalBuys: 0,
        symbolsStatistics: []
    };
    const botConfigs = await botConfigService.getBotConfig();
    let promises = botConfigs.map(async (botConfig) => {
        let statisticsBySymbol = {
            symbol: botConfig.symbol,
            sells: 0,
            buys: 0
        }
        const trades = await binanceService.getAccountTradesBetweenDates(sinceDate, untilDate).catch(error => reject(error));
        statisticsBySymbol.sells = trades?.filter(trade => !trade.isBuyer)?.length;
        statisticsBySymbol.buys = trades?.filter(trade => trade.isBuyer)?.length;
        
        return statisticsBySymbol;
    });

    const results = await Promise.all(promises);
    results.forEach(result => {
        statistics.totalSells += result.sells;
        statistics.totalBuys += result.buys;
        statistics.symbolsStatistics.push(result);
    });
    
    return statistics;
}

export default {
    getOperationsCount,
    getOperationsCountByDate,
}