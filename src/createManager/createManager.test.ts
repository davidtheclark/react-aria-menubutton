import createManager from "./createManager";
import createMockKeyEvent from "../test-utils/createMockKeyEvent";
import type { MenuButtonManager } from "../types";

let mockNode: HTMLButtonElement;
let nodeOne: HTMLButtonElement;
let nodeTwo: HTMLButtonElement;

interface MockedManager extends MenuButtonManager {
  focusItem: ReturnType<typeof vi.fn>;
  button: {
    ref: { current: HTMLButtonElement };
    setState: ReturnType<typeof vi.fn>;
  };
  menu: {
    ref: { current: null };
    setState: ReturnType<typeof vi.fn>;
  };
}

function createManagerWithMockedElements(
  options?: Parameters<typeof createManager>[0]
): MockedManager {
  mockNode = document.createElement("button");
  nodeOne = document.createElement("button");
  nodeOne.focus = vi.fn();
  nodeTwo = document.createElement("button");
  nodeTwo.focus = vi.fn();
  document.body.appendChild(nodeOne);
  document.body.appendChild(nodeTwo);

  const manager = createManager(options);
  manager.focusGroup.addMember({
    node: nodeOne,
    text: "first",
  });
  manager.focusGroup.addMember({
    node: nodeTwo,
    text: "second",
  });
  manager.button = {
    ref: { current: mockNode },
    setState: vi.fn(),
  };
  manager.menu = {
    ref: { current: null },
    setState: vi.fn(),
  };
  manager.focusItem = vi.fn();
  return manager as MockedManager;
}

describe("createManager", function () {
  it("initalizes", function () {
    const manager = createManagerWithMockedElements();
    expect(manager.isOpen).toBe(false);
    expect(manager.options.closeOnSelection).toBeTruthy();
    expect(manager.options.closeOnBlur).toBeTruthy();
  });

  it("Manager#update", function () {
    const manager = createManagerWithMockedElements({
      onMenuToggle: vi.fn(),
    });
    manager.update();
    expect(manager.menu.setState).toHaveBeenCalledTimes(1);
    expect(manager.menu.setState.mock.calls[0]).toEqual([
      { isOpen: manager.isOpen },
    ]);
    expect(manager.button.setState).toHaveBeenCalledTimes(1);
    expect(manager.button.setState.mock.calls[0]).toEqual([
      { menuOpen: manager.isOpen },
    ]);
    expect(manager.options.onMenuToggle).toHaveBeenCalledTimes(1);
    expect(
      (manager.options.onMenuToggle as ReturnType<typeof vi.fn>).mock.calls[0]
    ).toEqual([{ isOpen: manager.isOpen }]);
  });

  it("Manager#openMenu without focusing in menu", function () {
    const manager = createManagerWithMockedElements();
    manager.openMenu({ focusMenu: false });
    expect(manager.isOpen).toBe(true);
    expect(manager.menu.setState).toHaveBeenCalledTimes(1);
    expect(manager.menu.setState.mock.calls[0]).toEqual([{ isOpen: true }]);
    expect(manager.button.setState).toHaveBeenCalledTimes(1);
    expect(manager.button.setState.mock.calls[0]).toEqual([{ menuOpen: true }]);

    return new Promise<void>(function (resolve) {
      setTimeout(function () {
        expect(manager.focusItem).toHaveBeenCalledTimes(0);
        resolve();
      }, 0);
    });
  });

  it("Manager#openMenu focusing in menu", function () {
    const manager = createManagerWithMockedElements();
    manager.openMenu();
    expect(manager.isOpen).toBe(true);
    expect(manager.menu.setState).toHaveBeenCalledTimes(1);
    expect(manager.menu.setState.mock.calls[0]).toEqual([{ isOpen: true }]);
    expect(manager.button.setState).toHaveBeenCalledTimes(1);
    expect(manager.button.setState.mock.calls[0]).toEqual([{ menuOpen: true }]);

    return new Promise<void>(function (resolve) {
      setTimeout(function () {
        expect(manager.focusItem).toHaveBeenCalledTimes(1);
        expect(manager.focusItem.mock.calls[0]).toEqual([0]);
        resolve();
      }, 0);
    });
  });

  it("Manager#closeMenu focusing on button", function () {
    const manager = createManagerWithMockedElements();
    mockNode.focus = vi.fn();

    manager.isOpen = true;
    manager.closeMenu({ focusButton: true });

    expect(manager.isOpen).toBe(false);
    expect(manager.menu.setState).toHaveBeenCalledTimes(1);
    expect(manager.menu.setState.mock.calls[0]).toEqual([{ isOpen: false }]);
    expect(manager.button.setState).toHaveBeenCalledTimes(1);
    expect(manager.button.setState.mock.calls[0]).toEqual([
      { menuOpen: false },
    ]);
    expect(mockNode.focus).toHaveBeenCalledTimes(1);
  });

  it("Manager#closeMenu without focusing on button", function () {
    const manager = createManagerWithMockedElements();
    mockNode.focus = vi.fn();

    manager.isOpen = true;
    manager.closeMenu({ focusButton: false });

    expect(mockNode.focus).not.toHaveBeenCalled();
  });

  it("Manager#toggleMenu when closed", function () {
    const manager = createManagerWithMockedElements();
    manager.openMenu = vi.fn();
    manager.closeMenu = vi.fn();
    manager.toggleMenu();
    expect(manager.openMenu).toHaveBeenCalledTimes(1);
    expect(manager.closeMenu).not.toHaveBeenCalled();
  });

  it("Manager#toggleMenu when open", function () {
    const manager = createManagerWithMockedElements();
    manager.isOpen = true;
    manager.openMenu = vi.fn();
    manager.closeMenu = vi.fn();
    manager.toggleMenu();
    expect(manager.openMenu).not.toHaveBeenCalled();
    expect(manager.closeMenu).toHaveBeenCalledTimes(1);
  });

  it("Manager#handleSelection A", function () {
    const mockOnSelection = vi.fn();
    const manager = createManagerWithMockedElements({
      onSelection: mockOnSelection,
    });
    const closeMenuMock = vi.fn();
    manager.closeMenu = closeMenuMock;
    manager.handleSelection("foo", {
      bar: 1,
    } as unknown as React.SyntheticEvent);
    expect(closeMenuMock).toHaveBeenCalledTimes(1);
    expect(closeMenuMock.mock.calls[0]).toEqual([{ focusButton: true }]);
    expect(mockOnSelection).toHaveBeenCalledTimes(1);
    expect(mockOnSelection.mock.calls[0]).toEqual(["foo", { bar: 1 }]);
  });

  it("Manager#handleSelection B", function () {
    const mockOnSelection = vi.fn();
    const manager = createManagerWithMockedElements({
      onSelection: mockOnSelection,
      closeOnSelection: false,
    });
    manager.closeMenu = vi.fn();
    manager.handleSelection("foo", {
      bar: 1,
    } as unknown as React.SyntheticEvent);
    expect(manager.closeMenu).not.toHaveBeenCalled();
    expect(mockOnSelection).toHaveBeenCalledTimes(1);
    expect(mockOnSelection.mock.calls[0]).toEqual(["foo", { bar: 1 }]);
  });

  it("Manager#handleMenuKey on closed menu", function () {
    const escapeEvent = createMockKeyEvent("Escape");
    const manager = createManagerWithMockedElements();
    manager.closeMenu = vi.fn();

    manager.handleMenuKey(escapeEvent as unknown as React.KeyboardEvent);
    expect(escapeEvent.preventDefault).not.toHaveBeenCalled();
    expect(manager.closeMenu).not.toHaveBeenCalled();
  });

  it("Manager#handleMenuKey on open menu", function () {
    const escapeEvent = createMockKeyEvent("Escape");
    const manager = createManagerWithMockedElements();
    manager.isOpen = true;
    const closeMenuMock = vi.fn();
    manager.closeMenu = closeMenuMock;

    manager.handleMenuKey(escapeEvent as unknown as React.KeyboardEvent);
    expect(escapeEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(closeMenuMock).toHaveBeenCalledTimes(1);
    expect(closeMenuMock.mock.calls[0]).toEqual([{ focusButton: true }]);
  });
});
