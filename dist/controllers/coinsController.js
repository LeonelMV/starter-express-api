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
const getJumpsSimulation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, percentage, investment, sinceDate, untilDate } = req.query;
    req.setTimeout(1000 * 60 * 60 * 24);
    let criteria = {};
    if (name) {
        criteria.name = name;
    }
    const data = yield services_1.coinsService.getJumpsSimulation(criteria, percentage, investment, sinceDate, untilDate).catch(error => error);
    return res.status(200).send(data);
});
exports.default = {
    getJumpsSimulation,
};
