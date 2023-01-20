import { Request, Response } from 'express';
import { coinsService } from '../services';

 const getJumpsSimulation = async (req: Request, res: Response) => {
    const { name, percentage, investment, sinceDate, untilDate } = req.query;
    req.setTimeout(1000 * 60 * 60 * 24);
    let criteria: any = {};
    if(name){
       criteria.name = name;
    }
   const data = await coinsService.getJumpsSimulation(criteria, percentage, investment, sinceDate, untilDate).catch(error => error);  
   return res.status(200).send(data);
 }

export default {
   getJumpsSimulation,
}