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
    commons_1.logger.info(`** INICIALIZANDO CRON DE CONTROL DE ORDENES ABIERTAS ${process.env['OPEN_ORDERS_CHECK_CRON']} **`);
    node_cron_1.default.schedule(process.env['OPEN_ORDERS_CHECK_CRON'], () => __awaiter(void 0, void 0, void 0, function* () {
        const openOrders = yield services_1.binanceService.getAllCurrentOpenOrders().catch(error => commons_1.logger.error(error));
        const botConfigs = yield services_1.botConfigService.getBotConfig().catch(error => commons_1.logger.error(error));
        let expectedOrdersCount = 0;
        botConfigs.forEach(botConfig => {
            if (botConfig.enabled) {
                if (botConfig.allowedToBuy) {
                    expectedOrdersCount++;
                }
                if (botConfig.allowedToSell) {
                    expectedOrdersCount++;
                }
            }
        });
        if (expectedOrdersCount > openOrders.length) {
            const message = `SE DETECTARON ORDENES FALTANTES. HAY ${openOrders.length} y se esperaban ${expectedOrdersCount}. REINICIO AUTOMATICO DE BOT.`;
            services_1.whatsappService.sendNotificationsToAllMembers(message);
            commons_1.logger.warn(message);
            services_1.binanceService.launchBotOperations().catch(error => commons_1.logger.info(error));
        }
    }));
};
exports.default = {
    init
};
