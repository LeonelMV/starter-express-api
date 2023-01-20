'use strict'

import jwt from 'jwt-simple';
import moment from 'moment-timezone';

const createToken = (user) => {
  const payload = {
    sub: user._id, //FIXME LEO CREAR OTRO ID PARA ESTE FIN
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix() //expira en 14 dias
  };
  return jwt.encode(payload, process.env.SECRET_TOKEN);
}

const decodeToken = (token) => {
  const decode = new Promise((resolve, reject) => {
    try{
      const payload = jwt.decode(token, process.env.SECRET_TOKEN);

      if(payload.exp <= moment().unix()){
        reject({
          status: 401,
          message: "El Token ha expirado"
        });
      }

      resolve(payload.sub);

    }catch(error){
      reject({
        status: 500,
        message: "Invalid Token"
      });
    }
  });
  return decode;
}

module.exports = {
  createToken,
  decodeToken
};
