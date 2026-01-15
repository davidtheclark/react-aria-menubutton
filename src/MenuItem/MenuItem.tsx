import {
  forwardRef,
  useContext,
  useRef,
  useEffect,
  useCallback,
  createElement,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import ManagerContext from "../ManagerContext";
import specialAssign from "../specialAssign";
import type { MenuItemProps, MenuButtonManager } from "../types";

interface InternalMenuItemProps extends MenuItemProps {
  ambManager: MenuButtonManager;
}

const reservedProps = {
  ambManager: true,
  children: true,
  tag: true,
  text: true,
  value: true,
};

function AriaMenuButtonMenuItem({
  ambManager,
  children,
  tag = "div",
  text,
  value,
  ...restProps
}: InternalMenuItemProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ambManager.addItem({
        node: ref.current,
        text,
      });
    }
  }, [ambManager, text]);

  const selectItem = useCallback(
    (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
      // If there's no value, we'll send the child
      const selectionValue = value !== undefined ? value : children;
      ambManager.handleSelection(
        selectionValue,
        event as unknown as React.SyntheticEvent
      );
    },
    [ambManager, value, children]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      // Check if tag is anchor with href - let default behavior happen
      const tagName = tag as string;
      if (
        tagName === "a" &&
        "href" in restProps &&
        restProps.href !== undefined
      ) {
        return;
      }

      event.preventDefault();
      selectItem(event);
    },
    [tag, restProps, selectItem]
  );

  const setRef = useCallback((instance: HTMLElement | null) => {
    ref.current = instance;
  }, []);

  const menuItemProps: Record<string, unknown> = {
    onClick: selectItem,
    onKeyDown: handleKeyDown,
    role: "menuitem",
    tabIndex: -1,
    ref: setRef,
  };

  specialAssign(menuItemProps, restProps, reservedProps);

  return createElement(tag, menuItemProps, children);
}

const MenuItem = forwardRef<HTMLElement, MenuItemProps>(
  function MenuItem(props, _ref) {
    const ambManager = useContext(ManagerContext);

    if (!ambManager) {
      throw new Error("MenuItem must be used within a Wrapper component");
    }

    return <AriaMenuButtonMenuItem {...props} ambManager={ambManager} />;
  }
);

export default MenuItem;
