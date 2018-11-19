const React = require('react');
const ReactDOMServer = require('react-dom/server');
const shallow = require('enzyme').shallow;
const shallowToJson = require('enzyme-to-json').shallowToJson;
const Button = require('../Button');
const MockWrapper = require('./helpers/MockWrapper');
const createMockKeyEvent = require('./helpers/createMockKeyEvent');
const createMockManager = require('./helpers/createMockManager');
const createManager = require('../createManager');

const el = React.createElement;

describe('<Button>', function() {
  let shallowOptions;
  let ambManager;
  let downEvent;
  let enterEvent;
  let spaceEvent;
  let escapeEvent;
  let fEvent;

  beforeEach(function() {
    ambManager = createMockManager();
    shallowOptions = {
      context: { ambManager: ambManager }
    };
    downEvent = createMockKeyEvent('ArrowDown');
    enterEvent = createMockKeyEvent('Enter');
    spaceEvent = createMockKeyEvent(' ');
    escapeEvent = createMockKeyEvent('Escape');
    fEvent = createMockKeyEvent(null, 70);
  });

  test('DOM with only required props and text child', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  test('no onBlur prop when closeOnBlur is false', function() {
    const manager = createManager({ closeOnBlur: false });
    const shallowOptions = { context: { ambManager: manager } };
    const wrapper = shallow(el(Button, null, ''), shallowOptions);
    expect(shallowToJson(wrapper).props).not.toHaveProperty('onBlur');
  });

  test('DOM with all possible props and element child', function() {
    const button = el(
      Button,
      {
        id: 'foo',
        className: 'bar',
        style: { top: 2 },
        tag: 'button',
        disabled: true,
        'data-something-something': 'seven' // arbitrary prop
      },
      el('span', null, 'hooha')
    );
    const wrapper = shallow(button, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  test('click', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('click');

    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  test('click when disabled', function() {
    const wrapper = shallow(
      el(Button, { disabled: true }, 'foo'),
      shallowOptions
    );
    wrapper.simulate('click');

    expect(ambManager.toggleMenu).not.toHaveBeenCalled();
  });

  test('element has disabled attribute when disabled property is set to true', function() {
    const wrapper = shallow(
      el(Button, { disabled: true, tag: 'button' }, 'foo'),
      shallowOptions
    );

    expect(wrapper.props().disabled).toBeTruthy();
  });

  test('down arrow when closed', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', downEvent);

    expect(downEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.openMenu).toHaveBeenCalledTimes(1);
    expect(ambManager.openMenu).toHaveBeenCalledWith();
  });

  test('down arrow when open', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    ambManager.isOpen = true;
    wrapper.simulate('keyDown', downEvent);

    expect(downEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.openMenu).not.toHaveBeenCalled();
  });

  test('enter key', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', enterEvent);

    expect(enterEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  test('space key', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', spaceEvent);

    expect(spaceEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  test('escape key', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', escapeEvent);

    expect(ambManager.handleMenuKey).toHaveBeenCalledTimes(1);
    expect(ambManager.handleMenuKey.mock.calls[0][0].key).toBe('Escape');
  });

  test('f key', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', fEvent);

    expect(ambManager.handleButtonNonArrowKey).toHaveBeenCalledTimes(1);
    expect(ambManager.handleButtonNonArrowKey.mock.calls[0][0].keyCode).toBe(
      70
    );
  });

  test('enter key when disabled', function() {
    const wrapper = shallow(
      el(Button, { disabled: true }, 'foo'),
      shallowOptions
    );
    wrapper.simulate('keyDown', enterEvent);

    expect(enterEvent.preventDefault).not.toHaveBeenCalled();
    expect(ambManager.toggleMenu).not.toHaveBeenCalled();
  });
});

describe('<Button> rendered via renderToString', function() {
  test('does not throw', function() {
    const output = ReactDOMServer.renderToString(
      el(
        MockWrapper,
        { mockManager: createMockManager() },
        el(Button, null, 'foo')
      )
    );
    expect(output).toMatchSnapshot();
  });
});
