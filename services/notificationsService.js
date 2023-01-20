import NotificationsNumbers from '../models/notificationsNumbers';

import {
    logger,
} from '../commons';

const getNotificationsNumbers = async (criteria = {}) => {
    const notificationsNumbers = await NotificationsNumbers.find(criteria, (error) => {
        if(error){
            logger.error(error);
        }
    });
    return notificationsNumbers;
}

const createNotificationNumber = async (name, number, apikey) => {
    const notificationNumbers = new NotificationsNumbers({ name, number, apikey });
    const result = await notificationNumbers.save((error) => {
        if(error){
            logger.error(error);
        }
    });
    return result;
}

const updateNotificationNumber = async (notificationNumberToUpdate) => {
    const notificationNumber = await NotificationsNumbers.findOneAndUpdate(notificationNumberToUpdate, (error) => {
        if(error){
            logger.error(error);
        }
    });
    return notificationNumber;
}

const removeNotificationNumber = async (notificationNumberToRemove) => {
    const notificationNumber = await NotificationsNumbers.findOneAndRemove(notificationNumberToRemove, (error) => {
        if(error){
            logger.error(error);
        }
    });
    return notificationNumber;
}

export default {
    getNotificationsNumbers,
    createNotificationNumber,
    updateNotificationNumber,
    removeNotificationNumber,
}