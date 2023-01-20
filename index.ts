'use strict'

import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';

import {
  logger
} from './commons';

import {
  //coinsCotizationCron,
  openOrdersCheckCron,
  //statisticsDailyResumeCron,
} from './crons';

import webSockets from './websockets';

dotenv.config();

const main = async () => {
  logger.info("** INITIALIZING BOT GOKU **");
  webSockets.init();
  //coinsCotizationCron.init();
  openOrdersCheckCron.init();
  //statisticsDailyResumeCron.init();
}

mongoose.connect(process.env['MONGO_DB'] || '', { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
  if(error){
    return logger.error(`Error al conectar a la base de datos ${error}`);
  }
  logger.info("Conexion a la base de datos establecida. ");
  app.listen(process.env['PORT'], () => {
    logger.info(`Hamster rolling on port ${process.env['PORT']}`);
    main();
  });
});