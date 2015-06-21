import React from 'react';
import Container from './Container';
import MenuItem from './MenuItem';
import Manager from './Manager';

// Create a new Manager and use it in wrappers for
// a Container and MenuItem component that will
// be tied together
export default function() {
  const manager = new Manager();
  return {
    Container: class ContainerWrapper extends React.Component {
      render() {
        return <Container manager={manager} {...this.props} />;
      }
    },
    MenuItem: class MenuItemWrapper extends React.Component {
      render() {
        return <MenuItem manager={manager} {...this.props} />;
      }
    },
  };
}
