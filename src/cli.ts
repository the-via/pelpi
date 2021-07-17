const { version } = require("../package.json");
const chalk = require('chalk');
const readline = require("readline");
import { evalExpr, parseExpr } from "./index";
console.log(`Pelpi Version: ${version}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.yellow(">> "),
});

const parseVector = (expr: string) => {
  return expr.trim().split(/\s+/).map(ex => {
    const num = parseInt(ex, 10);
    if (Number.isNaN(num)) {
      throw Error(`${ex} is not a valid number`);
    }
    return num;
  });
}

const requestVars = ([car, ...cdr]: string[], callback: (res: {[r: string]: number[]}) => void, acc = {}) => {
  if (car === undefined) {
    return callback(acc);
  }
  rl.question(chalk.magenta(`[${car}]: `), (line: string) => {
    try {
      const parsedVector = parseVector(line);
      return requestVars(cdr, callback, {...acc, [car]: parsedVector});
    } catch (e) {
      console.error(chalk.red("Error parsing variable: "));
      console.error(e);
      startStatement();
    }
  });
}

const handleLine = (accStatement: string, answer: string) => {
  const statementEnd = answer.trim().slice(-1)[0] === ";";
  const currLine = statementEnd ? answer.trim().slice(0, -1) : answer;
  const statement = `${accStatement}${currLine}`;
  if (statementEnd) {
    try {
      const {ast, state} = parseExpr(statement);
      const keys = Object.keys(state);
      const vars = requestVars(keys, (vars: {[a:string]: number[]}) => {
        console.log(
          chalk.green("-> "),
          evalExpr(statement, vars)
        );
        startStatement();
      });
    } catch (e) {
      console.error(chalk.red('Error parsing expression:'));
      console.error(e);
      startStatement();
    }
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