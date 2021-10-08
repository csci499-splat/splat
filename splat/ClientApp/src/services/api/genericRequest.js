"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequest = exports.baseRequest = void 0;
var axios_1 = require("axios");
var authHeader_1 = require("../util/authHeader");
var baseRequest = axios_1.default.create({
    baseURL: '/api',
    headers: {
        'Content-type': 'application/json',
    },
});
exports.baseRequest = baseRequest;
var authRequest = axios_1.default.create({
    baseURL: '/api',
    headers: {
        'Authorization': '',
        'Content-type': 'application/json',
    },
});
exports.authRequest = authRequest;
authRequest.interceptors.request.use(function (config) {
    var token = (0, authHeader_1.getAuthToken)();
    if (token !== null) {
        config.headers.Authorization = token;
    }
});
//# sourceMappingURL=genericRequest.js.map