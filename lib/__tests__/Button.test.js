var React = require('react');
var ReactDOMServer = require('react-dom/server');
var shallow = require('enzyme').shallow;
var shallowToJson = require('enzyme-to-json').shallowToJson;
var Button = require('../Button');
var MockWrapper = require('./helpers/MockWrapper');
var createMockKeyEvent = require('./helpers/createMockKeyEvent');
var createMockManager = require('./helpers/createMockManager');

var el = React.createElement;

describe('<Button>', function() {
  var shallowOptions;
  var ambManager;
  var downEvent;
  var enterEvent;
  var spaceEvent;
  var escapeEvent;
  var fEvent;

  beforeEach(function() {
    ambManager = createMockManager();
    shallowOptions = {
      context: { ambManager: ambManager },
    };
    downEvent = createMockKeyEvent('ArrowDown');
    enterEvent = createMockKeyEvent('Enter');
    spaceEvent = createMockKeyEvent(' ');
    escapeEvent = createMockKeyEvent('Escape');
    fEvent = createMockKeyEvent(null, 70);
  });

  it('DOM with only required props and text child', function() {
    var wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('DOM with all possible props and element child', function() {
    var button = el(
      Button,
      {
        id: 'foo',
        className: 'bar',
        style: { top: 2 },
        tag: 'button',
        disabled: true,
        'data-something-something': 'seven', // arbitrary prop
      },
      el('span', null, 'hooha')
    );
    var wrapper = shallow(button, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('click', function() {
    var wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('click');

    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  it('click when disabled', function() {
    var wrapper = shallow(el(Button, { disabled: true }, 'foo'), shallowOptions);
    wrapper.simulate('click');

    expect(ambManager.toggleMenu).not.toHaveBeenCalled();
  });

  it('down arrow when closed', function() {
    var wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', downEvent);

    expect(downEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.openMenu).toHaveBeenCalledTimes(1);
    expect(ambManager.openMenu).toHaveBeenCalledWith({ focusMenu: true });
  });

  it('down arrow when open', function() {
    var wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    ambManager.isOpen = true;
    wrapper.simulate('keyDown', downEvent);

    expect(downEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.openMenu).not.toHaveBeenCalled();
    expect(ambManager.focusItem).toHaveBeenCalledTimes(1);
    expect(ambManager.focusItem).toHaveBeenCalledWith(0);
  });

  it('enter key', function() {
    var wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', enterEvent);

    expect(enterEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  it('space key', function() {
    var wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', spaceEvent);

    expect(spaceEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(ambManager.toggleMenu).toHaveBeenCalledTimes(1);
  });

  it('escape key', function() {
    var wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', escapeEvent);

    expect(ambManager.handleMenuKey).toHaveBeenCalledTimes(1);
    expect(ambManager.handleMenuKey.mock.calls[0][0].key).toBe('Escape');
  });

  it('f key', function() {
    var wrapper = shallow(el(Button, null, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', fEvent);

    expect(ambManager.handleButtonNonArrowKey).toHaveBeenCalledTimes(1);
    expect(ambManager.handleButtonNonArrowKey.mock.calls[0][0].keyCode).toBe(70);
  });

  it('enter key when disabled', function() {
    var wrapper = shallow(el(Button, { disabled: true }, 'foo'), shallowOptions);
    wrapper.simulate('keyDown', enterEvent);

    expect(enterEvent.preventDefault).not.toHaveBeenCalled();
    expect(ambManager.toggleMenu).not.toHaveBeenCalled();
  });
});

describe('<Button> rendered via renderToString', function() {
  it('does not throw', function() {
    var output = ReactDOMServer.renderToString(
      el(MockWrapper, { mockManager: createMockManager() },
        el(Button, null, 'foo')
      )
    );
    expect(output).toMatchSnapshot();
  });
});
