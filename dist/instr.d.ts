export declare type Type = {};
declare enum Token {
    Operator = 0,
    Value = 1,
    InfixOp = 2,
    Expr = 3
}
export declare function validate(prevToken: Token, parseTree: any[]): any;
declare type ASTPair = {
    ast: any;
    state: {
        [key: string]: number;
    };
};
export declare function evalAST(ast: any, state: any): any;
export declare function evalExpr(expr: string, state: any): any;
export declare function parseExpr(expr: string): ASTPair;
export {};
