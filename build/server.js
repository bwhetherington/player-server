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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
exports.__esModule = true;
exports.initServer = void 0;
var express = require("express");
var db_1 = require("./db");
var path = require("path");
var util_1 = require("./util");
var auth_1 = require("./auth");
var account_1 = require("./account");
var port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3030;
function initServer() {
    return __awaiter(this, void 0, void 0, function () {
        var db, app;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.initDb()];
                case 1:
                    db = _a.sent();
                    console.log('database initialized');
                    app = express();
                    app.use(express.urlencoded({
                        extended: true
                    }));
                    app.use(express.json());
                    app.use(auth_1.authenticate(db));
                    app.get('/user/:username', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var username, player, view;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log(req.user);
                                    username = req.params.username;
                                    console.log('GET', username);
                                    if (!username) return [3 /*break*/, 2];
                                    return [4 /*yield*/, db.collection('accounts')
                                            .findOne({ username: username })];
                                case 1:
                                    player = _a.sent();
                                    if (player) {
                                        view = db_1.createAccountView(player);
                                        res.json(view);
                                    }
                                    else {
                                        res.status(404);
                                        res.send('404: User not found');
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    res.status(404);
                                    res.send('404: User not found');
                                    _a.label = 3;
                                case 3:
                                    console.log('end');
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/register', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, username, password, passwordHash, account;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = req.body, username = _a.username, password = _a.password;
                                    if (!(typeof username === 'string' && typeof password === 'string')) return [3 /*break*/, 4];
                                    return [4 /*yield*/, db.collection('accounts').findOne({ username: username })];
                                case 1:
                                    // Check if account with this username already exists
                                    if (_b.sent()) {
                                        res.status(409).json({ message: 'An account with that username already exists' });
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, util_1.hashPassword(password)];
                                case 2:
                                    passwordHash = _b.sent();
                                    account = {
                                        username: username,
                                        passwordHash: passwordHash,
                                        className: 'Hero',
                                        xp: 0,
                                        permissionLevel: 0
                                    };
                                    return [4 /*yield*/, db.collection('accounts')
                                            .insertOne(account)];
                                case 3:
                                    _b.sent();
                                    res.status(201).json(req.body);
                                    return [3 /*break*/, 5];
                                case 4:
                                    res.status(400).json({ message: 'Account username or password was not properly specified.' });
                                    _b.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            console.log('login', req.user);
                            if (req.user) {
                                res.status(200).json(req.user);
                            }
                            else {
                                res.status(401).json({ message: 'Invalid login credentials.' });
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    app.post('/update', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('update', req.user, req.body);
                                    if (!account_1.isAccount(req.body)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, db.collection('accounts')
                                            .findOneAndUpdate({ username: req.user.username }, { $set: req.body })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/', function (req, res) {
                        var file = path.join(__dirname, '..', 'index.html');
                        console.log(file);
                        res.sendFile(file);
                    });
                    return [2 /*return*/, app];
            }
        });
    });
}
exports.initServer = initServer;
