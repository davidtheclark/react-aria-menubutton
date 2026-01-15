export default function() {
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
    options: {
      closeOnBlur: true,
      closeOnSelection: true
    }
  };
}
