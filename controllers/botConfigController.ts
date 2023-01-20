import { botConfigService } from '../services';

const getBotConfig = async (req, res) => {
    const data = await botConfigService.getBotConfig();
    return res.status(200).send(data);
}

const createBotConfig = async (req, res) => {
    const { coin, symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell } = req.body;
    const data = await botConfigService.createBotConfig(coin, symbol, percentage, commission, automaticReinvestment, enabled, allowedToBuy, allowedToSell);
    return res.status(200).send(data);
}

const updateBotConfig = async (req, res) => {
    const { id } = req.params;
    const { percentage, commission } = req.body;
    const data = await botConfigService.updateBotConfig(id, percentage, commission);
    return res.status(200).send(data);
}

const deleteBotConfig = async (req, res) => {
    const { id } = req.params;
    const data = await botConfigService.deleteBotConfig(id);
    return res.status(200).send(data);
}

export default {
    getBotConfig,
    createBotConfig,
    updateBotConfig,
    deleteBotConfig
};