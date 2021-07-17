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
Object.defineProperty(exports, "__esModule", { value: true });
var version = require("../package.json").version;
var chalk = require('chalk');
var readline = require("readline");
var index_1 = require("./index");
console.log("Pelpi Version: " + version);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.yellow(">> "),
});
var parseVector = function (expr) {
    return expr.trim().split(/\s+/).map(function (ex) {
        var num = parseInt(ex, 10);
        if (Number.isNaN(num)) {
            throw Error(ex + " is not a valid number");
        }
        return num;
    });
};
var requestVars = function (_a, callback, acc) {
    var car = _a[0], cdr = _a.slice(1);
    if (acc === void 0) { acc = {}; }
    if (car === undefined) {
        return callback(acc);
    }
    rl.question(chalk.magenta("[" + car + "]: "), function (line) {
        var _a;
        try {
            var parsedVector = parseVector(line);
            return requestVars(cdr, callback, __assign(__assign({}, acc), (_a = {}, _a[car] = parsedVector, _a)));
        }
        catch (e) {
            console.error(chalk.red("Error parsing variable: "));
            console.error(e);
            startStatement();
        }
    });
};
var handleLine = function (accStatement, answer) {
    var statementEnd = answer.trim().slice(-1)[0] === ";";
    var currLine = statementEnd ? answer.trim().slice(0, -1) : answer;
    var statement = "" + accStatement + currLine;
    if (statementEnd) {
        try {
            var _a = index_1.parseExpr(statement), ast = _a.ast, state = _a.state;
            var keys = Object.keys(state);
            var vars = requestVars(keys, function (vars) {
                console.log(chalk.green("-> "), index_1.evalExpr(statement, vars));
                startStatement();
            });
        }
        catch (e) {
            console.error(chalk.red('Error parsing expression:'));
            console.error(e);
            startStatement();
        }
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
