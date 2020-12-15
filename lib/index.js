"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const loadEnv = __importStar(require("@devnetic/load-env"));
const routes = __importStar(require("./routes"));
const stats = __importStar(require("./support/stats"));
loadEnv.load();
loadEnv.load('.errors_description');
const app = fastify_1.default();
for (const [, module] of Object.entries(routes)) {
    for (const route of module) {
        app.route(route);
    }
}
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '8008';
const hostname = (_b = process.env.HOSTNAME) !== null && _b !== void 0 ? _b : '::';
app.listen(port, hostname, (error, address) => {
    if (error !== null) {
        console.error('Something bad happened: %o', error);
    }
    stats.setStartTime();
    const { address: hostname, port } = app.server.address();
    console.log(`Server is listening on host ${hostname} and port ${port}`);
});
//# sourceMappingURL=index.js.map