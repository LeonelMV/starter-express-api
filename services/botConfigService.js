import BotConfig from '../models/botConfig';

import {
    logger,
} from '../commons';

const getBotConfig = async (criteria = {}) => {
    const botConfig = await BotConfig.find(criteria, (error) => {
        if(error){
            logger.error(error);
        }
    });
    return botConfig;
}

const createBotConfig = async (coin, symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell) => {
    const botConfig = new BotConfig({ coin, symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell });
    const newBotConfig = await botConfig.save((error) => {
        if(error){
            logger.error(error);
        }
    });
    return newBotConfig;
}

const updateBotConfig = async (id, percentage, commission) => {
    const botConfig = await BotConfig.findOneAndUpdate({ _id: id }, { percentage, commission }, { new: true, useFindAndModify: true }, (error,) => {
        if(error){
            logger.error(error);
        }
    })
    .catch(error => {
        logger.error(error);
    });
    return botConfig;
}

const deleteBotConfig = async (id) => {
    const coin = await BotConfig.findOneAndRemove({ _id: id }, (error) => {
        if(error){
            logger.error(error);
        }
    });
    return coin;
}

export default {
    getBotConfig,
    createBotConfig,
    updateBotConfig,
    deleteBotConfig,
};