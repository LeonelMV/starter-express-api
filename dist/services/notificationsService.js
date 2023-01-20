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
const notificationsNumbers_1 = __importDefault(require("../models/notificationsNumbers"));
const commons_1 = require("../commons");
const getNotificationsNumbers = (criteria = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationsNumbers = yield notificationsNumbers_1.default.find(criteria, (error) => {
        if (error) {
            commons_1.logger.error(error);
        }
    });
    return notificationsNumbers;
});
const createNotificationNumber = (name, number, apikey) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationNumbers = new notificationsNumbers_1.default({ name, number, apikey });
    const result = yield notificationNumbers.save((error) => {
        if (error) {
            commons_1.logger.error(error);
        }
    });
    return result;
});
const updateNotificationNumber = (notificationNumberToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationNumber = yield notificationsNumbers_1.default.findOneAndUpdate(notificationNumberToUpdate, (error) => {
        if (error) {
            commons_1.logger.error(error);
        }
    });
    return notificationNumber;
});
const removeNotificationNumber = (notificationNumberToRemove) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationNumber = yield notificationsNumbers_1.default.findOneAndRemove(notificationNumberToRemove);
    return notificationNumber;
});
exports.default = {
    getNotificationsNumbers,
    createNotificationNumber,
    updateNotificationNumber,
    removeNotificationNumber,
};
