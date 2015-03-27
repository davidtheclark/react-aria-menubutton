import React from 'react';
import classNames from 'classnames';
import createAriaMenuButton from '..';

const AriaMenuButton = createAriaMenuButton(React, classNames);
const demoStyle = document.getElementById('demo-style');

const stylesheets = {
  base: require('../css/base.css'),
  bootstrap: require('../css/bootstrap.css'),
  foundation: require('../css/foundation.css'),
  google: require('../css/google.css'),
  github: require('../css/github.css')
};

const styleItems = [{
  content: 'Bootstrap',
  value: 'bootstrap'
}, {
  content: 'Foundation',
  value: 'foundation'
}, {
  content: 'Google',
  value: 'google'
}, {
  content: 'Github',
  value: 'github'
}, {
  content: 'Base',
  value: 'base'
}];

demoStyle.textContent = stylesheets.bootstrap;

class Demo extends React.Component {
  constructor() {
    this.state = { selected: 'bootstrap' };
  }

  handleSelection(val) {
    demoStyle.textContent = stylesheets[val];
    this.setState({ selected: val });
  }

  render() {
    return (
      <div>
        <p>
          Current style is: <strong>{this.state.selected.charAt(0).toUpperCase() + this.state.selected.slice(1)}</strong>
        </p>
        <AriaMenuButton id='style-select-bootstrap'
         handleSelection={this.handleSelection.bind(this)}
         triggerLabel='Choose a different style'
         items={styleItems}
         selectedValue={this.state.selected} />
      </div>
    );
  }
}

React.render(
  /* eslint-disable */
  <Demo />,
  /* eslint-enable */
  document.getElementById('style-select')
);
