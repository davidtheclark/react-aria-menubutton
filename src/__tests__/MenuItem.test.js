const React = require('react');
const ReactDOMServer = require('react-dom/server');
const shallow = require('enzyme').shallow;
const shallowToJson = require('enzyme-to-json').shallowToJson;
const MenuItem = require('../MenuItem');
const MockWrapper = require('./helpers/MockWrapper');
const createMockKeyEvent = require('./helpers/createMockKeyEvent');
const createMockManager = require('./helpers/createMockManager');

const el = React.createElement;

describe('<MenuItem>', function() {
  let shallowOptions;
  let ambManager;

  beforeEach(function() {
    ambManager = createMockManager();
    shallowOptions = {
      context: { ambManager: ambManager }
    };
  });

  it('DOM with only required props', function() {
    const menuItem = el(MenuItem, null, 'foo');
    const wrapper = shallow(menuItem, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('DOM with all possible props and element child', function() {
    const menuItem = el(
      MenuItem,
      {
        className: 'foobar',
        id: 'hogwash',
        tag: 'li',
        style: { right: '1em' },
        text: 'horse',
        value: 'lamb',
        'data-something-something': 'seven' // arbitrary prop
      },
      el('a', { href: '#' }, 'foo')
    );
    const wrapper = shallow(menuItem, shallowOptions);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('click without specified value prop', function() {
    const mockEvent = { bee: 'baa' };
    const menuItem = el(MenuItem, null, 'foo');
    const wrapper = shallow(menuItem, shallowOptions);
    wrapper.simulate('click', mockEvent);
    expect(ambManager.handleSelection).toHaveBeenCalledTimes(1);
    expect(ambManager.handleSelection.mock.calls[0]).toEqual([
      'foo',
      mockEvent
    ]);
  });

  it('click with specified value prop', function() {
    const mockEvent = { bee: 'baa' };
    const menuItem = el(MenuItem, { value: 'bar' }, 'foo');
    const wrapper = shallow(menuItem, shallowOptions);
    wrapper.simulate('click', mockEvent);
    expect(ambManager.handleSelection).toHaveBeenCalledTimes(1);
    expect(ambManager.handleSelection.mock.calls[0]).toEqual([
      'bar',
      mockEvent
    ]);
  });

  it('click with specified value prop', function() {
    const mockEnterEvent = createMockKeyEvent('Enter');
    const mockSpaceEvent = createMockKeyEvent(' ');
    const mockEscapeEvent = createMockKeyEvent('Escape');
    const menuItem = el(MenuItem, null, 'foo');
    const wrapper = shallow(menuItem, shallowOptions);

    wrapper.simulate('keyDown', mockEnterEvent);
    wrapper.simulate('keyDown', mockSpaceEvent);
    wrapper.simulate('keyDown', mockEscapeEvent);
    expect(ambManager.handleSelection).toHaveBeenCalledTimes(2);
    expect(ambManager.handleSelection.mock.calls[0]).toEqual([
      'foo',
      mockEnterEvent
    ]);
    expect(ambManager.handleSelection.mock.calls[1]).toEqual([
      'foo',
      mockSpaceEvent
    ]);
  });
});

describe('<MenuItem> rendered via renderToString', function() {
  it('does not throw', function() {
    const output = ReactDOMServer.renderToString(
      el(
        MockWrapper,
        { mockManager: createMockManager() },
        el(MenuItem, null, 'foo')
      )
    );
    expect(output).toMatchSnapshot();
  });
});
