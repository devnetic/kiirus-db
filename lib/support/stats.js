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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStartTime = exports.setEndTime = exports.getUptime = void 0;
const utils = __importStar(require("@devnetic/utils"));
const stats = {
    startTime: 0,
    endTime: 0
};
const getUptime = () => {
    return utils.msToTime(Date.now() - stats.startTime);
};
exports.getUptime = getUptime;
const setEndTime = () => {
    stats.endTime = Date.now();
};
exports.setEndTime = setEndTime;
const setStartTime = () => {
    stats.startTime = Date.now();
};
exports.setStartTime = setStartTime;
//# sourceMappingURL=stats.js.map