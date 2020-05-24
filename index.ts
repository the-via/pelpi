const { version } = require("./package.json");
const readline = require("readline");
import { evalExpr, Type } from "./instr";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ">> ",
});

console.log(`Pelpi Version: ${version}`);

let expression = "";
rl.prompt();
rl.on("line", (line) => {
  const endProgram = line.trim().slice(-1)[0] === ";";
  try {
    if (endProgram) {
      expression += line.trimEnd().slice(0, -1);
      console.log("Parsed: ", JSON.stringify(evalExpr(expression, {a:[1,2]}), undefined, 2));
      expression = "";
      rl.setPrompt(">> ");
      rl.prompt();
    } else {
      rl.setPrompt("");
      expression += line;
    }
  } catch (e) {
    console.error(e);
    expression = "";
    rl.setPrompt(">> ");
    rl.prompt();
  }
}).on("close", () => {
  process.exit();
});
