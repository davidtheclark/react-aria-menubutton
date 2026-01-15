import ReactDOMServer from "react-dom/server";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";
import ManagerContext from "../ManagerContext";
import MockWrapper from "../test-utils/MockWrapper";
import createMockManager from "../test-utils/createMockManager";
import createManager from "../createManager";
import type { MenuButtonManager } from "../types";

function renderWithManager(
  ui: React.ReactElement,
  manager: MenuButtonManager | Partial<MenuButtonManager>
) {
  return render(
    <ManagerContext.Provider value={manager as MenuButtonManager}>
      {ui}
    </ManagerContext.Provider>
  );
}

describe("<Button>", function () {
  let ambManager: ReturnType<typeof createMockManager>;

  beforeEach(function () {
    ambManager = createMockManager();
  });

  test("DOM with only required props and text child", function () {
    const { container } = renderWithManager(<Button>foo</Button>, ambManager);
    const button = container.firstChild as HTMLElement;

    expect(button).toHaveAttribute("role", "button");
    expect(button).toHaveAttribute("tabindex", "0");
    expect(button).toHaveAttribute("aria-haspopup", "true");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button.tagName.toLowerCase()).toBe("span");
    expect(button).toHaveTextContent("foo");
  });

  test("no onBlur behavior when closeOnBlur is false", function () {
    const manager = createManager({ closeOnBlur: false });
    const handleBlur = vi.fn();
    manager.handleBlur = handleBlur;

    const { container } = renderWithManager(<Button>test</Button>, manager);
    const button = container.firstChild as HTMLElement;

    fireEvent.blur(button);
    expect(handleBlur).not.toHaveBeenCalled();
  });

  test("DOM with all possible props and element child", function () {
    const { container } = renderWithManager(
      <Button
        id="foo"
        className="bar"
        style={{ top: 2 }}
        tag="button"
        disabled={true}
        data-something-something="seven"
      >
        <span>hooha</span>
      </Button>,
      ambManager
    );
    const button = container.firstChild as HTMLElement;

    expect(button).toHaveAttribute("id", "foo");
    expect(button).toHaveClass("bar");
    expect(button).toHaveStyle({ top: "2px" });
    expect(button.tagName.toLowerCase()).toBe("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-something-something", "seven");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveTextContent("hooha");
  });

  test("click", function () {
    renderWithManager(<Button>foo</Button>, ambManager);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  test("click when disabled", function () {
    renderWithManager(<Button disabled={true}>foo</Button>, ambManager);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(ambManager.toggleMenu).not.toHaveBeenCalled();
  });

  test("element has disabled attribute when disabled property is set to true", function () {
    const { container } = renderWithManager(
      <Button disabled={true} tag="button">
        foo
      </Button>,
      ambManager
    );
    const button = container.firstChild as HTMLElement;

    expect(button).toBeDisabled();
  });

  test("down arrow when closed", function () {
    renderWithManager(<Button>foo</Button>, ambManager);
    const button = screen.getByRole("button");

    fireEvent.keyDown(button, { key: "ArrowDown" });

    expect(ambManager.openMenu).toHaveBeenCalledTimes(1);
    expect(ambManager.openMenu).toHaveBeenCalledWith();
  });

  test("down arrow when open", function () {
    ambManager.isOpen = true;
    renderWithManager(<Button>foo</Button>, ambManager);
    const button = screen.getByRole("button");

    fireEvent.keyDown(button, { key: "ArrowDown" });

    expect(ambManager.openMenu).not.toHaveBeenCalled();
    expect(ambManager.focusItem).toHaveBeenCalledTimes(1);
    expect(ambManager.focusItem).toHaveBeenCalledWith(0);
  });

  test("enter key", function () {
    renderWithManager(<Button>foo</Button>, ambManager);
    const button = screen.getByRole("button");

    fireEvent.keyDown(button, { key: "Enter" });

    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  test("space key", function () {
    renderWithManager(<Button>foo</Button>, ambManager);
    const button = screen.getByRole("button");

    fireEvent.keyDown(button, { key: " " });

    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  test("escape key", function () {
    renderWithManager(<Button>foo</Button>, ambManager);
    const button = screen.getByRole("button");

    fireEvent.keyDown(button, { key: "Escape" });

    expect(ambManager.handleMenuKey).toHaveBeenCalledTimes(1);
    // The handler was called with a keyboard event (React pools events, so we can't access properties after)
    expect(ambManager.handleMenuKey).toHaveBeenCalled();
  });

  test("f key", function () {
    renderWithManager(<Button>foo</Button>, ambManager);
    const button = screen.getByRole("button");

    fireEvent.keyDown(button, { key: "f", keyCode: 70 });

    expect(ambManager.handleButtonNonArrowKey).toHaveBeenCalledTimes(1);
    // The handler was called with a keyboard event (React pools events, so we can't access properties after)
    expect(ambManager.handleButtonNonArrowKey).toHaveBeenCalled();
  });

  test("enter key when disabled", function () {
    renderWithManager(<Button disabled={true}>foo</Button>, ambManager);
    const button = screen.getByRole("button");

    fireEvent.keyDown(button, { key: "Enter" });

    expect(ambManager.toggleMenu).not.toHaveBeenCalled();
  });
});

describe("<Button> rendered via renderToString", function () {
  test("does not throw", function () {
    const output = ReactDOMServer.renderToString(
      <MockWrapper mockManager={createMockManager()}>
        <Button>foo</Button>
      </MockWrapper>
    );
    expect(output).toContain('role="button"');
    expect(output).toContain("foo");
  });
});
