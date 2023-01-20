import { binanceService } from '../services';
 
const getCoinData = async (req, res) => {
   try{
      const symbol = req.query.symbol;
      const data = await binanceService.getCoinData(symbol).catch(error => error);
      return res.status(200).send(data);
   }catch(error){
      return res.status(error?.status || 500).send(error?.data || "Se ha producido un error");
   }
}

const getAllSymbolsUSDT = async (req, res) => {
   try{
      const data = await binanceService.getAllSymbolsUSDT().catch(error => error);
      return res.status(200).send(data);
   }catch(error){
      return res.status(error?.status || 500).send(error?.data || "Se ha producido un error");
   }
}

const createNewOrder = async (req, res) => {
   try{
      const { symbol, side, quantity, price } = req.query;
      const data = await binanceService.createNewOrder(symbol, side, quantity, price).catch(error => error);
      return res.status(200).send(data);
   }catch(error){
      return res.status(error?.status || 500).send(error?.data || "Se ha producido un error");
   }
}

 const getAccountInformation = async (req, res) => {
   try{
      const data = await binanceService.getAccountInformation().catch(error => error);
      return res.status(200).send(data);
   }catch(error){
      return res.status(error?.status || 500).send(error?.data || "Se ha producido un error");
   } 
 }

 const getAllCurrentOpenOrders = async (req, res) => {
   try{
      const symbol = req.query.symbol;
      const data = await binanceService.getAllCurrentOpenOrders(symbol).catch(error => error);
      return res.status(200).send(data);
   }catch(error){
      return res.status(error?.status || 500).send(error?.data || "Se ha producido un error");
   }
 }

 const cancelAllOrders = async (req, res) => {
    try{
      const symbol = req.query.symbol;
      const data = await binanceService.cancelAllOrders(symbol).catch(error => error);
      return res.status(200).send(data);
   }catch(error){
      return res.status(error?.status || 500).send(error?.data || "Se ha producido un error");
   }
 }

const getAccountTrades = async (req, res) => {
   try{
      const { symbol, startTime, endTime, fromId, limit } = req.query;
      const data = await binanceService.getAccountTrades(symbol, startTime, endTime, fromId, limit).catch(error => error);
      return res.status(200).send(data);
   }catch(error){
      return res.status(error?.status || 500).send(error?.data || "Se ha producido un error");
   }
}

const getBalanceForAllCoins = async (req, res) => {
   try{
      const data = await binanceService.getBalanceForAllCoins().catch(error => error);
      return res.status(200).send(data);
   }catch(error){
      return res.status(error?.status || 500).send(error?.data || "Se ha producido un error");
   }
}

const getAccountTradesBetweenDates = async (req, res) => {
   try{
      const data = await binanceService.getAccountTradesBetweenDates().catch(error => error);
      return res.status(200).send(data);
   }catch(error){
      return res.status(error?.status || 500).send(error?.data || "Se ha producido un error");
   }
}

export default {
    getCoinData,
    createNewOrder,
    getAccountInformation,
    getAllCurrentOpenOrders,
    cancelAllOrders,
    getAccountTrades,
    getBalanceForAllCoins,
    getAccountTradesBetweenDates,
    getAllSymbolsUSDT,
};