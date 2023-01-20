import {
    notificationsService
} from '../services';

const getNotificationsNumbers = async (req, res) => {
    const notificationNumbers = await notificationsService.getNotificationsNumbers().catch(error => res.status(500).send(error));
    return res.status(200).send(notificationNumbers);
}

const createNotificationNumber = async (req, res) => {
    const { name, number, apikey } = req.body;
    if(number && apikey){
        const notificationNumber = await notificationsService.createNotificationNumber(name, number, apikey).catch(error => res.status(500).send(error));
        return res.status(200).send(notificationNumber);
    }
}

const updateNotificationNumber = async (req, res) => {
    //TODO
}

const removeNotificationNumber = async (req, res) => {
    //TODO
}

export default {
    getNotificationsNumbers,
    createNotificationNumber,
    updateNotificationNumber,
    removeNotificationNumber,
}