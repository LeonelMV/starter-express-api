import { 
    statisticsService
} from '../services';

const getOperationsCount = async (req, res) => {
    const { sinceDate, untilDate } = req.query; 
    const data = await statisticsService.getOperationsCount(sinceDate, untilDate).catch(error => res.status(400).send(error?.data?.msg));     
    return res.status(200).send(data);
}

const getOperationsCountByDate = async (req, res) => {
    const { sinceDate, untilDate } = req.query; 
    const data = await statisticsService.getOperationsCountByDate(sinceDate, untilDate).catch(error => res.status(400).send(error?.data?.msg));     
    return res.status(200).send(data);
}

export default {
    getOperationsCount,
    getOperationsCountByDate,
}