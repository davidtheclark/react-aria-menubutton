import React from 'react';

const { TestUtils } = React.addons;

export function render(c, cb) {
  var testEl = document.createElement('div');
  document.body.appendChild(testEl);
  React.render(c, testEl, cb);
}

export function getContainer(c) {
  return TestUtils.findRenderedDOMComponentWithClass(c, 'AriaMenuButton');
}

export function getContainerNode(c) {
  return React.findDOMNode(getContainer(c));
}

export function getTrigger(c) {
  return TestUtils.findRenderedDOMComponentWithClass(c, 'AriaMenuButton-trigger');
}

export function getTriggerNode(c) {
  return React.findDOMNode(getTrigger(c));
}

export function getMenuWrapper(c) {
  return TestUtils.findRenderedDOMComponentWithClass(c, 'AriaMenuButton-menuWrapper');
}

export function getMenuWrapperNode(c) {
  return React.findDOMNode(getMenuWrapper(c));
}

export function getMenu(c) {
  return TestUtils.findRenderedDOMComponentWithClass(c, 'AriaMenuButton-menu');
}

export function getMenuNode(c) {
  return React.findDOMNode(getMenu(c));
}

export function getMenuItems(c) {
  return TestUtils.scryRenderedDOMComponentsWithClass(c, 'AriaMenuButton-menuItem');
}

export function getMenuItemNodes(c) {
  return getMenuItems(c).map(i => React.findDOMNode(i));
}

export function eachMenuItemNode(c, cb) {
  getMenuItems(c).forEach((item, i) => cb(React.findDOMNode(item), i));
}

export function getClassList(node) {
  return node.className.split(' ');
}

export function classListContains(node, str) {
  return getClassList(node).indexOf(str) !== -1;
}

export function menuIsOpen(c) {
  // TestUtils.findRenderedDOMComponentWithClass() throws an error
  // when it doesn't find anything
  try {
    getMenu(c);
    return true;
  } catch(e) {
    return false;
  }
}
