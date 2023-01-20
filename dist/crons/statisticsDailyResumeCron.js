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
    commons_1.logger.info(`** INICIALIZANDO CRON DE ESTADISTICAS DIARIAS ${process.env['STATISTICS_DAILY_RESUME_CRON']} **`);
    node_cron_1.default.schedule(process.env['STATISTICS_DAILY_RESUME_CRON'], () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const botConfigs = yield services_1.botConfigService.getBotConfig();
            const operationsCountData = yield services_1.statisticsService.getOperationsCountByDate();
            services_1.whatsappService.sendNotificationsToAllMembers(`** A CONTINUACION SE ENVIA EL RESUMEN DEL DIA DE HOY **`);
            /*botConfigs.forEach(botConfig => {
                const operationResume = operationsCountData.find(operation => operation.symbol === botConfig.symbol);
                let message = `El simbolo ${operationResume.symbol} tuvo ${operationResume.totalBuys} compras y ${operationResume.totalSells} ventas. `;
                whatsappService.sendNotificationsToAllMembers(message);
            });*/
            let currentUsdtBalance;
            const initialInversion = 6046; //FIXME LEO calcular automaticamente usando el histórico.
            const accountBalances = yield services_1.binanceService.getBalanceForAllCoins();
            const promise = accountBalances.map((balance) => __awaiter(void 0, void 0, void 0, function* () {
                const coinData = yield services_1.binanceService.getCoinData(`${balance.asset}USDT`);
                if (balance.free > 0 || balance.locked > 0) {
                    return (coinData.lastPrice * (balance.free + balance.locked));
                }
            }));
            let coinsValues = yield Promise.all(promise);
            coinsValues.forEach(coinValue => currentUsdtBalance += coinValue);
            const usdtVariation = currentUsdtBalance - initialInversion;
            services_1.whatsappService.sendNotificationsToAllMembers(`El balance equivalente en USDT es de ${parseFloat(currentUsdtBalance).toFixed(2)} y estamos a ${usdtVariation} USDT de la inversion inicial que es de ${initialInversion} USDT.`);
        }
        catch (error) {
            commons_1.logger.error(`** ERROR EN CRON DE ESTADISTICAS DIARIAS **`);
            commons_1.logger.error(error);
        }
    }));
};
exports.default = {
    init
};
