export type Type = {};

/* Operator Precedence - Hi to Lo
  {} - Substitution 
  .  - Access
  () - Grouping
  !  - Not
  <  - Less Than
  <= - Less Than or Equal
  >  - Greater Than
  >= - Greater Than or Equal
  == - Equals
  != - Not Equals
  && - And
  || - Or
*/

enum Op {
  ExprStart,
  Seperator = " ",
  Or = "||",
  And = "&&",
  Eq = "==",
  LT = "<",
  LTE = "<=",
  GT = ">",
  GTE = ">=",
  Not = "!",
  NotEq = "!=",
  GetStart = "{",
  GetEnd = "}",
  Prop = ".",
  BracketStart = "(",
  BracketEnd = ")",
}

function cleanAndSplit(expr: string) {
  const cleanedStr = expr.replace(/\s+/gi, Op.Seperator);
  console.log(cleanedStr);
  return cleanedStr.split("");
}

function tokenizer(state, rest: string[]) {
  switch (state) {
    case Op.ExprStart: {
    }
  }
}

export function validate(expr: string) {
  const stream = cleanAndSplit(expr);
  console.log(stream);
  return true;
}
