module.exports = function() {
  return {
    isOpen: false,
    toggleMenu: jest.fn(),
    handleMenuKey: jest.fn(),
    moveFocusDown: jest.fn(),
    openMenu: jest.fn(),
    handleKeyDown: jest.fn(),
    handleClick: jest.fn(),
    handleSelection: jest.fn(),
    handleButtonNonArrowKey: jest.fn(),
    focusItem: jest.fn(),
    menuItems: [1, 2],
    clearItems: jest.fn(),
    currentFocus: -1,
    addItem: jest.fn(),
    options: {
      closeOnBlur: true,
      closeOnSelection: true
    }
  };
}
