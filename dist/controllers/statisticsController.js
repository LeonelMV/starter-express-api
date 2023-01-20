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
const getOperationsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const { sinceDate, untilDate } = req.query; 
    const data = yield services_1.statisticsService.getOperationsCount().catch(error => { var _a; return res.status(400).send((_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.msg); });
    return res.status(200).send(data);
});
const getOperationsCountByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sinceDate, untilDate } = req.query;
    const data = yield services_1.statisticsService.getOperationsCountByDate(sinceDate, untilDate).catch(error => { var _a; return res.status(400).send((_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.msg); });
    return res.status(200).send(data);
});
exports.default = {
    getOperationsCount,
    getOperationsCountByDate,
};
