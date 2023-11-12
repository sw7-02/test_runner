"use strict";
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
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const routes = (0, express_1.Router)();
routes.get("/", (_, res) => {
    console.log("connect");
    res.status(201).send("Hello World!");
});
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
routes.get("/delay", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield delay(10000);
    res.status(201).send("Delayed");
}));
routes.get("/prismatest", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(201).send(`User count from Prisma: ${yield prisma_1.default.user.count()}`);
    }
    catch (e) {
        console.error("Error when getting Prisma: " + e);
        res.status(401).send(`Error: ${e}`);
    }
}));
exports.default = routes;
