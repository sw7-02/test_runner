"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Reads from .env
const error = (msg) => {
    console.error("Failed: " + msg);
    process.exit(1);
};
exports.default = {
    jwt: {
        jwtSecret: process.env["JWT_SECRET"] || error("No JWT secret supplied"),
        jwtDeadline: process.env["JWT_DEADLINE"] || "1h",
        jwtHeader: process.env["JWT_HEADER"] || "auth-token",
    },
    auth: {
        salt: process.env["PW_SALT"] || 8,
    },
};
