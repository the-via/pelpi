"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var version = require("../package.json").version;
var chalk = require('chalk');
var readline = require("readline");
__export(require("./instr"));
var instr_1 = require("./instr");
console.log("Pelpi Version: " + version);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.yellow(">> "),
});
var parseVector = function (expr) {
    return expr.split(/\s+/).map(function (ex) { return parseInt(ex); });
};
var requestVars = function (_a, callback, acc) {
    var car = _a[0], cdr = _a.slice(1);
    if (acc === void 0) { acc = {}; }
    if (car === undefined) {
        return callback(acc);
    }
    rl.question(chalk.magenta("[" + car + "]: "), function (line) {
        var _a;
        return (requestVars(cdr, callback, __assign(__assign({}, acc), (_a = {}, _a[car] = parseVector(line), _a))));
    });
};
var handleLine = function (accStatement, answer) {
    var statementEnd = answer.trim().slice(-1)[0] === ";";
    var currLine = statementEnd ? answer.trim().slice(0, -1) : answer;
    var statement = "" + accStatement + currLine;
    if (statementEnd) {
        var _a = instr_1.parseExpr(statement), ast = _a.ast, state = _a.state;
        var keys = Object.keys(state);
        var vars = requestVars(keys, function (vars) {
            console.log(chalk.green("-> "), instr_1.evalExpr(statement, vars));
            startStatement();
        });
    }
    else {
        continueStatement(statement);
    }
};
function startStatement() {
    rl.question(chalk.yellow(">> "), function (line) { return handleLine("", line); });
}
function continueStatement(prevString) {
    rl.question("", function (line) { return handleLine(prevString, line); });
}
startStatement();
