import crypto from 'crypto';

const sign = (queryString: string) => {
    const binanceApiKey: string | any = process.env['BINANCE_API_SECRET'];
    return crypto
        .createHmac('sha256', binanceApiKey)
        .update(queryString)
        .digest('hex');
}

export default {
    sign,
}