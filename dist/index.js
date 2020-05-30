"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var version = require("../package.json").version;
var readline = require("readline");
__export(require("./instr"));
var instr_1 = require("./instr");
console.log("Pelpi Version: " + version);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">> ",
});
var handleLine = function (accStatement, answer) {
    var statementEnd = answer.trim().slice(-1)[0] === ";";
    var currLine = statementEnd ? answer.trim().slice(0, -1) : answer;
    var statement = "" + accStatement + currLine;
    if (statementEnd) {
        console.log("Parsed: ", JSON.stringify(instr_1.evalExpr(statement, { a: [1, 2] }), undefined, 2));
        startStatement();
    }
    else {
        continueStatement(statement);
    }
};
function startStatement() {
    rl.question(">> ", function (line) { return handleLine("", line); });
}
function continueStatement(prevString) {
    rl.question("", function (line) { return handleLine(prevString, line); });
}
startStatement();
