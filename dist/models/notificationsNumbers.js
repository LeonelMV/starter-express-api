'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const NotificationsNumbersSchema = new Schema({
    name: { type: String, required: true },
    number: { type: String, required: true, unique: true },
    apikey: { type: String, required: true, unique: true },
    enabled: { type: Boolean, default: true },
});
module.exports = mongoose_1.default.model('NotificationsNumbers', NotificationsNumbersSchema);
