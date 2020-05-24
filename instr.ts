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
  NumCont,
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

function tokenizer({ op, partial }, rest: string[]) {
  if (rest.length === 0) {
    return [];
  }
  const [car, ...cdr] = rest;
  switch (op) {
    case Op.ExprStart: {
      if (/[0-9]/.test(car)) {
        return tokenizer({ op: Op.NumCont, partial: car }, cdr);
      } else if (car === Op.Seperator) {
        return tokenizer({ op: Op.ExprStart, partial: "" }, cdr);
      }
    }
    case Op.NumCont: {
      if (/[0-9]/.test(car) && cdr.length !== 0) {
        return tokenizer({ op: Op.NumCont, partial: partial + car }, cdr);
      } else if (/[0-9]/.test(car) && cdr.length === 0) {
        return [
          parseInt(partial + car, 10),
          ...tokenizer({ op: Op.ExprStart, partial: "" }, rest),
        ];
      } else {
        return [
          parseInt(partial, 10),
          ...tokenizer({ op: Op.ExprStart, partial: "" }, rest),
        ];
      }
    }
  }
}

export function validate(expr: string) {
  const stream = cleanAndSplit(expr);
  console.log(tokenizer({ op: Op.ExprStart, partial: "" }, stream));
  return true;
}
