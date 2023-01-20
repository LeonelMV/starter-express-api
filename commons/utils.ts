import moment from 'moment-timezone';

const getCotizationGain = (initialValue, finalValue, percentage, investment) => {
    const logaritmPriceDifference = ((Math.log10(finalValue / initialValue) / Math.log10(1 / (1 - percentage))) * percentage * investment).toFixed(2);
    return logaritmPriceDifference;
}

const getBotGain = (rises, cotizationGain, initialValue, finalValue, percentage, investment) => {
    let botGain = 0;
    const relativeGain = ((0.999 * percentage) / (1 - percentage)) - percentage / 0.999;
    if(cotizationGain > 0){
        botGain = (rises - (Math.log10(finalValue / initialValue) / Math.log10(1 / (1 - percentage)))) * relativeGain * investment;
    }else{
        botGain = rises * relativeGain * investment;
    }
    return botGain.toFixed(2);
}

const isSymbolInBlackList = (symbol) =>{
    return symbol && symbol.endsWith('UPUSDT') || symbol.endsWith('DOWNUSDT') || symbol.endsWith('BULLUSDT') || symbol.endsWith('BEARUSDT');
}

const getCurrentTime = () => {
    return moment.tz('America/Argentina/Buenos_Aires').format('DD-MM-YYYY HH:mm');
}

const getCoinName = (symbol) => {
    let coinName;
    const coinStrArray = symbol.split('USDT');
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