"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient();
globalForPrisma.prisma = exports.prisma;
exports.default = exports.prisma;
