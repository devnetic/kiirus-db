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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionCommand = void 0;
const BaseCommand_1 = require("./BaseCommand");
const support_1 = require("./../../support");
class CollectionCommand extends BaseCommand_1.BaseCommand {
    run(database, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options.database) {
                throw new Error('No database selected');
            }
            database.use(options.database);
            const collection = database.getCollection(options.collection);
            if (!Reflect.has(collection, this.action)) {
                throw new Error(support_1.getErrorMessage('KDB0002'));
            }
            // const result = await Reflect.get(collection, this.action, collection)(options)
            const result = yield collection[this.action](options);
            return result;
        });
    }
}
exports.CollectionCommand = CollectionCommand;
//# sourceMappingURL=CollectionCommand.js.map