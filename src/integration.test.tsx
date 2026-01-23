/**
 * Integration tests for react-aria-menubutton
 * 
 * These tests follow React Testing Library philosophy:
 * - Test behavior, not implementation
 * - Query elements the way users would find them (by role, text, label)
 * - Use userEvent for realistic user interactions
 * - Assert on visible DOM changes, not internal state
 * 
 * Note: Arrow key navigation within the menu is handled by the focus-group 
 * library and is not tested here as it's third-party behavior.
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Wrapper, Button, Menu, MenuItem, openMenu, closeMenu } from "./index";
import { act } from "react";

// Helper to render a complete menu button component
function renderMenuButton(options: { 
  onSelection?: (value: unknown) => void;
  id?: string;
} = {}) {
  const handleSelection = options.onSelection ?? vi.fn();
  
  return render(
    <Wrapper id={options.id} onSelection={handleSelection}>
      <Button>Open Menu</Button>
      <Menu>
        <MenuItem value="item1">First Item</MenuItem>
        <MenuItem value="item2">Second Item</MenuItem>
        <MenuItem value="item3">Third Item</MenuItem>
      </Menu>
    </Wrapper>
  );
}

describe("Menu Button Integration", () => {
  describe("Opening and closing the menu", () => {
    test("clicking the button opens the menu", async () => {
      const user = userEvent.setup();
      renderMenuButton();

      // Menu should not be visible initially
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();

      // Click the button
      await user.click(screen.getByRole("button", { name: "Open Menu" }));

      // Menu should now be visible
      expect(screen.getByRole("menu")).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "First Item" })).toBeInTheDocument();
    });

    test("clicking the button again closes the menu", async () => {
      const user = userEvent.setup();
      renderMenuButton();

      const button = screen.getByRole("button", { name: "Open Menu" });

      // Open the menu
      await user.click(button);
      expect(screen.getByRole("menu")).toBeInTheDocument();

      // Click again to close
      await user.click(button);
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    test("pressing Enter on the button opens the menu", async () => {
      const user = userEvent.setup();
      renderMenuButton();

      const button = screen.getByRole("button", { name: "Open Menu" });
      button.focus();

      await user.keyboard("{Enter}");

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    test("pressing Space on the button opens the menu", async () => {
      const user = userEvent.setup();
      renderMenuButton();

      const button = screen.getByRole("button", { name: "Open Menu" });
      button.focus();

      await user.keyboard(" ");

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    test("pressing Escape closes the menu and returns focus to button", async () => {
      const user = userEvent.setup();
      renderMenuButton();

      const button = screen.getByRole("button", { name: "Open Menu" });

      // Open menu
      await user.click(button);
      expect(screen.getByRole("menu")).toBeInTheDocument();

      // Press Escape
      await user.keyboard("{Escape}");

      // Menu should be closed
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      // Focus should return to button
      expect(button).toHaveFocus();
    });

    test("pressing ArrowDown on button opens menu and focuses first item", async () => {
      const user = userEvent.setup();
      renderMenuButton();

      const button = screen.getByRole("button", { name: "Open Menu" });
      button.focus();

      await user.keyboard("{ArrowDown}");

      expect(screen.getByRole("menu")).toBeInTheDocument();
      
      // First menu item should be focused
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "First Item" })).toHaveFocus();
      });
    });
  });

  describe("Menu item selection", () => {
    test("clicking a menu item triggers selection callback", async () => {
      const user = userEvent.setup();
      const handleSelection = vi.fn();
      renderMenuButton({ onSelection: handleSelection });

      // Open menu
      await user.click(screen.getByRole("button", { name: "Open Menu" }));

      // Click menu item
      await user.click(screen.getByRole("menuitem", { name: "Second Item" }));

      expect(handleSelection).toHaveBeenCalledTimes(1);
      expect(handleSelection).toHaveBeenCalledWith("item2", expect.anything());
    });

    test("clicking a menu item closes the menu", async () => {
      const user = userEvent.setup();
      renderMenuButton();

      // Open menu
      await user.click(screen.getByRole("button", { name: "Open Menu" }));
      expect(screen.getByRole("menu")).toBeInTheDocument();

      // Click menu item
      await user.click(screen.getByRole("menuitem", { name: "First Item" }));

      // Menu should close
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    test("pressing Enter on a focused menu item triggers selection", async () => {
      const user = userEvent.setup();
      const handleSelection = vi.fn();
      renderMenuButton({ onSelection: handleSelection });

      // Open menu with arrow down (focuses first item)
      const button = screen.getByRole("button", { name: "Open Menu" });
      button.focus();
      await user.keyboard("{ArrowDown}");

      // Wait for focus to be on first item
      await waitFor(() => {
        expect(screen.getByRole("menuitem", { name: "First Item" })).toHaveFocus();
      });

      // Press Enter to select
      await user.keyboard("{Enter}");

      expect(handleSelection).toHaveBeenCalledWith("item1", expect.anything());
    });
  });

  describe("ARIA attributes", () => {
    test("button has correct ARIA attributes when menu is closed", () => {
      renderMenuButton();

      const button = screen.getByRole("button", { name: "Open Menu" });
      expect(button).toHaveAttribute("aria-haspopup", "true");
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    test("button has aria-expanded=true when menu is open", async () => {
      const user = userEvent.setup();
      renderMenuButton();

      const button = screen.getByRole("button", { name: "Open Menu" });

      await user.click(button);

      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    test("menu items have menuitem role", async () => {
      const user = userEvent.setup();
      renderMenuButton();

      await user.click(screen.getByRole("button", { name: "Open Menu" }));

      const menuItems = screen.getAllByRole("menuitem");
      expect(menuItems).toHaveLength(3);
    });
  });

  describe("Accessibility - menu items are focusable", () => {
    test("menu items are present and have correct accessible names", async () => {
      const user = userEvent.setup();
      renderMenuButton();

      await user.click(screen.getByRole("button", { name: "Open Menu" }));

      expect(screen.getByRole("menuitem", { name: "First Item" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Second Item" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Third Item" })).toBeInTheDocument();
    });
  });
});

describe("External State Control", () => {
  test("openMenu() opens a menu by id", async () => {
    renderMenuButton({ id: "test-menu" });

    // Menu should not be visible initially
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    // Open menu externally
    act(() => {
      openMenu("test-menu");
    });

    // Menu should now be visible
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  test("closeMenu() closes a menu by id", async () => {
    const user = userEvent.setup();
    renderMenuButton({ id: "test-menu" });

    // Open menu by clicking
    await user.click(screen.getByRole("button", { name: "Open Menu" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Close menu externally
    act(() => {
      closeMenu("test-menu");
    });

    // Menu should be closed
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  test("openMenu() with focusMenu=false opens menu without moving focus", async () => {
    renderMenuButton({ id: "test-menu" });

    // Focus the button first
    const button = screen.getByRole("button", { name: "Open Menu" });
    button.focus();
    expect(button).toHaveFocus();

    // Open menu without focus
    act(() => {
      openMenu("test-menu", { focusMenu: false });
    });

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    // Button should still have focus (menu items not focused)
    expect(button).toHaveFocus();
  });

  test("openMenu() with unknown id throws error", () => {
    renderMenuButton({ id: "test-menu" });

    expect(() => {
      openMenu("unknown-id");
    }).toThrow();
  });
});

describe("Function children pattern", () => {
  test("Menu with function children receives isOpen state", async () => {
    const user = userEvent.setup();

    render(
      <Wrapper>
        <Button>Toggle</Button>
        <Menu>
          {({ isOpen }) => (
            <div data-testid="menu-content">
              {isOpen ? "Menu is OPEN" : "Menu is CLOSED"}
            </div>
          )}
        </Menu>
      </Wrapper>
    );

    // Function children always render, showing closed state
    expect(screen.getByTestId("menu-content")).toHaveTextContent("Menu is CLOSED");

    // Open menu
    await user.click(screen.getByRole("button", { name: "Toggle" }));

    expect(screen.getByTestId("menu-content")).toHaveTextContent("Menu is OPEN");
  });
});
