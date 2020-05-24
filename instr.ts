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
  VarDecl,
  Op,
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
  return cleanedStr.split("");
}

function isTwoCharOp(op: any) {
  return [Op.Or, Op.And, Op.Eq, Op.LTE, Op.GTE, Op.NotEq].includes(op);
}

function isOneCharOp(op: any) {
  return [Op.LT, Op.GT].includes(op);
}

function isVarStart(op: any) {
  return [Op.GetStart].includes(op);
}

function isVarEnd(op: any) {
  return [Op.GetEnd].includes(op);
}

function isSubExprStart(op: any) {
  return [Op.BracketStart].includes(op);
}

function isSubExprEnd(op: any) {
  return [Op.BracketEnd].includes(op);
}

function isNum(op: any) {
  return /[0-9]/.test(op);
}

function findSubExprEndIndex(arr) {
  let i = 0;
  let level = 0;
  while (i < arr.length) {
    if (isSubExprEnd(arr[i]) && level === 0) {
      return i;
    } else if (isSubExprStart(arr[i])) {
      level++;
    } else if (isSubExprEnd(arr[i])) {
      level--;
    }
    i++;
  }
  throw new Error(`Unbalanced brackets in: ${arr}`);
}
  
function evalNot(notSwitch: boolean) {
  return notSwitch ? [] : [Op.Not];
}

function tokenizer({ op, partial }, rest: string[]) {
  const [car, ...cdr] = rest;
  if (rest.length === 0) {
    switch (op) {
      case Op.NumCont: return [parseInt(partial)];
      case Op.ExprStart: return [];
      default: {
        throw new Error(`Unexpected character encountered at end while in state: ${op}`);
      }
    }
  }
  switch (op) {
    case Op.ExprStart: {
      const twoStr = car + (cdr[0] !== undefined ? cdr[0] : '');
      if (isNum(car)) {
        return tokenizer({ op: Op.NumCont, partial: car }, cdr);
      } else if (car === Op.Seperator) {
        return tokenizer({ op: Op.ExprStart, partial: "" }, cdr);
      } else if (isTwoCharOp(twoStr)) {
        return [{op: twoStr}, ...tokenizer({op: Op.ExprStart, partial: ""}, cdr.slice(1))];
      } else if (isOneCharOp(car)) {
        return [{op:car}, ...tokenizer({op: Op.ExprStart, partial: ""}, cdr)];
      } else if (isVarStart(car)) {
        return tokenizer({ op: Op.VarDecl, partial: "" }, cdr);
      } else if (isSubExprStart(car)) {
        const endIndex = findSubExprEndIndex(cdr);
        return [tokenizer({op: Op.ExprStart, partial: ''}, cdr.slice(0, endIndex)),...tokenizer({op: Op.ExprStart, partial: ''}, cdr.slice(endIndex+1))];
      } else if (car === Op.Not) {
        return tokenizer({op: Op.Not, partial:false},cdr);
      } else {
        throw new Error(`Unexpected character encountered in expr decl: ${car}`);
      }
    }
    case Op.Not: {
      if (isNum(car)) {
        return [...evalNot(partial),...tokenizer({ op: Op.NumCont, partial: car }, cdr)];
      } else if (isVarStart(car)) {
        return [...evalNot(partial),...tokenizer({ op: Op.VarDecl, partial: "" }, cdr)];
      } else if (isSubExprStart(car)) {
        const endIndex = findSubExprEndIndex(cdr);
        return [...evalNot(partial),...[tokenizer({op: Op.ExprStart, partial: ''}, cdr.slice(0, endIndex)),...tokenizer({op: Op.ExprStart, partial: ''}, cdr.slice(endIndex+1))]];
      } else if (car === Op.Not) {
        return tokenizer({op: Op.Not, partial:!partial},cdr);
      } else {
        throw new Error(`Unexpected character encountered after !: ${car}`);
      }
    }
    case Op.VarDecl: {
      if (/[0-9a-zA-Z_-]/.test(car)) {
        return tokenizer({ op: Op.VarDecl, partial: partial + car }, cdr);
      } else if (car === Op.Prop) {
        return tokenizer({ op: Op.Prop, partial: {id: partial, prop: ""} }, cdr);
      } else if (isVarEnd(car)) {
        return [{id: partial}, ...tokenizer({ op: Op.ExprStart, partial: "" }, cdr)];
      } else {
        throw new Error(`Unexpected character encountered in var decl: ${car}`);
      }
    }
    case Op.Prop: {
      if (isNum(car)) {
        return tokenizer({ op: Op.Prop, partial: {...partial, prop: partial.prop+car } }, cdr);
      } else if (isVarEnd(car)) {
        return [{...partial, prop: parseInt(partial.prop)}, ...tokenizer({ op: Op.ExprStart, partial: "" }, cdr)];
      } else {
        throw new Error(`Unexpected character encountered in var decl: ${car}`);
      }
    }
    case Op.NumCont: {
      if (/[0-9]/.test(car)) {
        return tokenizer({ op: Op.NumCont, partial: partial + car }, cdr);
      } else {
        return [
          parseInt(partial, 10),
          ...tokenizer({ op: Op.ExprStart, partial: "" }, rest),
        ];
      }
    }
  }
}

export function parse(expr: string) {
  const charStream = cleanAndSplit(expr);
  const tokenizedStream = tokenizer({ op: Op.ExprStart, partial: "" }, charStream);
  validate(tokenizedStream);
  return tokenizedStream;
}

export function validate(parseTree: any[]) {
  
}
