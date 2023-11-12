"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWT = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
/// Checks given JWT in the header of the requests, serves a new with a deadline of the provided config
const validateJWT = (req, res, next) => {
    //Get the jwt token from the header
    const token = req.headers["auth"];
    let jwtPayload;
    //Validate the token and get data
    try {
        jwtPayload = jwt.verify(token, config_1.default.jwt.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (error) {
        //If token is not valid, 401 (unauthorized)
        res.status(401).send();
        return;
    }
    //We want to send a new token on every request
    const { userId, username } = jwtPayload;
    res.setHeader(config_1.default.jwt.jwtHeader, jwt.sign({ userId, username }, config_1.default.jwt.jwtSecret, {
        expiresIn: config_1.default.jwt.jwtDeadline,
    }));
    //Call the next middleware or controller
    next();
};
exports.validateJWT = validateJWT;
