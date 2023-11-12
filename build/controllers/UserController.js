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
exports.listAll = exports.getUsernameById = void 0;
const prisma_1 = __importDefault(require("../prisma"));
function listAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //Get users from database
        const users = yield prisma_1.default.user.findMany({
            select: { user_id: true, username: true },
        });
        //Send the users object
        res.send(users);
    });
}
exports.listAll = listAll;
function getUsernameById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = res.locals.jwtPayload.userId;
        //Get users from database
        try {
            yield prisma_1.default.user
                .findFirstOrThrow({
                where: { user_id: id },
                select: { username: true },
            })
                .then((user) => res.send(user), (_) => res.status(500).send());
        }
        catch (e) {
            res.status(301).send();
        }
    });
}
exports.getUsernameById = getUsernameById;
