import {
  forwardRef,
  useContext,
  useRef,
  useEffect,
  useCallback,
  createElement,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import createTapListener from "teeny-tap";
import type { TapListener } from "teeny-tap";
import ManagerContext from "../ManagerContext";
import specialAssign from "../specialAssign";
import type { MenuProps, MenuButtonManager } from "../types";

interface InternalMenuProps extends MenuProps {
  ambManager: MenuButtonManager;
}

const reservedProps = {
  ambManager: true,
  children: true,
  tag: true,
};

function AriaMenuButtonMenu({
  ambManager,
  children,
  tag = "div",
  ...restProps
}: InternalMenuProps) {
  const ref = useRef<HTMLElement | null>(null);
  const tapListenerRef = useRef<TapListener | null>(null);

  const addTapListener = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const handleTap = (event: MouseEvent | TouchEvent) => {
      if (ref.current?.contains(event.target as Node)) return;
      if (ambManager.button?.ref.current?.contains(event.target as Node))
        return;
      ambManager.closeMenu();
    };

    tapListenerRef.current = createTapListener(
      el.ownerDocument.documentElement,
      handleTap
    );
  }, [ambManager]);

  useEffect(() => {
    ambManager.menu = {
      ref,
    };

    return () => {
      if (tapListenerRef.current) {
        tapListenerRef.current.remove();
      }
      ambManager.destroy();
    };
  }, [ambManager]);

  useEffect(() => {
    if (!ambManager.options.closeOnBlur) return;

    if (ambManager.isOpen && !tapListenerRef.current) {
      addTapListener();
    } else if (!ambManager.isOpen && tapListenerRef.current) {
      tapListenerRef.current.remove();
      tapListenerRef.current = null;
    }

    if (!ambManager.isOpen) {
      // Clear the ambManager's items, so they
      // can be reloaded next time this menu opens
      ambManager.clearItems();
    }
  }, [ambManager, ambManager.isOpen, addTapListener]);

  const setRef = useCallback((instance: HTMLElement | null) => {
    ref.current = instance;
  }, []);

  const childrenToRender = (() => {
    if (typeof children === "function") {
      return children({ isOpen: ambManager.isOpen });
    }
    if (ambManager.isOpen) return children;
    return null;
  })();

  if (!childrenToRender) return null;

  const menuProps: Record<string, unknown> = {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      ambManager.handleMenuKey(event);
    },
    role: "menu",
    tabIndex: -1,
    ref: setRef,
  };

  if (ambManager.options.closeOnBlur) {
    menuProps.onBlur = (_event: FocusEvent<HTMLElement>) => {
      ambManager.handleBlur();
    };
  }

  specialAssign(menuProps, restProps, reservedProps);

  return createElement(tag, menuProps, childrenToRender);
}

const Menu = forwardRef<HTMLElement, MenuProps>(function Menu(props, _ref) {
  const ambManager = useContext(ManagerContext);

  if (!ambManager) {
    throw new Error("Menu must be used within a Wrapper component");
  }

  return <AriaMenuButtonMenu {...props} ambManager={ambManager} />;
});

export default Menu;
