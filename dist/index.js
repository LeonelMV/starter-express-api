'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const commons_1 = require("./commons");
const crons_1 = require("./crons");
const websockets_1 = __importDefault(require("./websockets"));
dotenv_1.default.config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    commons_1.logger.info("** INITIALIZING BOT GOKU **");
    websockets_1.default.init();
    crons_1.coinsCotizationCron.init();
    crons_1.openOrdersCheckCron.init();
    //statisticsDailyResumeCron.init();
});
mongoose_1.default.connect(process.env['MONGO_DB'], { useNewUrlParser: true, useUnifiedTopology: true }, (error, response) => {
    if (error) {
        return commons_1.logger.error(`Error al conectar a la base de datos ${error}`);
    }
    commons_1.logger.info("Conexion a la base de datos establecida. ");
    app_1.default.listen(process.env['PORT'], () => {
        commons_1.logger.info(`Hamster rolling on port ${process.env['PORT']}`);
        main();
    });
});
