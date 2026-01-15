import React from "react";
import PropTypes from "prop-types";
import createManager from "../createManager";
import ManagerContext from "../ManagerContext";
import { refType } from "../propTypes";
import specialAssign from "../specialAssign";

const checkedProps = {
  children: PropTypes.node.isRequired,
  forwardedRef: refType,
  onMenuToggle: PropTypes.func,
  onSelection: PropTypes.func,
  closeOnSelection: PropTypes.bool,
  closeOnBlur: PropTypes.bool,
  tag: PropTypes.string
};

const managerOptionsFromProps = props => {
  return {
    onMenuToggle: props.onMenuToggle,
    onSelection: props.onSelection,
    closeOnSelection: props.closeOnSelection,
    closeOnBlur: props.closeOnBlur,
    id: props.id
  };
};

class AriaMenuButtonWrapper extends React.Component {
  static propTypes = checkedProps;
  static defaultProps = { tag: "div" };

  constructor(props) {
    super(props);
    this.manager = createManager(managerOptionsFromProps(props));
  }

  componentDidUpdate() {
    this.manager.updateOptions(managerOptionsFromProps(this.props));
  }

  render() {
    const wrapperProps = {};
    specialAssign(wrapperProps, this.props, checkedProps);

    return React.createElement(
      ManagerContext.Provider,
      { value: this.manager },
      React.createElement(this.props.tag, wrapperProps, this.props.children)
    );
  }
}

export default React.forwardRef((props, ref) => {
  const wrapperProps = { forwardedRef: ref };
  specialAssign(wrapperProps, props, {
    children: checkedProps.children,
    forwardedRef: checkedProps.forwardedRef
  });
  specialAssign(wrapperProps, { forwardedRef: ref });
  return React.createElement(
    AriaMenuButtonWrapper,
    wrapperProps,
    props.children
  );
});
