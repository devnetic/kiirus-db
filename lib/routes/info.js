"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = void 0;
const stats_1 = require("./../support/stats");
exports.info = [{
        method: 'GET',
        url: '/info',
        handler: (request, response) => {
            response.send({ uptime: stats_1.getUptime() });
        }
    }];
//# sourceMappingURL=info.js.map