import WebSocket from 'ws';

import {
    logger,
    utils,
} from '../commons';

import {
    botConfigService, 
} from '../services';

 const init = async (sendMessage) => {
    const binanceWS = new WebSocket(`${process.env['WEBSOCKET_BINANCE_BASE_URL']}`);

    try {
        /** ON OPEN SOCKET CONNECTION */
        binanceWS.onopen = async (evt) => {
            logger.info(`*** LISTENING WEB SOCKETS BINANCE INFORMATION *** ${utils.getCurrentTime()}`);
            botConfigService.getBotConfig()
            .then((configs) => {
                let params = configs.map((config) => {
                    return `${config.symbol.toLowerCase()}@ticker`;
                });
                binanceWS.send(JSON.stringify({
                    "method": "SUBSCRIBE",
                    "params": params,
                    "id": 1
                }));
            });
        }

        /** ON ERROR SOCKET CONNECTION */
        binanceWS.onerror = (evt) => {
            logger.error(`*** ERROR ON WEB SOCKETS BINANCE INFORMATION *** ${utils.getCurrentTime()}`);
        }

        /** ON CLOSE SOCKET CONNECTION */
        binanceWS.onclose = (evt) => {
            logger.error(`*** WEB SOCKETS BINANCE INFORMATION WAS CLOSED *** ${utils.getCurrentTime()}`);
        }

        /** ON MESSAGE RECEIVED */
        binanceWS.onmessage = (message) => {
            if(message && message.data){
                handleOnMessage(JSON.parse(message.data));
            }
        };
    } catch (error){
        logger.error(error);
        logger.info("INTENTANDO RESTABLECER BOT");
    }

    /* HANDLING DIFERENT TYPES OF MESSAGES */
    const handleOnMessage = (message) => {
        switch(message.e){
            case '24hrTicker':
                handle24hrTicker(message);
                break;
        }
    }
    
    /* HANDLING ALL CHANGES ON SYMBOL */
    const handle24hrTicker = async (message) => {
        sendMessage(message);
        /*if(message.c <= 41000){
            //binanceService.stopLoss();
            logger.info(`COTIZACION DEL BITCOIN POR DEBAJO DE 41000 STOP LOSS ENABLED *** ${utils.getCurrentTime()}`);
        }*/
    }
}

export default { init };