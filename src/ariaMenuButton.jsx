import React from 'react';
import Manager from './Manager';
import Button from './Button';
import Menu from './Menu';
import MenuItem from './MenuItem';

// Create a new Manager and use it in wrappers for
// a Button, Menu, and MenuItem components that will
// be tied together
export default function(options) {
  const manager = new Manager(options);
  return {
    Button: class ButtonWrapper extends React.Component {
      render() {
        return <Button manager={manager} {...this.props} />;
      }
    },
    Menu: class MenuWrapper extends React.Component {
      render() {
        return <Menu manager={manager} {...this.props} />;
      }
    },
    MenuItem: class MenuItemWrapper extends React.Component {
      render() {
        return <MenuItem manager={manager} {...this.props} />;
      }
    },
  };
}
