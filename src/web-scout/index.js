"use strict";
// @ts-check
// ...
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var playwright_chromium_1 = require("playwright-chromium");
var amazon_1 = require("./providers/amazon");
// const step = async (page: Page) => {
//     await page.goto('https://example.com/');
//
// }
// const generateActionsQueue = () => {
//     const queue: Action[] = [];
//
//     const add = (action: Action) => { queue.unshift(action) }
//
//     const pop = () => queue.pop();
//
//     // const get = () => queue;
//
//     return { add, pop , len: queue.length };
// }
var generateQueue = function () {
    var queue = [];
    var add = function (item) {
        queue.unshift(item);
    };
    var pop = function () { return queue.pop(); };
    return {
        add: add,
        pop: pop,
        get len() { return queue.length; }
    };
};
var inputsQueue = generateQueue();
var asins = ['B00ATHBO86', 'B07PRRRLHT', 'B002UP153Y', 'B00136MKEO'];
asins.forEach(function (asin) {
    inputsQueue.add({ productId: asin, storeName: 'amazon' });
});
var actionQueue = generateQueue();
var pricesQueue = generateQueue();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, context, page, input, provider, _i, _a, step, price, name_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('debug start in async');
                return [4 /*yield*/, playwright_chromium_1.chromium.launch({ headless: false })];
            case 1:
                browser = _b.sent();
                return [4 /*yield*/, browser.newContext()];
            case 2:
                context = _b.sent();
                return [4 /*yield*/, context.newPage()];
            case 3:
                page = _b.sent();
                // The actual interesting bit
                return [4 /*yield*/, context.route('**.jpg', function (route) { return route.abort(); })];
            case 4:
                // The actual interesting bit
                _b.sent();
                console.log('debug asuns and inptsQueue: ', asins, inputsQueue);
                _b.label = 5;
            case 5:
                if (!(inputsQueue.len > 0)) return [3 /*break*/, 13];
                input = inputsQueue.pop();
                provider = void 0;
                if (input.storeName === 'amazon') {
                    provider = (0, amazon_1.default)(page, input.productId);
                }
                else
                    throw 'Not Implemented';
                return [4 /*yield*/, page.goto(provider.url)];
            case 6:
                _b.sent();
                _i = 0, _a = provider.steps;
                _b.label = 7;
            case 7:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                step = _a[_i];
                return [4 /*yield*/, step()];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10: return [4 /*yield*/, provider.getPrice()];
            case 11:
                price = _b.sent();
                return [4 /*yield*/, provider.getProductName()];
            case 12:
                name_1 = _b.sent();
                console.log('debug: about to add to priceQueue: ', { store: input.storeName, price: price, name: name_1 });
                pricesQueue.add({ store: input.storeName, price: price, name: name_1 });
                return [3 /*break*/, 5];
            case 13: 
            // Teardown
            return [4 /*yield*/, context.close()];
            case 14:
                // Teardown
                _b.sent();
                return [4 /*yield*/, browser.close()];
            case 15:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); })();
console.log('priceQueue: ', pricesQueue);
