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
exports.signUp = exports.login = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt = __importStar(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
const jwt = __importStar(require("jsonwebtoken"));
//TODO: Check for length, numbers, special character, etc.
function validateAndHashPassword(pw) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt.hash(pw, config_1.default.auth.salt);
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send();
        }
        yield validateAndHashPassword(password).then((encrypt) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.user
                    .findFirstOrThrow({
                    where: { username, password: encrypt },
                    select: { user_id: true, username: true },
                })
                    .then(({ user_id, username }) => {
                    res.setHeader(config_1.default.jwt.jwtHeader, jwt.sign({ user_id, username }, config_1.default.jwt.jwtSecret, {
                        expiresIn: config_1.default.jwt.jwtDeadline,
                    }));
                    res.send();
                }, (_) => res.status(500).send());
            }
            catch (e) {
                res.status(301).send("Username does not exist");
            }
        }), (e) => res.status(301).send(`Password not valid: ${e}`));
    });
}
exports.login = login;
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send();
        }
        yield validateAndHashPassword(password).then((encrypt) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.default.user
                    .findFirstOrThrow({
                    where: { username },
                })
                    .finally(() => res.status(409).send("Username exists"));
            }
            catch (e) {
                // Add user
                let { user_id } = yield prisma_1.default.user.create({
                    data: {
                        username,
                        password: encrypt,
                    },
                });
                res.setHeader(config_1.default.jwt.jwtHeader, jwt.sign({ user_id, username }, config_1.default.jwt.jwtSecret, {
                    expiresIn: config_1.default.jwt.jwtDeadline,
                }));
                res.send(`User ${username} created!`);
            }
        }), (e) => res.status(301).send(`Password not valid: ${e}`));
    });
}
exports.signUp = signUp;
