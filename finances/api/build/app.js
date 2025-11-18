"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, indexRouter_1.default)(app);
exports.default = app;
