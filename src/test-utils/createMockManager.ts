import { vi } from "vitest";
import type { MenuButtonManager } from "../types";

export interface MockManager extends Partial<MenuButtonManager> {
  isOpen: boolean;
  toggleMenu: ReturnType<typeof vi.fn>;
  handleMenuKey: ReturnType<typeof vi.fn>;
  moveFocusDown: ReturnType<typeof vi.fn>;
  openMenu: ReturnType<typeof vi.fn>;
  handleKeyDown: ReturnType<typeof vi.fn>;
  handleClick: ReturnType<typeof vi.fn>;
  handleSelection: ReturnType<typeof vi.fn>;
  handleButtonNonArrowKey: ReturnType<typeof vi.fn>;
  focusItem: ReturnType<typeof vi.fn>;
  menuItems: number[];
  clearItems: ReturnType<typeof vi.fn>;
  currentFocus: number;
  addItem: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
  handleBlur: ReturnType<typeof vi.fn>;
  options: {
    closeOnBlur: boolean;
    closeOnSelection: boolean;
  };
}

export default function createMockManager(): MockManager {
  return {
    isOpen: false,
    toggleMenu: vi.fn(),
    handleMenuKey: vi.fn(),
    moveFocusDown: vi.fn(),
    openMenu: vi.fn(),
    handleKeyDown: vi.fn(),
    handleClick: vi.fn(),
    handleSelection: vi.fn(),
    handleButtonNonArrowKey: vi.fn(),
    focusItem: vi.fn(),
    menuItems: [1, 2],
    clearItems: vi.fn(),
    currentFocus: -1,
    addItem: vi.fn(),
    destroy: vi.fn(),
    handleBlur: vi.fn(),
    options: {
      closeOnBlur: true,
      closeOnSelection: true,
    },
  };
}
