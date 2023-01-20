import crypto from 'crypto';

const sign = (queryString) => {
    return crypto
        .createHmac('sha256', process.env.BINANCE_API_SECRET)
        .update(queryString)
        .digest('hex');
}

export default {
    sign,
}