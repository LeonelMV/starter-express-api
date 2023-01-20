"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const commons_1 = require("../commons");
const accountInformationSocketClient_1 = __importDefault(require("./accountInformationSocketClient"));
const binanceSocketClient_1 = __importDefault(require("./binanceSocketClient"));
const init = () => {
    const wss = new ws_1.default.Server({ port: process.env['WEBSOCKET_SERVER_PORT'] });
    wss.on('connection', (ws) => {
        commons_1.logger.info(`Nuevo cliente web a la escucha de WEBSOCKETS.`);
    });
    const sendMessage = (message) => {
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    };
    accountInformationSocketClient_1.default.init(sendMessage);
    binanceSocketClient_1.default.init(sendMessage);
};
exports.default = {
    init
};
