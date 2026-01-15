import {
  forwardRef,
  useContext,
  useRef,
  useEffect,
  useCallback,
  createElement,
  type KeyboardEvent,
  type MouseEvent,
  type FocusEvent,
} from "react";
import ManagerContext from "../ManagerContext";
import specialAssign from "../specialAssign";
import type { ButtonProps, MenuButtonManager } from "../types";

// List retrieved from https://www.w3schools.com/tags/att_disabled.asp
const disabledSupportedTags = [
  "button",
  "fieldset",
  "input",
  "optgroup",
  "option",
  "select",
  "textarea",
];

interface InternalButtonProps extends ButtonProps {
  ambManager: MenuButtonManager;
}

const reservedProps = {
  ambManager: true,
  children: true,
  disabled: true,
  tag: true,
};

function AriaMenuButtonButton({
  ambManager,
  children,
  disabled = false,
  tag = "span",
  ...restProps
}: InternalButtonProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ambManager.button = {
      ref,
    };

    return () => {
      ambManager.destroy();
    };
  }, [ambManager]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (disabled) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (!ambManager.isOpen) {
            ambManager.openMenu();
          } else {
            ambManager.focusItem(0);
          }
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          ambManager.toggleMenu();
          break;
        case "Escape":
          ambManager.handleMenuKey(event);
          break;
        default:
          // (Potential) letter keys
          ambManager.handleButtonNonArrowKey(
            event.nativeEvent as unknown as globalThis.KeyboardEvent
          );
      }
    },
    [ambManager, disabled]
  );

  const handleClick = useCallback(
    (_event: MouseEvent<HTMLElement>) => {
      if (disabled) return;
      ambManager.toggleMenu({}, { focusMenu: false });
    },
    [ambManager, disabled]
  );

  const setRef = useCallback((instance: HTMLElement | null) => {
    ref.current = instance;
  }, []);

  const buttonProps: Record<string, unknown> = {
    // "The menu button itself has a role of button."
    role: "button",
    tabIndex: disabled ? -1 : 0,
    // "The menu button has an aria-haspopup property, set to true."
    "aria-haspopup": true,
    "aria-expanded": ambManager.isOpen,
    "aria-disabled": disabled,
    onKeyDown: handleKeyDown,
    onClick: handleClick,
    ref: setRef,
  };

  // Pass disabled attribute only if the tag supports it
  if (disabledSupportedTags.includes(tag as string)) {
    buttonProps.disabled = disabled;
  }

  if (ambManager.options.closeOnBlur) {
    buttonProps.onBlur = (_event: FocusEvent<HTMLElement>) => {
      ambManager.handleBlur();
    };
  }

  // Copy over non-reserved props
  specialAssign(buttonProps, restProps, reservedProps);

  return createElement(tag, buttonProps, children);
}

const Button = forwardRef<HTMLElement, ButtonProps>(
  function Button(props, _ref) {
    const ambManager = useContext(ManagerContext);

    if (!ambManager) {
      throw new Error("Button must be used within a Wrapper component");
    }

    return <AriaMenuButtonButton {...props} ambManager={ambManager} />;
  }
);

export default Button;
