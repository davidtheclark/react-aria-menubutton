var React = require('react');
var ReactDOMServer = require('react-dom/server');
var shallow = require('enzyme').shallow;
var mount = require('enzyme').mount;
var shallowToJson = require('enzyme-to-json').shallowToJson;
var Menu = require('../Menu');
var MockWrapper = require('./helpers/MockWrapper');
var createMockManager = require('./helpers/createMockManager');

var el = React.createElement;

describe('<Menu>', function() {
  var shallowOptions;
  var ambManager;

  beforeEach(function() {
    ambManager = createMockManager();
    shallowOptions = {
      context: { ambManager: ambManager },
    };
  });

  it('closed Menu DOM with only required props and element child', function() {
    var menuEl = el(Menu, null,
      el('div', null, 'foo')
    );
    var wrapper = shallow(menuEl, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('open Menu DOM with only required props and element child', function() {
    ambManager.isOpen = true;
    var menuEl = el(Menu, null,
      el('div', null, el('div', null, 'foo'))
    );
    var wrapper = shallow(menuEl, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('closed menu DOM with all possible props and function child', function() {
    var childFunction = jest.fn().mockImplementation(function(menuState) {
      return 'isOpen = ' + menuState.isOpen;
    });
    var menuEl = el(Menu, {
      id: 'foo',
      className: 'bar',
      style: { bottom: 1 },
      tag: 'ul',
      'data-something-something': 'seven', // arbitrary prop
    }, childFunction);
    var wrapper = shallow(menuEl, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    expect(childFunction).toHaveBeenCalledTimes(1);
    expect(childFunction.mock.calls[0]).toEqual([{ isOpen: false }]);
  });

  it('open menu DOM with all possible props and function child', function() {
    ambManager.isOpen = true;
    var childFunction = jest.fn().mockImplementation(function(menuState) {
      return 'isOpen = ' + menuState.isOpen;
    });
    var menuEl = el(Menu, {
      id: 'bar',
      className: 'foo',
      style: { left: 1 },
      tag: 'section',
    }, childFunction);
    var wrapper = shallow(menuEl, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    expect(childFunction).toHaveBeenCalledTimes(1);
    expect(childFunction.mock.calls[0]).toEqual([{ isOpen: true }]);
  });

  it('menu updating', function() {
    ambManager.menuItems = [1, 2];
    var childFunction = jest.fn();

    var LittleApp = React.createClass({
      getInitialState: function() {
        return { open: false };
      },
      toggleMenu: function() {
        this.setState({ open: !this.state.open });
      },
      render: function() {
        return el(MockWrapper, { mockManager: ambManager },
          el(Menu, null, childFunction)
        );
      },
    });

    var wrapper = mount(el(LittleApp));
    wrapper.instance().toggleMenu();
    expect(ambManager.clearItems).toHaveBeenCalledTimes(1);
  });
});

describe('<Menu> rendered via renderToString', function() {
  it('does not throw', function() {
    var output = ReactDOMServer.renderToString(
      el(MockWrapper, { mockManager: createMockManager() },
        el(Menu, null, el('div', null, 'foo'))
      )
    );
    expect(output).toMatchSnapshot();
  });
});
