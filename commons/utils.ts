import moment from 'moment-timezone';

const getCotizationGain = (initialValue: number, finalValue: number, percentage: number, investment: number) : string => {
    const logaritmPriceDifference = ((Math.log10(finalValue / initialValue) / Math.log10(1 / (1 - percentage))) * percentage * investment).toFixed(2);
    return logaritmPriceDifference;
}

const getBotGain = (rises: number, cotizationGain: number, initialValue: number, 
    finalValue: number, percentage: number, investment: number) : string => {
    let botGain = 0;
    const relativeGain = ((0.999 * percentage) / (1 - percentage)) - percentage / 0.999;
    if(cotizationGain > 0){
        botGain = (rises - (Math.log10(finalValue / initialValue) / Math.log10(1 / (1 - percentage)))) * relativeGain * investment;
    }else{
        botGain = rises * relativeGain * investment;
    }
    return botGain.toFixed(2);
}

const isSymbolInBlackList = (symbol: string) : boolean =>{
    return symbol && symbol.endsWith('UPUSDT') || symbol.endsWith('DOWNUSDT') || symbol.endsWith('BULLUSDT') || symbol.endsWith('BEARUSDT');
}

const getCurrentTime = () => {
    return moment.tz('America/Argentina/Buenos_Aires').format('DD-MM-YYYY HH:mm');
}

const getCoinName = (symbol: string) : string | undefined => {
    let coinName: string | undefined;
    const coinStrArray: string[] = symbol.split('USDT');
    if(coinStrArray.length > 0){
        coinName = coinStrArray[0];
    }
    return coinName;
}

export default {
    getCotizationGain,
    getBotGain,
    isSymbolInBlackList,
    getCurrentTime,
    getCoinName,
}