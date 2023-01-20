import WebSocket from 'ws';

import { logger } from '../commons';

import accountInformationSocketClient from './accountInformationSocketClient';
import binanceSocketClient from './binanceSocketClient';

const init = () => {
    const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_SERVER_PORT });

    wss.on('connection', (ws) => {
        logger.info(`Nuevo cliente web a la escucha de WEBSOCKETS.`);
    });

    const sendMessage = (message) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    accountInformationSocketClient.init(sendMessage);
    binanceSocketClient.init(sendMessage);
}

export default {
    init
};