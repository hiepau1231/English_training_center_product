"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const path_1 = __importDefault(require("path"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'english_tranning_center',
    synchronize: false,
    logging: false,
    entities: [
        path_1.default.join(__dirname, "/../entities/*.ts"), // Hỗ trợ cả TS và JS
    ],
    migrations: [
        path_1.default.join(__dirname, '/../migrations/*ts'),
    ],
});
//# sourceMappingURL=database.js.map