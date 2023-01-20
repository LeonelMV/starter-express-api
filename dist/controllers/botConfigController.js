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
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const getBotConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield services_1.botConfigService.getBotConfig();
    return res.status(200).send(data);
});
const createBotConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { coin, symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell } = req.body;
    const data = yield services_1.botConfigService.createBotConfig(coin, symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell);
    return res.status(200).send(data);
});
const updateBotConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { percentage, commission } = req.body;
    const data = yield services_1.botConfigService.updateBotConfig(id, percentage, commission);
    return res.status(200).send(data);
});
const deleteBotConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = yield services_1.botConfigService.deleteBotConfig(id);
    return res.status(200).send(data);
});
exports.default = {
    getBotConfig,
    createBotConfig,
    updateBotConfig,
    deleteBotConfig
};
