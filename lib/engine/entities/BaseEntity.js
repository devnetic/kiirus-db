"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
const BaseCommonEntity_1 = require("./BaseCommonEntity");
const Collection_1 = require("./Collection");
class BaseEntity extends BaseCommonEntity_1.BaseCommonEntity {
    /**
     *
     * @param {string} collection
     * @returns Collection
     */
    getCollection(collection) {
        return new Collection_1.Collection(this.name, collection);
    }
    /**
     * Select the given database
     *
     * @param {string} name
     */
    use(name) {
        this.name = name;
    }
}
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=BaseEntity.js.map