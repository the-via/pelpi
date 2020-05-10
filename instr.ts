export type Type = {};

export type SampleMenu = {
  label: string;
  submenus: Submenu[];
};

export type Submenu = {
  label: string;
  items: Item[];
};

export type Control = {};

export type Item = {
  label: string;
  value: string | Control | number;
  meta?: {
    visible: Expr;
  };
};

export type Expr = string;

export function validate(expr: string) {
  return true;
}
