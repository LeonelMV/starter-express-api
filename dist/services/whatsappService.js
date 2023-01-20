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
const axios_1 = __importDefault(require("axios"));
const _1 = require(".");
const commons_1 = require("../commons");
const sendMessage = (number, text, apikey) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const response = yield axios_1.default.get(`https://api.callmebot.com/whatsapp.php?phone=${number}&text=${text}&apikey=${apikey}`).catch(error => {
            throw new Error(error);
        });
        result = response.data;
    }
    catch (error) {
        result = error;
    }
    return result;
});
const sendNotificationsToAllMembers = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notificationNumbers = yield _1.notificationsService.getNotificationsNumbers().catch(error => commons_1.logger.error(error));
        notificationNumbers.forEach(notificationNumber => sendMessage(notificationNumber.number, text, notificationNumber.apikey));
    }
    catch (error) {
        commons_1.logger.error(error);
    }
});
exports.default = {
    sendMessage,
    sendNotificationsToAllMembers,
};
