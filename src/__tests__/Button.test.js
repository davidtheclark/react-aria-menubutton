const React = require('react');
const ReactDOMServer = require('react-dom/server');
const shallow = require('enzyme').shallow;
const shallowToJson = require('enzyme-to-json').shallowToJson;
const Button = require('../Button');
const ManagerContext = require('../ManagerContext');
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
      wrappingComponent: ManagerContext.Provider,
      wrappingComponentProps: { value: ambManager }
    };
    downEvent = createMockKeyEvent('ArrowDown');
    enterEvent = createMockKeyEvent('Enter');
    spaceEvent = createMockKeyEvent(' ');
    escapeEvent = createMockKeyEvent('Escape');
    fEvent = createMockKeyEvent(null, 70);
  });

  test('DOM with only required props and text child', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions)
      .dive()
      .dive();
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  test('no onBlur prop when closeOnBlur is false', function() {
    const manager = createManager({ closeOnBlur: false });
    const shallowOptions = {
      wrappingComponent: ManagerContext.Provider,
      wrappingComponentProps: { value: manager }
    };
    const wrapper = shallow(el(Button, null, ''), shallowOptions)
      .dive()
      .dive();
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
    const wrapper = shallow(button, shallowOptions)
      .dive()
      .dive();
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  test('click', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions)
      .dive()
      .dive();
    wrapper.simulate('click');

    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  test('click when disabled', function() {
    const wrapper = shallow(
      el(Button, { disabled: true }, 'foo'),
      shallowOptions
    )
      .dive()
      .dive();
    wrapper.simulate('click');

    expect(ambManager.toggleMenu).not.toHaveBeenCalled();
  });

  test('element has disabled attribute when disabled property is set to true', function() {
    const wrapper = shallow(
      el(Button, { disabled: true, tag: 'button' }, 'foo'),
      shallowOptions
    )
      .dive()
      .dive();

    expect(wrapper.props().disabled).toBeTruthy();
  });

  test('down arrow when closed', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions)
      .dive()
      .dive();
    wrapper.simulate('keyDown', downEvent);

    expect(downEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.openMenu).toHaveBeenCalledTimes(1);
    expect(ambManager.openMenu).toHaveBeenCalledWith();
  });

  test('down arrow when open', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions)
      .dive()
      .dive();
    ambManager.isOpen = true;
    wrapper.simulate('keyDown', downEvent);

    expect(downEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.openMenu).not.toHaveBeenCalled();
  });

  test('enter key', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions)
      .dive()
      .dive();
    wrapper.simulate('keyDown', enterEvent);

    expect(enterEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  test('space key', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions)
      .dive()
      .dive();
    wrapper.simulate('keyDown', spaceEvent);

    expect(spaceEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  test('escape key', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions)
      .dive()
      .dive();
    wrapper.simulate('keyDown', escapeEvent);

    expect(ambManager.handleMenuKey).toHaveBeenCalledTimes(1);
    expect(ambManager.handleMenuKey.mock.calls[0][0].key).toBe('Escape');
  });

  test('f key', function() {
    const wrapper = shallow(el(Button, null, 'foo'), shallowOptions)
      .dive()
      .dive();
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
    )
      .dive()
      .dive();
    wrapper.simulate('keyDown', enterEvent);

    expect(enterEvent.preventDefault).not.toHaveBeenCalled();
    expect(ambManager.toggleMenu).not.toHaveBeenCalled();
  });

  test('prevent manager event when enter key is released.', function() {
    const wrapper = shallow(
      el(Button, { tag: 'button' }, 'foo'),
      shallowOptions
    );
    jest.spyOn(ambManager, 'toggleMenu').mockImplementation(() => {
      ambManager.isOpen = !ambManager.isOpen;
    });

    wrapper.simulate('click');
    expect(ambManager.isOpen).toBe(true);

    wrapper.simulate('keydown', enterEvent);
    expect(ambManager.isOpen).toBe(false);

    wrapper.simulate('keyup', enterEvent);
    expect(ambManager.isOpen).toBe(false);
    expect(enterEvent.preventDefault).toHaveBeenCalled();
  });

  test('prevent manager event when space key is released.', function() {
    const wrapper = shallow(
      el(Button, { tag: 'button' }, 'foo'),
      shallowOptions
    );
    jest.spyOn(ambManager, 'toggleMenu').mockImplementation(() => {
      ambManager.isOpen = !ambManager.isOpen;
    });

    wrapper.simulate('click');
    expect(ambManager.isOpen).toBe(true);

    wrapper.simulate('keydown', spaceEvent);
    expect(ambManager.isOpen).toBe(false);

    wrapper.simulate('keyup', spaceEvent);
    expect(ambManager.isOpen).toBe(false);
    expect(spaceEvent.preventDefault).toHaveBeenCalled();
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
