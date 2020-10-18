"use strict";
exports.__esModule = true;
exports.isAccount = void 0;
function isAccount(x) {
    console.log('isAccount', x);
    if (x) {
        var username = x.username, className = x.className, xp = x.xp, permissionLevel = x.permissionLevel;
        return ((username === undefined || typeof username === 'string') &&
            (className === undefined || typeof className === 'string') &&
            (xp === undefined || typeof xp === 'number') &&
            (permissionLevel === undefined || typeof permissionLevel === 'number'));
    }
    else {
        return false;
    }
}
exports.isAccount = isAccount;
