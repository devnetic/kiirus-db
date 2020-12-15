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
exports.BaseCommonEntity = void 0;
const path_1 = __importDefault(require("path"));
const storage = __importStar(require("./../storage"));
class BaseCommonEntity {
    constructor() {
        this.name = '';
    }
    drop(database) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield storage.deleteDir(this.getPath(database));
                return true;
            }
            catch (error) {
                // throw new Error(this.getError(error))
                throw new Error(error);
            }
        });
    }
    /**
     * Return the collection path
     *
     * @param {string} [database]
     * @returns {string}
     * @memberof Collection
     */
    getPath(database) {
        var _a;
        return path_1.default.join((_a = process.env.DB_PATH) !== null && _a !== void 0 ? _a : '', database !== null && database !== void 0 ? database : this.name);
    }
    /**
     * Create the collection and the database directories if they don't exist
     *
     * @param {*} pathname
     * @returns Promise<boolean>
     * @memberof Collection
     */
    init(pathname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield storage.createDir(pathname, true, 0o766);
            }
            catch (error) {
                if ((error.message || error).indexOf('EEXIST') === -1) {
                    return new Error(error);
                }
                return true;
            }
        });
    }
    getError(error) {
        if (!error.code) {
            return error.message;
        }
        switch (error.code) {
            case 'ENOENT':
                return `'${this.name}' ${this.constructor.name.toLowerCase()} doesn't exist`;
            default:
                return error.message;
        }
    }
}
exports.BaseCommonEntity = BaseCommonEntity;
//# sourceMappingURL=BaseCommonEntity.js.map