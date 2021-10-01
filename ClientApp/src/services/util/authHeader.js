"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthToken = exports.getAuthToken = void 0;
function getAuthToken() {
    var _a;
    var user = JSON.parse(localStorage.getItem("user") || '{}');
    if (user !== null) {
        return (_a = user.authHeader) === null || _a === void 0 ? void 0 : _a.token;
    }
    return null;
}
exports.getAuthToken = getAuthToken;
function setAuthToken(user, newToken) {
    user.authHeader = { token: "Bearer " + newToken };
    localStorage.setItem("user", JSON.stringify(user));
}
exports.setAuthToken = setAuthToken;
//# sourceMappingURL=authHeader.js.map