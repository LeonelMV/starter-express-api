
import cron from 'node-cron';

import {
    logger
  } from '../commons';

import { 
    statisticsService,
    whatsappService,
    binanceService,
    botConfigService,
} from '../services';

const init = () => {
    logger.info(`** INICIALIZANDO CRON DE ESTADISTICAS DIARIAS ${process.env.STATISTICS_DAILY_RESUME_CRON} **`);
    cron.schedule(process.env.COIN_DATA_HISTORY_CRON, async () => {
        try{
            const botConfigs = await botConfigService.getBotConfig();
            const operationsCountData = await statisticsService.getOperationsCountByDate();
            whatsappService.sendNotificationsToAllMembers(`** A CONTINUACION SE ENVIA EL RESUMEN DEL DIA DE HOY **`);
            
            botConfigs.forEach(botConfig => {
                const operationResume = operationsCountData.find(operation => operation.symbol === botConfig.symbol);
                let message = `El simbolo ${operationResume.symbol} tuvo ${operationResume.totalBuys} compras y ${operationResume.totalSells} ventas. `;
                whatsappService.sendNotificationsToAllMembers(message);
            });
    
            let currentUsdtBalance;
            const initialInversion = 6046; //FIXME LEO calcular automaticamente usando el histórico.
            
            const accountBalances = await binanceService.getBalanceForAllCoins();
            const promise = accountBalances.map(async balance => {
                const coinData = await binanceService.getCoinData(`${balance.asset}USDT`);
                if(balance.free > 0 || balance.locked > 0){
                    return (coinData.lastPrice * (balance.free + balance.locked));
                }
            });
            
            let coinsValues = await Promise.all(promise);
            coinsValues.forEach(coinValue => currentUsdtBalance += coinValue);
            const usdtVariation = currentUsdtBalance - initialInversion;
    
            whatsappService.sendNotificationsToAllMembers(`El balance equivalente en USDT es de ${parseFloat(currentUsdtBalance).toFixed(2)} y estamos a ${usdtVariation} USDT de la inversion inicial que es de ${initialInversion} USDT.`);
        } catch(error){
            logger.error(`** ERROR EN CRON DE ESTADISTICAS DIARIAS **`);
            logger.error(error);
        }
    });
}

export default {
    init
}