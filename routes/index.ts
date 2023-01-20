'use strict'

import express from 'express';
const api = express.Router();

//Middleware de autenticacion basada en token
import auth from '../middlewares/auth';

/* Controllers */
import {
    userController,
    binanceController,
    notificationsController,
    botConfigController,
    coinsController,
    statisticsController,
} from '../controllers';

/** BEGIN ROUTES **/

api.post("/user/signUp", userController.signUp);
api.post("/user/signIn", userController.signIn);

api.get("/binance/coinData", binanceController.getCoinData);
api.get("/binance/accountInformation", binanceController.getAccountInformation);
api.get("/binance/currentOpenOrders", binanceController.getAllCurrentOpenOrders);
api.get("/binance/accountBalances", binanceController.getBalanceForAllCoins);
api.post("/binance/newOrder", binanceController.createNewOrder);
api.delete("/binance/cancelAllOrders", binanceController.cancelAllOrders);
api.get("/binance/myTrades", binanceController.getAccountTrades);
api.get("/binance/allAccountTrades", binanceController.getAccountTradesBetweenDates);
api.get("/binance/getAllSymbolsUSDT", binanceController.getAllSymbolsUSDT);


api.get("/notificationNumbers", notificationsController.getNotificationsNumbers);
api.post("/notificationNumbers", notificationsController.createNotificationNumber);
api.put("/notificationNumbers", notificationsController.updateNotificationNumber);
api.delete("/notificationNumbers", notificationsController.removeNotificationNumber);

api.get("/coins/jump/simulation", coinsController.getJumpsSimulation);

api.get("/bot/configuration", botConfigController.getBotConfig);
api.post("/bot/configuration", botConfigController.createBotConfig);
api.put("/bot/configuration", botConfigController.updateBotConfig);
api.delete("/bot/configuration", botConfigController.deleteBotConfig);

api.get("/statistics/operations", statisticsController.getOperationsCount);
api.get("/statistics/operationsByDate", statisticsController.getOperationsCountByDate);


/** END ROUTES **/

module.exports = api;
