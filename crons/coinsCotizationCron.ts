import cron from 'node-cron';

import {
    logger,
    utils
  } from '../commons';

import { 
    binanceService,
    coinsService,
} from '../services';

const init = () => {
    logger.info(`** INICIALIZANDO CRON DE RECOPILACION DE COTIZACIONES ${process.env['COIN_DATA_HISTORY_CRON']} **`);
    cron.schedule(process.env['COIN_DATA_HISTORY_CRON'], async () => {
        try{
            const coinsData = await binanceService.getAllSymbolsUSDT();
            for(let i=0; i<coinsData.length; i++){
                const coinData = coinsData[i];
                await coinsService.updateHistoryCoin(coinData);
            }
        } catch(error){
            logger.error(`** ERROR EN CRON DE RECOPILACION DE COTIZACIONES **`);
            logger.error(error);
        }
        
    });
}

export default {
    init
}