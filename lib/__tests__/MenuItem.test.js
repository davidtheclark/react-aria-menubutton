var React = require('react');
var ReactDOMServer = require('react-dom/server');
var shallow = require('enzyme').shallow;
var shallowToJson = require('enzyme-to-json').shallowToJson;
var MenuItem = require('../MenuItem');
var MockWrapper = require('./helpers/MockWrapper');
var createMockKeyEvent = require('./helpers/createMockKeyEvent');
var createMockManager = require('./helpers/createMockManager');

var el = React.createElement;

describe('<MenuItem>', function() {
  var shallowOptions;
  var ambManager;

  beforeEach(function() {
    ambManager = createMockManager();
    shallowOptions = {
      context: { ambManager: ambManager },
    };
  });

  it('DOM with only required props', function() {
    var menuItem = el(MenuItem, null, 'foo');
    var wrapper = shallow(menuItem, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('DOM with all possible props and element child', function() {
    var menuItem = el(MenuItem,
      {
        className: 'foobar',
        id: 'hogwash',
        tag: 'li',
        style: { right: '1em' },
        text: 'horse',
        value: 'lamb',
        'data-something-something': 'seven', // arbitrary prop
      },
      el('a', { href: '#' }, 'foo')
    );
    var wrapper = shallow(menuItem, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('click without specified value prop', function() {
    var mockEvent = { bee: 'baa' };
    var menuItem = el(MenuItem, null, 'foo');
    var wrapper = shallow(menuItem, shallowOptions);
    wrapper.simulate('click', mockEvent);
    expect(ambManager.handleSelection).toHaveBeenCalledTimes(1);
    expect(ambManager.handleSelection.mock.calls[0]).toEqual(['foo', mockEvent]);
  });

  it('click with specified value prop', function() {
    var mockEvent = { bee: 'baa' };
    var menuItem = el(MenuItem, { value: 'bar' }, 'foo');
    var wrapper = shallow(menuItem, shallowOptions);
    wrapper.simulate('click', mockEvent);
    expect(ambManager.handleSelection).toHaveBeenCalledTimes(1);
    expect(ambManager.handleSelection.mock.calls[0]).toEqual(['bar', mockEvent]);
  });

  it('click with specified value prop', function() {
    var mockEnterEvent = createMockKeyEvent('Enter');
    var mockSpaceEvent = createMockKeyEvent(' ');
    var mockEscapeEvent = createMockKeyEvent('Escape');
    var menuItem = el(MenuItem, null, 'foo');
    var wrapper = shallow(menuItem, shallowOptions);

    wrapper.simulate('keyDown', mockEnterEvent);
    wrapper.simulate('keyDown', mockSpaceEvent);
    wrapper.simulate('keyDown', mockEscapeEvent);
    expect(ambManager.handleSelection).toHaveBeenCalledTimes(2);
    expect(ambManager.handleSelection.mock.calls[0]).toEqual(['foo', mockEnterEvent]);
    expect(ambManager.handleSelection.mock.calls[1]).toEqual(['foo', mockSpaceEvent]);
  });
});

describe('<MenuItem> rendered via renderToString', function() {
  it('does not throw', function() {
    var output = ReactDOMServer.renderToString(
      el(MockWrapper, { mockManager: createMockManager() },
        el(MenuItem, null, 'foo')
      )
    );
    expect(output).toMatchSnapshot();
  });
});
