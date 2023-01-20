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
const ws_1 = __importDefault(require("ws"));
const commons_1 = require("../commons");
const constants_1 = require("../commons/constants");
const services_1 = require("../services");
const init = (sendMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const { listenKey } = yield services_1.binanceService.createListenKey().catch(error => commons_1.logger.error(error));
    let accountBalancesWS = new ws_1.default(`${process.env['WEBSOCKET_BINANCE_BASE_URL']}/${listenKey}`);
    try {
        /** ON OPEN SOCKET CONNECTION */
        accountBalancesWS.onopen = (evt) => {
            commons_1.logger.info(`*** LISTENING WEB SOCKETS ACCOUNT INFORMATION *** ${commons_1.utils.getCurrentTime()}`);
            services_1.binanceService.launchBotOperations().catch(error => commons_1.logger.info(error));
        };
        /** ON ERROR SOCKET CONNECTION */
        accountBalancesWS.onerror = (evt) => {
            commons_1.logger.error(`*** ERROR ON WEB SOCKETS ACCOUNT INFORMATION *** ${commons_1.utils.getCurrentTime()}`);
            services_1.whatsappService.sendNotificationsToAllMembers(`ERROR AL INICIAR EL BOT, REQUIERE ATENCIÓN HUMANA. ${commons_1.utils.getCurrentTime()}`);
            restartServer();
        };
        /** ON CLOSE SOCKET CONNECTION */
        accountBalancesWS.onclose = (evt) => {
            commons_1.logger.error(`*** WEB SOCKETS ACCOUNT INFORMATION WAS CLOSED *** ${commons_1.utils.getCurrentTime()}`);
            services_1.whatsappService.sendNotificationsToAllMembers(`El BOT DE TRADE PERDIO CONECTIVIDAD. SE INTENTARA REESTABLECER CONEXION. SE RECOMIENDA SUPERVISACION. ${commons_1.utils.getCurrentTime()}`);
            restartServer();
        };
        /** ON MESSAGE RECEIVED */
        accountBalancesWS.onmessage = (message) => {
            if (message && message.data) {
                handleOnMessage(JSON.parse(message.data));
            }
        };
    }
    catch (error) {
        commons_1.logger.error(error);
        commons_1.logger.info("INTENTANDO RESTABLECER BOT");
        restartServer();
    }
    const handleOnMessage = (message) => {
        switch (message.e) {
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
    };
    //FIXME Agregar logger y emprolijar textos usando variables dinamicas
    const handleExecutionReport = (message) => {
        try {
            if (message.x === constants_1.BINANCE_OPERATION_STATUS.NEW) {
                commons_1.logger.info(`LANZAMIENTO. Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${commons_1.utils.getCurrentTime()}`);
                //whatsappService.sendNotificationsToAllMembers(`LANZAMIENTO. Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${utils.getCurrentTime()}`);
            }
            else if (message.X === constants_1.BINANCE_OPERATION_STATUS.FILLED) {
                commons_1.logger.info(`EJECUCION: Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${commons_1.utils.getCurrentTime()}`);
                services_1.binanceService.relaunchOrdersSymbol(message.s, message.p);
                services_1.whatsappService.sendNotificationsToAllMembers(`EJECUCION: Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${commons_1.utils.getCurrentTime()}`);
            }
            else if (message.x === constants_1.BINANCE_OPERATION_STATUS.CANCELED) {
                commons_1.logger.info(`CANCELACION: Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${commons_1.utils.getCurrentTime()}`);
                //whatsappService.sendNotificationsToAllMembers(`CANCELACION: Simbolo: ${message.s} - Tipo: ${message.S} ${message.o} - Cantidad: ${message.q} - Precio: ${message.p} - ${utils.getCurrentTime()}`);
            }
            sendMessage(message);
        }
        catch (error) {
            commons_1.logger.error(error);
        }
    };
    const handleOutboundAccountPosition = (message) => {
        //console.log('outboundAccountPosition');
        //console.log(message);
    };
    const handleBalanceUpdate = (message) => {
        //console.log('balanceUpdate');
        //console.log(message)
    };
    const renewListenKeyInterval = () => {
        setInterval(() => {
            commons_1.logger.info(`** UPDATING CURRENT LISTEN KEY ** ${listenKey} - ${commons_1.utils.getCurrentTime()}`);
            services_1.binanceService.updateListenKey(listenKey)
                .catch(error => {
                commons_1.logger.error(error);
            });
        }, 1000 * 60 * 30);
    };
    renewListenKeyInterval();
    const restartServer = () => {
        commons_1.logger.warn(`SE HA PRODUCIDO UN ERROR, EL BOT SE REINICIARA EN 10 SEGUNDOS PARA CONTINUAR OPERANDO- ${commons_1.utils.getCurrentTime()}`);
        setTimeout(() => {
            try {
                commons_1.logger.warn(`REINICIO DE BOT EN CURSO - ${commons_1.utils.getCurrentTime()}`);
                services_1.whatsappService.sendNotificationsToAllMembers(`REINICIO DE BOT EN CURSO - ${commons_1.utils.getCurrentTime()}`);
                process.on("exit", function () {
                    require("child_process").spawn(process.argv.shift(), process.argv, {
                        cwd: process.cwd(),
                        detached: true,
                        stdio: "inherit"
                    });
                    commons_1.logger.info(`EL BOT SE HA REINICIADO EXITOSAMENTE, OPERANDO CON NORMALIDAD - ${commons_1.utils.getCurrentTime()}`);
                    services_1.whatsappService.sendNotificationsToAllMembers(`EL BOT SE HA REINICIADO EXITOSAMENTE, OPERANDO CON NORMALIDAD - ${commons_1.utils.getCurrentTime()}`);
                });
                process.exit();
            }
            catch (e) {
                commons_1.logger.error(`ERROR AL INTENTAR REESTABLECER BOT, SE REQUIERE SUPERVIZACION - ${commons_1.utils.getCurrentTime()}`);
                services_1.whatsappService.sendNotificationsToAllMembers(`ERROR AL INTENTAR REESTABLECER BOT, SE REQUIERE SUPERVIZACION - ${commons_1.utils.getCurrentTime()}`);
            }
        }, 10000);
    };
});
exports.default = { init };
