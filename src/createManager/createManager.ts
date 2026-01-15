import createFocusGroup from "focus-group";
import * as externalStateControl from "../externalStateControl";
import type {
  MenuButtonManager,
  ManagerOptions,
  OpenMenuOptions,
  CloseMenuOptions,
} from "../types";

const focusGroupOptions = {
  wrap: true,
  stringSearch: true,
};

const protoManager: MenuButtonManager = {
  options: {
    closeOnSelection: true,
    closeOnBlur: true,
  },
  isOpen: false,
  button: null,
  menu: null,
  focusGroup: null as unknown as MenuButtonManager["focusGroup"],
  blurTimer: undefined,
  moveFocusTimer: undefined,

  init(options?: ManagerOptions) {
    this.updateOptions(options);

    this.handleBlur = handleBlur.bind(this);
    this.handleSelection = handleSelection.bind(this);
    this.handleMenuKey = handleMenuKey.bind(this);

    // "With focus on the drop-down menu, the Up and Down Arrow
    // keys move focus within the menu items, "wrapping" at the top and bottom."
    // "Typing a letter (printable character) key moves focus to the next
    // instance of a visible node whose title begins with that printable letter."
    //
    // All of the above is handled by focus-group.
    this.focusGroup = createFocusGroup(focusGroupOptions);

    // These component references are added when the relevant components mount
    this.button = null;
    this.menu = null;

    // State trackers
    this.isOpen = false;
  },

  updateOptions(options?: ManagerOptions) {
    const oldOptions = this.options;

    this.options = {
      ...options,
      closeOnSelection: options?.closeOnSelection ?? true,
      closeOnBlur: options?.closeOnBlur ?? true,
    };

    if (this.options.id) {
      externalStateControl.registerManager(this.options.id, this);
    }

    if (oldOptions.id && oldOptions.id !== this.options.id) {
      externalStateControl.unregisterManager(oldOptions.id);
    }
  },

  focusItem(index: number) {
    this.focusGroup.focusNodeAtIndex(index);
  },

  addItem(item) {
    this.focusGroup.addMember(item);
  },

  clearItems() {
    this.focusGroup.clearMembers();
  },

  handleButtonNonArrowKey(event: KeyboardEvent) {
    this.focusGroup._handleUnboundKey(event);
  },

  destroy() {
    this.button = null;
    this.menu = null;
    this.focusGroup.deactivate();
    clearTimeout(this.blurTimer);
    clearTimeout(this.moveFocusTimer);
  },

  update() {
    this.menu?.setState?.({ isOpen: this.isOpen });
    this.button?.setState?.({ menuOpen: this.isOpen });
    this.options.onMenuToggle?.({ isOpen: this.isOpen });
  },

  openMenu(openOptions?: OpenMenuOptions) {
    if (this.isOpen) return;
    const opts = openOptions ?? {};
    const focusMenu = opts.focusMenu ?? true;
    this.isOpen = true;
    this.update();
    this.focusGroup.activate();
    if (focusMenu) {
      this.moveFocusTimer = setTimeout(() => {
        this.focusItem(0);
      }, 0);
    }
  },

  closeMenu(closeOptions?: CloseMenuOptions) {
    if (!this.isOpen) return;
    const opts = closeOptions ?? {};
    this.isOpen = false;
    this.update();
    if (opts.focusButton) {
      this.button?.ref.current?.focus();
    }
  },

  toggleMenu(closeOptions?: CloseMenuOptions, openOptions?: OpenMenuOptions) {
    const closeOpts = closeOptions ?? {};
    const openOpts = openOptions ?? {};
    if (this.isOpen) {
      this.closeMenu(closeOpts);
    } else {
      this.openMenu(openOpts);
    }
  },

  handleBlur() {
    // Placeholder - will be bound in init
  },

  handleSelection(_value: unknown, _event: React.SyntheticEvent) {
    // Placeholder - will be bound in init
  },

  handleMenuKey(_event: React.KeyboardEvent) {
    // Placeholder - will be bound in init
  },
};

function handleBlur(this: MenuButtonManager) {
  this.blurTimer = setTimeout(() => {
    if (!this.button) return;
    const buttonNode = this.button.ref.current;
    if (!buttonNode) return;
    const activeEl = buttonNode.ownerDocument.activeElement;
    if (activeEl === buttonNode) return;
    const menuNode = this.menu?.ref.current;
    if (menuNode === activeEl) {
      this.focusItem(0);
      return;
    }
    if (menuNode?.contains(activeEl)) return;
    if (this.isOpen) this.closeMenu({ focusButton: false });
  }, 0);
}

function handleSelection(
  this: MenuButtonManager,
  value: unknown,
  event: React.SyntheticEvent
) {
  if (this.options.closeOnSelection) this.closeMenu({ focusButton: true });
  this.options.onSelection?.(value, event);
}

function handleMenuKey(this: MenuButtonManager, event: React.KeyboardEvent) {
  if (this.isOpen) {
    switch (event.key) {
      // With focus on the drop-down menu, pressing Escape closes
      // the menu and returns focus to the button.
      case "Escape":
        event.preventDefault();
        this.closeMenu({ focusButton: true });
        break;
      case "Home":
        event.preventDefault();
        this.focusGroup.moveFocusToFirst();
        break;
      case "End":
        event.preventDefault();
        this.focusGroup.moveFocusToLast();
        break;
    }
  }
}

export default function createManager(
  options?: ManagerOptions
): MenuButtonManager {
  const newManager = Object.create(protoManager) as MenuButtonManager;
  newManager.init(options);
  return newManager;
}
