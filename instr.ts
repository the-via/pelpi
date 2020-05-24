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

enum Token {
  Operator,
  Value,
  InfixOp,
  Expr
}

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

function isOp(op: any) {
  return isTwoCharOp(op.op) || isOneCharOp(op.op);
}

function isValue(op: any) {
  return typeof op === "number" || op.id !== undefined;
}

function isInfix(op: any) {
  return op === Op.Not;
}

function isExpr(op: any) {
  return Array.isArray(op);
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


export function validate(prevToken: Token, parseTree: any[]) {
  const [car,...cdr] = parseTree;
  if (parseTree.length === 0) {
    if (prevToken === Token.Value) {
      return [];
    }
    throw new Error(`Unexpected token at end of expr: ${prevToken}`);
  }
  switch (prevToken) {
    case Token.InfixOp:
    case Token.Operator:
    case Token.Expr: {
      if (isInfix(car)) {
        return [
          {mod:Op.Not, val: validate(Token.InfixOp, [cdr[0]])},
          ...validate(Token.Value, cdr.slice(1))];
      } else if (isExpr(car)) {
        return [validate(Token.Expr, car), ...validate(Token.Value,cdr)];
      } else if (isValue(car)) {
        return [car, ...validate(Token.Value,cdr)];
      } else {
        throw new Error(`Unexpected start of expr: ${car}`);
      }
    }
    case Token.Value: {
      if (isOp(car)) {
        return [car, ...validate(Token.Operator, cdr)];
      } else {
        throw new Error(`Unexpected token following Value: ${car}`);
      }
    }
  }
  throw new Error("unreachable");
}

function findSplitOp(arr: any[]) {
  const opPrecedence = [Op.Or, Op.And, Op.NotEq, Op.Eq, Op.GTE, Op.GT, Op.LTE, Op.LT];
  const chosenOp = opPrecedence.findIndex(op => arr.some(token => token.op === op));
  return chosenOp === -1 ? -1 : arr.findIndex(token => token.op === opPrecedence[chosenOp]);
}

function buildAST(expr){
  if (Array.isArray(expr)) {
    const opIndex = findSplitOp(expr);
    if (opIndex === -1) {
      if (expr.length === 1)  {
        return buildAST(expr[0]);
      } else {
        throw new Error("Expression has multiple entries but no operators");
      }
    } else {
      return {
        op: expr[opIndex].op,
        arg: [
          buildAST(expr.slice(0, opIndex)),
          buildAST(expr.slice(opIndex + 1))
        ]
      };
    }
  } else if (typeof expr === 'number') {
    return expr;
  } else if (typeof expr.id === "string") {
    return {op: 'get', arg: [expr.id, expr.prop ? expr.prop : 0]};
  } else if (expr.mod === Op.Not) {
    return {op: Op.Not, arg: buildAST(expr.val)};
  } else {
    throw new Error(`Error building AST while encountering: ${JSON.stringify(expr)}`);
  }
}

export function parse(expr: string) {
  const charStream = cleanAndSplit(expr);
  const tokenizedStream = tokenizer({ op: Op.ExprStart, partial: "" }, charStream);
  return buildAST(validate(Token.Expr,tokenizedStream));
}
