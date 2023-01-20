import { 
    binanceService,
    botConfigService
} from '.';

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
        const trades = await binanceService.getAccountTrades(botConfig.symbol).catch(error => error);
        statisticsBySymbol.sells = trades?.filter(trade => !trade.isBuyer)?.length;
        statisticsBySymbol.buys = trades?.filter(trade => trade.isBuyer)?.length;
        
        return statisticsBySymbol;
    });

    const results: any[] = await Promise.all(promises);
    results.forEach((result: any) => {
        statistics.totalSells += result.sells;
        statistics.totalBuys += result.buys;
    });
    
    return statistics;
}

const getOperationsCountByDate = async (sinceDate?: any, untilDate?: any) => {
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
        const trades = await binanceService.getAccountTradesBetweenDates(sinceDate, untilDate).catch(error => error);
        statisticsBySymbol.sells = trades?.filter(trade => !trade.isBuyer)?.length;
        statisticsBySymbol.buys = trades?.filter(trade => trade.isBuyer)?.length;
        
        return statisticsBySymbol;
    });

    const results = await Promise.all(promises);
    results.forEach(result => {
        statistics.totalSells += result.sells;
        statistics.totalBuys += result.buys;
    });
    
    return statistics;
}

export default {
    getOperationsCount,
    getOperationsCountByDate,
}