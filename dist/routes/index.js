'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api = express_1.default.Router();
/* Controllers */
const controllers_1 = require("../controllers");
/** BEGIN ROUTES **/
api.post("/user/signUp", controllers_1.userController.signUp);
api.post("/user/signIn", controllers_1.userController.signIn);
api.get("/binance/coinData", controllers_1.binanceController.getCoinData);
api.get("/binance/accountInformation", controllers_1.binanceController.getAccountInformation);
api.get("/binance/currentOpenOrders", controllers_1.binanceController.getAllCurrentOpenOrders);
api.get("/binance/accountBalances", controllers_1.binanceController.getBalanceForAllCoins);
api.post("/binance/newOrder", controllers_1.binanceController.createNewOrder);
api.delete("/binance/cancelAllOrders", controllers_1.binanceController.cancelAllOrders);
api.get("/binance/myTrades", controllers_1.binanceController.getAccountTrades);
api.get("/binance/allAccountTrades", controllers_1.binanceController.getAccountTradesBetweenDates);
api.get("/binance/getAllSymbolsUSDT", controllers_1.binanceController.getAllSymbolsUSDT);
api.get("/notificationNumbers", controllers_1.notificationsController.getNotificationsNumbers);
api.post("/notificationNumbers", controllers_1.notificationsController.createNotificationNumber);
api.put("/notificationNumbers", controllers_1.notificationsController.updateNotificationNumber);
api.delete("/notificationNumbers", controllers_1.notificationsController.removeNotificationNumber);
api.get("/coins/jump/simulation", controllers_1.coinsController.getJumpsSimulation);
api.get("/bot/configuration", controllers_1.botConfigController.getBotConfig);
api.post("/bot/configuration", controllers_1.botConfigController.createBotConfig);
api.put("/bot/configuration", controllers_1.botConfigController.updateBotConfig);
api.delete("/bot/configuration", controllers_1.botConfigController.deleteBotConfig);
api.get("/statistics/operations", controllers_1.statisticsController.getOperationsCount);
api.get("/statistics/operationsByDate", controllers_1.statisticsController.getOperationsCountByDate);
/** END ROUTES **/
module.exports = api;
