import cron from 'node-cron';

import {
    logger
  } from '../commons';

import { 
    binanceService,
    botConfigService,
    whatsappService,
} from '../services';

const init = () => {
    logger.info(`** INICIALIZANDO CRON DE CONTROL DE ORDENES ABIERTAS ${process.env.OPEN_ORDERS_CHECK_CRON} **`);
    cron.schedule(process.env.OPEN_ORDERS_CHECK_CRON, async () => {
        const openOrders = await binanceService.getAllCurrentOpenOrders().catch(error => logger.error(error));
        const botConfigs = await botConfigService.getBotConfig().catch(error => logger.error(error))
        let expectedOrdersCount = 0;
        botConfigs.forEach(botConfig => {
            if(botConfig.enabled) {
                if(botConfig.allowedToBuy){
                    expectedOrdersCount++;
                }
                if(botConfig.allowedToSell){
                    expectedOrdersCount++;
                }
            }
        });
        if(expectedOrdersCount > openOrders.length){
            const message = `SE DETECTARON ORDENES FALTANTES. HAY ${openOrders.length} y se esperaban ${expectedOrdersCount}. REINICIO AUTOMATICO DE BOT.`;
            whatsappService.sendNotificationsToAllMembers(message);
            logger.warn(message);
            binanceService.launchBotOperations().catch(error => logger.info(error));
        }
    });
}

export default {
    init
}