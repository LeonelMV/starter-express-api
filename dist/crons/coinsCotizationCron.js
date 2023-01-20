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
const node_cron_1 = __importDefault(require("node-cron"));
const commons_1 = require("../commons");
const services_1 = require("../services");
const init = () => {
    commons_1.logger.info(`** INICIALIZANDO CRON DE RECOPILACION DE COTIZACIONES ${process.env['COIN_DATA_HISTORY_CRON']} **`);
    node_cron_1.default.schedule(process.env['COIN_DATA_HISTORY_CRON'], () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const coinsData = yield services_1.binanceService.getAllSymbolsUSDT();
            for (let i = 0; i < coinsData.length; i++) {
                const coinData = coinsData[i];
                yield services_1.coinsService.updateHistoryCoin(coinData);
            }
        }
        catch (error) {
            commons_1.logger.error(`** ERROR EN CRON DE RECOPILACION DE COTIZACIONES **`);
            commons_1.logger.error(error);
        }
    }));
};
exports.default = {
    init
};
