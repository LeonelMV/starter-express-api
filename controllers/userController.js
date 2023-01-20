'use strict'

import User from '../models/user';
import service from '../services';

const signUp = (req, res) => {
  const { email, password, displayName } = req.body;
  const user = new User({ email, password, displayName });

  User.findOne({email: user.email}, (error, user) => {
    if(user){
      res.status(403).send({messsage:'El email ingresado ya se encuentra en uso.'});
    }
    user.save(error => {
      if(error){
        res.status(500).send({messsage:`Se produjo un error al registrar el nuevo usuario. ${error}`});
      }
      res.status(200).send({token: service.createToken(user)});
    });
  });
}

const signIn = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (error, user) => {
    if(error){
      res.status(500).send({messsage:`Se produjo un error al loguear el usuario. ${error}`})
    }
    if(!user || !req.body.password || !user.comparePassword(req.body.password)){
      res.status(404).send({messsage:"El Usuario no existe o la Clave es incorrecta."})
    }

    req.user = user;
    res.status(200).send({message: "Te has logueado correctamente.", token: service.createToken(user)});
  });
}

export default {
  signUp,
  signIn
};
