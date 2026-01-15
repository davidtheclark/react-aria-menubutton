import type { FocusGroup, FocusGroupMember } from "focus-group";
import type { TapListener } from "teeny-tap";

export interface ManagerOptions {
  onMenuToggle?: (state: { isOpen: boolean }) => void;
  onSelection?: (value: unknown, event: React.SyntheticEvent) => void;
  closeOnSelection?: boolean;
  closeOnBlur?: boolean;
  id?: string;
}

export interface MenuButtonManager {
  options: Required<Pick<ManagerOptions, "closeOnSelection" | "closeOnBlur">> &
    Omit<ManagerOptions, "closeOnSelection" | "closeOnBlur">;
  isOpen: boolean;
  button: ButtonInstance | null;
  menu: MenuInstance | null;
  focusGroup: FocusGroup;
  blurTimer: ReturnType<typeof setTimeout> | undefined;
  moveFocusTimer: ReturnType<typeof setTimeout> | undefined;

  init(options?: ManagerOptions): void;
  updateOptions(options?: ManagerOptions): void;
  focusItem(index: number): void;
  addItem(item: FocusGroupMember): void;
  clearItems(): void;
  handleButtonNonArrowKey(event: KeyboardEvent): void;
  destroy(): void;
  update(): void;
  openMenu(openOptions?: OpenMenuOptions): void;
  closeMenu(closeOptions?: CloseMenuOptions): void;
  toggleMenu(
    closeOptions?: CloseMenuOptions,
    openOptions?: OpenMenuOptions
  ): void;
  handleBlur(): void;
  handleSelection(value: unknown, event: React.SyntheticEvent): void;
  handleMenuKey(event: React.KeyboardEvent): void;
}

export interface OpenMenuOptions {
  focusMenu?: boolean;
}

export interface CloseMenuOptions {
  focusButton?: boolean;
}

export interface ButtonInstance {
  ref: React.RefObject<HTMLElement | null>;
  setState?: (state: { menuOpen: boolean }) => void;
}

export interface MenuInstance {
  ref: React.RefObject<HTMLElement | null>;
  setState?: (state: { isOpen: boolean }) => void;
  tapListener?: TapListener;
}

// Component Props
export interface WrapperProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onSelect"
> {
  children: React.ReactNode;
  onMenuToggle?: (state: { isOpen: boolean }) => void;
  onSelection?: (value: unknown, event: React.SyntheticEvent) => void;
  closeOnSelection?: boolean;
  closeOnBlur?: boolean;
  tag?: keyof React.JSX.IntrinsicElements;
}

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  disabled?: boolean;
  tag?: keyof React.JSX.IntrinsicElements;
}

export interface MenuChildrenState {
  isOpen: boolean;
}

export type MenuChildren =
  | React.ReactNode
  | ((state: MenuChildrenState) => React.ReactNode);

export interface MenuProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> {
  children: MenuChildren;
  tag?: keyof React.JSX.IntrinsicElements;
}

export interface MenuItemProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  tag?: keyof React.JSX.IntrinsicElements;
  text?: string;
  value?: unknown;
}
