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
const botConfig_1 = __importDefault(require("../models/botConfig"));
const commons_1 = require("../commons");
const getBotConfig = (criteria = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const botConfig = yield botConfig_1.default.find(criteria, (error) => {
        if (error) {
            commons_1.logger.error(error);
        }
    });
    return botConfig;
});
const createBotConfig = (coin, symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell) => __awaiter(void 0, void 0, void 0, function* () {
    const botConfig = new botConfig_1.default({ coin, symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell });
    const newBotConfig = yield botConfig.save((error) => {
        if (error) {
            commons_1.logger.error(error);
        }
    });
    return newBotConfig;
});
const updateBotConfig = (id, percentage, commission) => __awaiter(void 0, void 0, void 0, function* () {
    const botConfig = yield botConfig_1.default.findOneAndUpdate({ _id: id }, { percentage, commission }, { new: true, useFindAndModify: true }, (error) => {
        if (error) {
            commons_1.logger.error(error);
        }
    })
        .catch(error => {
        commons_1.logger.error(error);
    });
    return botConfig;
});
const deleteBotConfig = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const coin = yield botConfig_1.default.findOneAndRemove({ _id: id }, (error) => {
        if (error) {
            commons_1.logger.error(error);
        }
    });
    return coin;
});
exports.default = {
    getBotConfig,
    createBotConfig,
    updateBotConfig,
    deleteBotConfig,
};
