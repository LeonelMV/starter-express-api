"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statisticsController = exports.coinsController = exports.botConfigController = exports.notificationsController = exports.userController = exports.binanceController = void 0;
const binanceController_1 = __importDefault(require("./binanceController"));
exports.binanceController = binanceController_1.default;
const userController_1 = __importDefault(require("./userController"));
exports.userController = userController_1.default;
const notificationsController_1 = __importDefault(require("./notificationsController"));
exports.notificationsController = notificationsController_1.default;
const botConfigController_1 = __importDefault(require("./botConfigController"));
exports.botConfigController = botConfigController_1.default;
const coinsController_1 = __importDefault(require("./coinsController"));
exports.coinsController = coinsController_1.default;
const statisticsController_1 = __importDefault(require("./statisticsController"));
exports.statisticsController = statisticsController_1.default;
