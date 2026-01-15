import { forwardRef, useMemo, createElement } from "react";
import createManager from "../createManager";
import ManagerContext from "../ManagerContext";
import specialAssign from "../specialAssign";
import type { WrapperProps, ManagerOptions } from "../types";

const reservedProps = {
  children: true,
  onMenuToggle: true,
  onSelection: true,
  closeOnSelection: true,
  closeOnBlur: true,
  tag: true,
};

function managerOptionsFromProps(props: WrapperProps): ManagerOptions {
  return {
    onMenuToggle: props.onMenuToggle,
    onSelection: props.onSelection,
    closeOnSelection: props.closeOnSelection,
    closeOnBlur: props.closeOnBlur,
    id: props.id,
  };
}

const Wrapper = forwardRef<HTMLElement, WrapperProps>(function Wrapper(
  {
    children,
    onMenuToggle,
    onSelection,
    closeOnSelection,
    closeOnBlur,
    tag = "div",
    ...restProps
  },
  _ref
) {
  const manager = useMemo(() => {
    return createManager(
      managerOptionsFromProps({
        children,
        onMenuToggle,
        onSelection,
        closeOnSelection,
        closeOnBlur,
        id: restProps.id,
      })
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update options when props change
  useMemo(() => {
    manager.updateOptions(
      managerOptionsFromProps({
        children,
        onMenuToggle,
        onSelection,
        closeOnSelection,
        closeOnBlur,
        id: restProps.id,
      })
    );
  }, [
    manager,
    onMenuToggle,
    onSelection,
    closeOnSelection,
    closeOnBlur,
    restProps.id,
    children,
  ]);

  const wrapperProps: Record<string, unknown> = {};
  specialAssign(wrapperProps, restProps, reservedProps);

  return (
    <ManagerContext.Provider value={manager}>
      {createElement(tag, wrapperProps, children)}
    </ManagerContext.Provider>
  );
});

export default Wrapper;
