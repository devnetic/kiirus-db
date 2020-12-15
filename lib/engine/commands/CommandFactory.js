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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandFactory = void 0;
const utils = __importStar(require("@devnetic/utils"));
const CollectionCommand_1 = require("./CollectionCommand");
const entities_1 = require("./../entities");
const DatabaseCommand_1 = require("./DatabaseCommand");
const support_1 = require("./../../support");
class CommandFactory {
    /**
     *
     * @param {string} command
     * @returns {string}
     */
    static formatAction(action) {
        return utils.camelCase(action);
    }
    static getCommand(command, action) {
        switch (command) {
            case 'collection':
                return new CollectionCommand_1.CollectionCommand(this.formatAction(action));
            case 'database':
                return new DatabaseCommand_1.DatabaseCommand(this.formatAction(action));
            default:
                throw new Error(support_1.getErrorMessage('KDB0005'));
        }
    }
    static execute(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const { command, action, options } = request.body;
            // console.log({ command, action, options })
            try {
                const result = yield this.getCommand(command, action).run(new entities_1.Database(), options);
                return result;
            }
            catch (error) {
                const errorMessage = support_1.unexpectedError(error.message || error, command);
                const stack = error.stack.split(/\n/g).slice(1).map((line) => '  ' + line.trim());
                console.log(`${error.message} - Stack \n[\n%s\n]`, stack.join('\n'));
                return errorMessage;
            }
        });
    }
}
exports.CommandFactory = CommandFactory;
//# sourceMappingURL=CommandFactory.js.map