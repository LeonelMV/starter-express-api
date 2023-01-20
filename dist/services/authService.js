'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const createToken = (user) => {
    const payload = {
        sub: user._id,
        iat: (0, moment_timezone_1.default)().unix(),
        exp: (0, moment_timezone_1.default)().add(14, 'days').unix() //expira en 14 dias
    };
    return jwt_simple_1.default.encode(payload, process.env['SECRET_TOKEN']);
};
const decodeToken = (token) => {
    const decode = new Promise((resolve, reject) => {
        try {
            const payload = jwt_simple_1.default.decode(token, process.env['SECRET_TOKEN']);
            if (payload.exp <= (0, moment_timezone_1.default)().unix()) {
                reject({
                    status: 401,
                    message: "El Token ha expirado"
                });
            }
            resolve(payload.sub);
        }
        catch (error) {
            reject({
                status: 500,
                message: "Invalid Token"
            });
        }
    });
    return decode;
};
module.exports = {
    createToken,
    decodeToken
};
