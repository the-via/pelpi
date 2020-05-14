export type Type = {};

export type Label = {
  label: string;
};
export type SampleMenu = Label & {
  submenus: Submenu[];
};

export type Submenu = Label & {
  items: Item[];
};

export type Item = Label & Bindable & Conditional & Control;
export type Control = Keycode | Color | Toggle | Dropdown;

export type Keycode = {
  type: "keycode";
};
export type Color = {
  type: "color";
};

export type Toggle = {
  type: "toggle";
  options?: [number, number];
};

export type Dropdown = {
  type: "dropdown";
  options: (string | [number, string])[];
};

export type Group = Conditional & {
  type: "group";
  items: Item[];
};

export type Conditional = {
  hideIf?: Expr;
};
export type Bindable = {
  command: number[];
};

export type Expr = string;

export function validate(expr: string) {
  return true;
}
