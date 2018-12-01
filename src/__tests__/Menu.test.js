const React = require('react');
const ReactDOMServer = require('react-dom/server');
const shallow = require('enzyme').shallow;
const mount = require('enzyme').mount;
const shallowToJson = require('enzyme-to-json').shallowToJson;
const Menu = require('../Menu');
const MockWrapper = require('./helpers/MockWrapper');
const createMockManager = require('./helpers/createMockManager');
const createManager = require('../createManager');

const el = React.createElement;

describe('<Menu>', function() {
  let shallowOptions;
  let ambManager;

  beforeEach(function() {
    ambManager = createMockManager();
    shallowOptions = {
      context: { ambManager: ambManager }
    };
  });

  test('closed Menu DOM with only required props and element child', function() {
    const menuEl = el(Menu, null, el('div', null, 'foo'));
    const wrapper = shallow(menuEl, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  test('no onBlur prop when closeOnBlur is false', function() {
    const ambManager = createManager({ closeOnBlur: false });
    ambManager.isOpen = true;
    const shallowOptions = { context: { ambManager: ambManager } };
    const menuEl = el(Menu, null, el('div', null, 'foo'));
    const wrapper = shallow(menuEl, shallowOptions);
    expect(shallowToJson(wrapper).props).not.toHaveProperty('onBlur');
  });

  test('open Menu DOM with only required props and element child', function() {
    ambManager.isOpen = true;
    const menuEl = el(Menu, null, el('div', null, el('div', null, 'foo')));
    const wrapper = shallow(menuEl, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  test('closed menu DOM with all possible props and function child', function() {
    const childFunction = jest.fn().mockImplementation(function(menuState) {
      return 'isOpen = ' + menuState.isOpen;
    });
    const menuEl = el(
      Menu,
      {
        id: 'foo',
        className: 'bar',
        style: { bottom: 1 },
        tag: 'ul',
        'data-something-something': 'seven' // arbitrary prop
      },
      childFunction
    );
    const wrapper = shallow(menuEl, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    expect(childFunction).toHaveBeenCalledTimes(1);
    expect(childFunction.mock.calls[0]).toEqual([{ isOpen: false }]);
  });

  test('open menu DOM with all possible props and function child', function() {
    ambManager.isOpen = true;
    const childFunction = jest.fn().mockImplementation(function(menuState) {
      return 'isOpen = ' + menuState.isOpen;
    });
    const menuEl = el(
      Menu,
      {
        id: 'bar',
        className: 'foo',
        style: { left: 1 },
        tag: 'section'
      },
      childFunction
    );
    const wrapper = shallow(menuEl, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    expect(childFunction).toHaveBeenCalledTimes(1);
    expect(childFunction.mock.calls[0]).toEqual([{ isOpen: true }]);
  });

  test('menu updating', function() {
    ambManager.menuItems = [1, 2];
    const childFunction = jest.fn();

    class LittleApp extends React.Component {
      state = { open: false };

      toggleMenu = () => {
        this.setState({ open: !this.state.open });
      };

      render() {
        return el(
          MockWrapper,
          { mockManager: ambManager },
          el(Menu, null, childFunction)
        );
      }
    }

    const wrapper = mount(el(LittleApp));
    wrapper.instance().toggleMenu();
    expect(ambManager.clearItems).toHaveBeenCalledTimes(1);
  });
});

describe('<Menu> rendered via renderToString', function() {
  test('does not throw', function() {
    const output = ReactDOMServer.renderToString(
      el(
        MockWrapper,
        { mockManager: createMockManager() },
        el(Menu, null, el('div', null, 'foo'))
      )
    );
    expect(output).toMatchSnapshot();
  });
});
