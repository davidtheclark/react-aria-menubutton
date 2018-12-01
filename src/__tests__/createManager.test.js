/* globals Promise */
var findDOMNodeMock = jest.fn();
jest.setMock('react-dom', {
  findDOMNode: findDOMNodeMock
});

var createManager = require('../createManager');
var createMockKeyEvent = require('./helpers/createMockKeyEvent');

var nodeOne = document.createElement('button');
nodeOne.focus = jest.fn();
var nodeTwo = document.createElement('button');
nodeTwo.focus = jest.fn();
document.body.appendChild(nodeOne);
document.body.appendChild(nodeTwo);

function createManagerWithMockedElements(options) {
  var manager = createManager(options);
  manager.focusGroup.addMember({
    node: nodeOne,
    text: 'first'
  });
  manager.focusGroup.addMember({
    node: nodeTwo,
    text: 'second'
  });
  manager.button = {
    focus: jest.fn(),
    setState: jest.fn()
  };
  manager.menu = {
    setState: jest.fn()
  };
  manager.focusItem = jest.fn();
  return manager;
}

describe('createManager', function() {
  it('initalizes', function() {
    var manager = createManagerWithMockedElements();
    expect(manager.isOpen).toBe(false);
    expect(manager.options.closeOnSelection).toBeTruthy();
    expect(manager.options.closeOnBlur).toBeTruthy();
  });

  it('Manager#update', function() {
    var manager = createManagerWithMockedElements({
      onMenuToggle: jest.fn()
    });
    manager.update();
    expect(manager.menu.setState).toHaveBeenCalledTimes(1);
    expect(manager.menu.setState.mock.calls[0]).toEqual([
      { isOpen: manager.isOpen }
    ]);
    expect(manager.button.setState).toHaveBeenCalledTimes(1);
    expect(manager.button.setState.mock.calls[0]).toEqual([
      { menuOpen: manager.isOpen }
    ]);
    expect(manager.options.onMenuToggle).toHaveBeenCalledTimes(1);
    expect(manager.options.onMenuToggle.mock.calls[0]).toEqual([
      { isOpen: manager.isOpen }
    ]);
  });

  it('Manager#openMenu without focusing in menu', function() {
    var manager = createManagerWithMockedElements();
    manager.openMenu({ focusMenu: false });
    expect(manager.isOpen).toBe(true);
    expect(manager.menu.setState).toHaveBeenCalledTimes(1);
    expect(manager.menu.setState.mock.calls[0]).toEqual([{ isOpen: true }]);
    expect(manager.button.setState).toHaveBeenCalledTimes(1);
    expect(manager.button.setState.mock.calls[0]).toEqual([{ menuOpen: true }]);

    return new Promise(function(resolve) {
      setTimeout(function() {
        expect(manager.focusItem).toHaveBeenCalledTimes(0);
        resolve();
      }, 0);
    });
  });

  it('Manager#openMenu focusing in menu', function() {
    var manager = createManagerWithMockedElements();
    manager.openMenu();
    expect(manager.isOpen).toBe(true);
    expect(manager.menu.setState).toHaveBeenCalledTimes(1);
    expect(manager.menu.setState.mock.calls[0]).toEqual([{ isOpen: true }]);
    expect(manager.button.setState).toHaveBeenCalledTimes(1);
    expect(manager.button.setState.mock.calls[0]).toEqual([{ menuOpen: true }]);

    return new Promise(function(resolve) {
      setTimeout(function() {
        expect(manager.focusItem).toHaveBeenCalledTimes(1);
        expect(manager.focusItem.mock.calls[0]).toEqual([0]);
        resolve();
      }, 0);
    });
  });

  it('Manager#closeMenu focusing on button', function() {
    var mockNode = { focus: jest.fn() };
    findDOMNodeMock.mockImplementation(function() {
      return mockNode;
    });

    var manager = createManagerWithMockedElements();
    manager.isOpen = true;
    manager.closeMenu({ focusButton: true });

    expect(manager.isOpen).toBe(false);
    expect(manager.menu.setState).toHaveBeenCalledTimes(1);
    expect(manager.menu.setState.mock.calls[0]).toEqual([{ isOpen: false }]);
    expect(manager.button.setState).toHaveBeenCalledTimes(1);
    expect(manager.button.setState.mock.calls[0]).toEqual([
      { menuOpen: false }
    ]);
    expect(mockNode.focus).toHaveBeenCalledTimes(1);
  });

  it('Manager#closeMenu without focusing on button', function() {
    var mockNode = { focus: jest.fn() };
    findDOMNodeMock.mockImplementation(function() {
      return mockNode;
    });

    var manager = createManagerWithMockedElements();
    manager.isOpen = true;
    manager.closeMenu({ focusButton: false });

    expect(mockNode.focus).not.toHaveBeenCalled();
  });

  it('Manager#toggleMenu when closed', function() {
    var manager = createManagerWithMockedElements();
    manager.openMenu = jest.fn();
    manager.closeMenu = jest.fn();
    manager.toggleMenu();
    expect(manager.openMenu).toHaveBeenCalledTimes(1);
    expect(manager.closeMenu).not.toHaveBeenCalled();
  });

  it('Manager#toggleMenu when open', function() {
    var manager = createManagerWithMockedElements();
    manager.isOpen = true;
    manager.openMenu = jest.fn();
    manager.closeMenu = jest.fn();
    manager.toggleMenu();
    expect(manager.openMenu).not.toHaveBeenCalled();
    expect(manager.closeMenu).toHaveBeenCalledTimes(1);
  });

  it('Manager#handleSelection A', function() {
    var mockOnSelection = jest.fn();
    var manager = createManagerWithMockedElements({
      onSelection: mockOnSelection
    });
    manager.closeMenu = jest.fn();
    manager.handleSelection('foo', { bar: 1 });
    expect(manager.closeMenu).toHaveBeenCalledTimes(1);
    expect(manager.closeMenu.mock.calls[0]).toEqual([{ focusButton: true }]);
    expect(mockOnSelection).toHaveBeenCalledTimes(1);
    expect(mockOnSelection.mock.calls[0]).toEqual(['foo', { bar: 1 }]);
  });

  it('Manager#handleSelection B', function() {
    var mockOnSelection = jest.fn();
    var manager = createManagerWithMockedElements({
      onSelection: mockOnSelection,
      closeOnSelection: false
    });
    manager.closeMenu = jest.fn();
    manager.handleSelection('foo', { bar: 1 });
    expect(manager.closeMenu).not.toHaveBeenCalled();
    expect(mockOnSelection).toHaveBeenCalledTimes(1);
    expect(mockOnSelection.mock.calls[0]).toEqual(['foo', { bar: 1 }]);
  });

  it('Manager#handleMenuKey on closed menu', function() {
    var escapeEvent = createMockKeyEvent('Escape');
    var manager = createManagerWithMockedElements();
    manager.closeMenu = jest.fn();

    manager.handleMenuKey(escapeEvent);
    expect(escapeEvent.preventDefault).not.toHaveBeenCalled();
    expect(manager.closeMenu).not.toHaveBeenCalled();
  });

  it('Manager#handleMenuKey on open menu', function() {
    var escapeEvent = createMockKeyEvent('Escape');
    var manager = createManagerWithMockedElements();
    manager.isOpen = true;
    manager.closeMenu = jest.fn();

    manager.handleMenuKey(escapeEvent);
    expect(escapeEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(manager.closeMenu).toHaveBeenCalledTimes(1);
    expect(manager.closeMenu.mock.calls[0]).toEqual([{ focusButton: true }]);
  });
});
