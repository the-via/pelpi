const { version } = require("../package.json");
const chalk = require('chalk');
const readline = require("readline");
export * from "./instr";
import { evalExpr, parseExpr, Type } from "./instr";
console.log(`Pelpi Version: ${version}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.yellow(">> "),
});

const parseVector = (expr: string) => {
  return expr.split(/\s+/).map(ex => parseInt(ex));
}

const requestVars = ([car, ...cdr]: string[], callback: (res: {[r: string]: number[]}) => void, acc = {}) => {
  if (car === undefined) {
    return callback(acc);
  }
  rl.question(chalk.magenta(`[${car}]: `), (line: string) => (requestVars(cdr, callback, {...acc, [car]: parseVector(line)})));
}

const handleLine = (accStatement: string, answer: string) => {
  const statementEnd = answer.trim().slice(-1)[0] === ";";
  const currLine = statementEnd ? answer.trim().slice(0, -1) : answer;
  const statement = `${accStatement}${currLine}`;
  if (statementEnd) {
    const {ast, state} = parseExpr(statement);
    const keys = Object.keys(state);
    const vars = requestVars(keys, (vars: {[a:string]: number[]}) => {
      console.log(
        chalk.green("-> "),
        evalExpr(statement, vars)
      );
      startStatement();
    });
  } else {
    continueStatement(statement);
  }
};

function startStatement() {
  rl.question(chalk.yellow(">> "), (line: string) => handleLine("", line));
}

function continueStatement(prevString: string) {
  rl.question("", (line: string) => handleLine(prevString, line));
}

startStatement();
