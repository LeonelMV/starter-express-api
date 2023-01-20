import axios from 'axios';
import {
    notificationsService,
} from '.';

import {
    logger,
} from '../commons';

const sendMessage = async (number, text, apikey) => {
    let result;
    try {
        const response = await axios.get(`https://api.callmebot.com/whatsapp.php?phone=${number}&text=${text}&apikey=${apikey}`).catch(error => {
            throw new Error(error)
        });
        result = response.data;
    } catch(error) {
        result = error;
    }
    return result;
}
const sendNotificationsToAllMembers = async (text) => {
    try {
        const notificationNumbers = await notificationsService.getNotificationsNumbers().catch(error => logger.error(error));
        notificationNumbers.forEach(notificationNumber => sendMessage(notificationNumber.number, text, notificationNumber.apikey));  
    } catch (error){
        logger.error(error);
    }
}

export default {
    sendMessage,
    sendNotificationsToAllMembers,
};