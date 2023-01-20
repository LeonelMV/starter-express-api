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
const getNotificationsNumbers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationNumbers = yield services_1.notificationsService.getNotificationsNumbers().catch(error => res.status(500).send(error));
    return res.status(200).send(notificationNumbers);
});
const createNotificationNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, number, apikey } = req.body;
    if (number && apikey) {
        const notificationNumber = yield services_1.notificationsService.createNotificationNumber(name, number, apikey).catch(error => res.status(500).send(error));
        return res.status(200).send(notificationNumber);
    }
});
const updateNotificationNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO
});
const removeNotificationNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO
});
exports.default = {
    getNotificationsNumbers,
    createNotificationNumber,
    updateNotificationNumber,
    removeNotificationNumber,
};
