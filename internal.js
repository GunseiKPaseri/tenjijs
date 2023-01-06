"use strict";
exports.__esModule = true;
exports.convertTenji = exports.extractOptional = exports.buildList = exports.extractList = exports.optionalList = exports.TYPES_TO_PROPERTY_NAMES = exports.buildBinaryExpression = exports.alterIdentify = exports.parseGS8Number = exports.parseNumber = exports.convertGS8 = void 0;
var tenji = require("tenji");
var gs8convert_1 = require("./gs8convert");
exports.convertGS8 = gs8convert_1.convertGS8;
var parseNumber = function (text) {
    return parseFloat(tenji.fromTenji(text.replace(/\u2840/g, ""), { kanji: true }));
};
exports.parseNumber = parseNumber;
var parseGS8Number = function (text) {
    return parseFloat((0, gs8convert_1.convertGS8)(text).replace(/,/, ""));
};
exports.parseGS8Number = parseGS8Number;
var alterChar = function (c) { var _a; return (((_a = c.codePointAt(0)) !== null && _a !== void 0 ? _a : 0x2800) - 0x2800).toString(16).padStart(2, "0"); };
var alterIdentify = function (id) {
    return "b" + id.split("").map(alterChar).join("");
};
exports.alterIdentify = alterIdentify;
var buildBinaryExpression = function (head, tail) {
    return tail.reduce(function (result, element) {
        return {
            type: "BinaryExpression",
            operator: (0, gs8convert_1.convertGS8)(element[1]),
            left: result,
            right: element[3]
        };
    }, head);
};
exports.buildBinaryExpression = buildBinaryExpression;
exports.TYPES_TO_PROPERTY_NAMES = {
    CallExpression: "callee",
    MemberExpression: "object"
};
var optionalList = function (value) {
    return value === null ? [] : value;
};
exports.optionalList = optionalList;
var extractList = function (list, index) {
    return list.map(function (element) { return element[index]; });
};
exports.extractList = extractList;
var buildList = function (head, tail, index) {
    return [head].concat((0, exports.extractList)(tail, index));
};
exports.buildList = buildList;
var extractOptional = function (optional, index) {
    return optional ? optional[index] : null;
};
exports.extractOptional = extractOptional;
var convertTenji = function (str) {
    return tenji.fromTenji(str, { kanji: true });
};
exports.convertTenji = convertTenji;
