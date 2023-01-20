'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const services_1 = __importDefault(require("../services"));
const signUp = (req, res) => {
    const { email, password, displayName } = req.body;
    const user = new user_1.default({ email, password, displayName });
    user_1.default.findOne({ email: user.email }, (error, user) => {
        if (user) {
            res.status(403).send({ messsage: 'El email ingresado ya se encuentra en uso.' });
        }
        user.save(error => {
            if (error) {
                res.status(500).send({ messsage: `Se produjo un error al registrar el nuevo usuario. ${error}` });
            }
            res.status(200).send({ token: services_1.default.createToken(user) });
        });
    });
};
const signIn = (req, res) => {
    const { email } = req.body;
    user_1.default.findOne({ email }, (error, user) => {
        if (error) {
            res.status(500).send({ messsage: `Se produjo un error al loguear el usuario. ${error}` });
        }
        if (!user || !req.body.password || !user.comparePassword(req.body.password)) {
            res.status(404).send({ messsage: "El Usuario no existe o la Clave es incorrecta." });
        }
        req.user = user;
        res.status(200).send({ message: "Te has logueado correctamente.", token: services_1.default.createToken(user) });
    });
};
exports.default = {
    signUp,
    signIn
};
