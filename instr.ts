export type Type = {};

export type Label = {
  label: string;
};

export type RawExpr = string;

// A property that when present, provides the option of not evaluating the block it represents
export type Conditional = {
  hideIf?: RawExpr;
};

// A structure that allows a grouping of items, generally useful for conditionally rendering a block of controls
// that share the same render condition
export type Group<A> = Conditional & Content<A[]>;

// VIA Groups
export type SubmenuSlice = Group<ControlItem>;
export type Submenu = Label & Group<VIAItem | SubmenuSlice>;
export type Menu = Label & Group<Submenu>;

// The "parameter" of the render function
export type Content<A> = {
  content: A;
};

export type TextContent = Content<string>;

// Specifies the get-set command prefix
// For fetching the current value: <CustomCommand> <BindableContent>
// For setting the current value: <CustomCommand> <BindableContent> <NewValue>
export type BindableContent = Content<CommandDef>;

export type CommandDef = [string, number | number[]];

// An atomic unit that represents a renderable unit - usually a Control
export type Item<A> = Label & Conditional & A;
export type ControlItem = Item<Control & BindableContent>;
export type TextItem = Item<TextContent>;
export type VIAItem = ControlItem | TextItem;

export type Control = Keycode | Color | Toggle | Dropdown;

// VIA Controls
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
  j;
  type: "dropdown";
  options: (string | [string, number])[];
};

export function validate(expr: string) {
  return true;
}
