import WebSocket from 'ws';

import {
    logger,
    utils,
} from '../commons';

import {
    BINANCE_OPERATION_STATUS,
} from '../commons/constants';

import { 
    binanceService,
    whatsappService 
} from '../services';

const init = async (sendMessage) => {
    const { listenKey } = await binanceService.createListenKey().catch(error => logger.error(error));
    let accountBalancesWS = new WebSocket(`${process.env['WEBSOCKET_BINANCE_BASE_URL']}/${listenKey}`);
    
    try {
        /** ON OPEN SOCKET CONNECTION */
        accountBalancesWS.onopen = (evt) => {
            logger.info(`*** LISTENING WEB SOCKETS ACCOUNT INFORMATION *** ${utils.getCurrentTime()}`);
            binanceService.launchBotOperations().catch(error => logger.info(error));
        }
    
        /** ON ERROR SOCKET CONNECTION */
        accountBalancesWS.onerror = (evt) => {
            logger.error(`*** ERROR ON WEB SOCKETS ACCOUNT INFORMATION *** ${utils.getCurrentTime()}`);
            whatsappService.sendNotificationsToAllMembers(`ERROR AL INICIAR EL BOT, REQUIERE ATENCIÓN HUMANA. ${utils.getCurrentTime()}`)
            restartServer();
        }
    
        /** ON CLOSE SOCKET CONNECTION */
        accountBalancesWS.onclose = (evt) => {
            logger.error(`*** WEB SOCKETS ACCOUNT INFORMATION WAS CLOSED *** ${utils.getCurrentTime()}`);
            whatsappService.sendNotificationsToAllMembers(`El BOT DE TRADE PERDIO CONECTIVIDAD. SE INTENTARA REESTABLECER CONEXION. SE RECOMIENDA SUPERVISACION. ${utils.getCurrentTime()}`)
            restartServer();
        }
    
        /** ON MESSAGE RECEIVED */
        accountBalancesWS.onmessage = (message) => {
            if(message && message.data){
                handleOnMessage(JSON.parse(message.data));
            }
        };
    } catch (error){
        logger.error(error);
        logger.info("INTENTANDO RESTABLECER BOT");
    }
    
    
    const handleOnMessage = (message) => {
        switch(message.e){
            case 'executionReport':
                handleExecutionReport(message);
                break;
            case 'outboundAccountPosition':
                handleOutboundAccountPosition(message);
                break;
            case 'balanceUpdate':
                handleBalanceUpdate(message);
                break;
        }
    }
    
    //FIXME Agregar logger y emprolijar textos usando variables dinamicas
    const handleExecutionReport = (message) => {
        try{
            if(message.x === BINANCE_OPERATION_STATUS.NEW) {
                logger.info(`LANZAMIENTO. Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${utils.getCurrentTime()}`);
                //whatsappService.sendNotificationsToAllMembers(`LANZAMIENTO. Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${utils.getCurrentTime()}`);
            } else if (message.X === BINANCE_OPERATION_STATUS.FILLED) {
                logger.info(`EJECUCION: Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${utils.getCurrentTime()}`);
                binanceService.relaunchOrdersSymbol(message.s, message.p);
                whatsappService.sendNotificationsToAllMembers(`EJECUCION: Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${utils.getCurrentTime()}`);
            } else if(message.x === BINANCE_OPERATION_STATUS.CANCELED){
                logger.info(`CANCELACION: Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${utils.getCurrentTime()}`);
                //whatsappService.sendNotificationsToAllMembers(`CANCELACION: Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${utils.getCurrentTime()}`);
            }
            sendMessage(message);
        } catch (error) {
            logger.error(error);
        } 
    }
    
    const handleOutboundAccountPosition = (message) => {
        //console.log('outboundAccountPosition');
        //console.log(message);
    }
    
    const handleBalanceUpdate = (message) => {
        //console.log('balanceUpdate');
        //console.log(message)
    }
    
    const renewListenKeyInterval = () => {
        setInterval(() => {
            logger.info(`** UPDATING CURRENT LISTEN KEY ** ${listenKey} - ${utils.getCurrentTime()}`);
            binanceService.updateListenKey(listenKey)
            .catch(error => {
                logger.error(error);
            });
        }, 1000 * 60 * 30);
    }

    renewListenKeyInterval();

    const restartServer = () => {
        logger.warn(`SE HA PRODUCIDO UN ERROR, EL BOT SE REINICIARA EN 10 SEGUNDOS PARA CONTINUAR OPERANDO- ${utils.getCurrentTime()}`);
        setTimeout(() => {
            try {
                logger.warn(`REINICIO DE BOT EN CURSO - ${utils.getCurrentTime()}`);
                whatsappService.sendNotificationsToAllMembers(`REINICIO DE BOT EN CURSO - ${utils.getCurrentTime()}`);
                process.on("exit", function () {
                    require("child_process").spawn(process.argv.shift(), process.argv, {
                        cwd: process.cwd(),
                        detached : true,
                        stdio: "inherit"
                    });
                    logger.info(`EL BOT SE HA REINICIADO EXITOSAMENTE, OPERANDO CON NORMALIDAD - ${utils.getCurrentTime()}`);
                    whatsappService.sendNotificationsToAllMembers(`EL BOT SE HA REINICIADO EXITOSAMENTE, OPERANDO CON NORMALIDAD - ${utils.getCurrentTime()}`);
                });
                process.exit();
                
            } catch (e) {
                logger.error(`ERROR AL INTENTAR REESTABLECER BOT, SE REQUIERE SUPERVIZACION - ${utils.getCurrentTime()}`);
                whatsappService.sendNotificationsToAllMembers(`ERROR AL INTENTAR REESTABLECER BOT, SE REQUIERE SUPERVIZACION - ${utils.getCurrentTime()}`);
            } 
        }, 10000);
    }
}

export default { init };
