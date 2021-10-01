"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
var genericRequest_1 = require("./genericRequest");
function login(loginInfo) {
    return genericRequest_1.baseRequest.post('/login', loginInfo);
}
exports.login = login;
function logout() {
    return genericRequest_1.authRequest.post('/logout');
}
exports.logout = logout;
//# sourceMappingURL=userRequest.js.map