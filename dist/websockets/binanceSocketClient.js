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
const services_1 = require("../services");
const init = (sendMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const binanceWS = new ws_1.default(`${process.env['WEBSOCKET_BINANCE_BASE_URL']}`);
    try {
        /** ON OPEN SOCKET CONNECTION */
        binanceWS.onopen = (evt) => __awaiter(void 0, void 0, void 0, function* () {
            commons_1.logger.info(`*** LISTENING WEB SOCKETS BINANCE INFORMATION *** ${commons_1.utils.getCurrentTime()}`);
            services_1.botConfigService.getBotConfig()
                .then((configs) => {
                let params = [];
                configs.forEach((config) => {
                    params.push(`${config.symbol.toLowerCase()}@ticker`);
                });
                binanceWS.send(JSON.stringify({
                    "method": "SUBSCRIBE",
                    "params": params,
                    "id": 1
                }));
            });
        });
        /** ON ERROR SOCKET CONNECTION */
        binanceWS.onerror = (evt) => {
            commons_1.logger.error(`*** ERROR ON WEB SOCKETS BINANCE INFORMATION *** ${commons_1.utils.getCurrentTime()}`);
        };
        /** ON CLOSE SOCKET CONNECTION */
        binanceWS.onclose = (evt) => {
            commons_1.logger.error(`*** WEB SOCKETS BINANCE INFORMATION WAS CLOSED *** ${commons_1.utils.getCurrentTime()}`);
        };
        /** ON MESSAGE RECEIVED */
        binanceWS.onmessage = (message) => {
            if (message && message.data) {
                handleOnMessage(JSON.parse(message.data));
            }
        };
    }
    catch (error) {
        commons_1.logger.error(error);
        commons_1.logger.info("INTENTANDO RESTABLECER BOT");
    }
    /* HANDLING DIFERENT TYPES OF MESSAGES */
    const handleOnMessage = (message) => {
        switch (message.e) {
            case '24hrTicker':
                handle24hrTicker(message);
                break;
        }
    };
    /* HANDLING ALL CHANGES ON SYMBOL */
    const handle24hrTicker = (message) => __awaiter(void 0, void 0, void 0, function* () {
        sendMessage(message);
        /*if(message.c <= 41000){
            //binanceService.stopLoss();
            logger.info(`COTIZACION DEL BITCOIN POR DEBAJO DE 41000 STOP LOSS ENABLED *** ${utils.getCurrentTime()}`);
        }*/
    });
});
exports.default = { init };
