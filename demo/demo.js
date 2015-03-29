import React from 'react/addons';
import classNames from 'classnames';
import createAriaMenuButton from '..';

const AriaMenuButton = createAriaMenuButton(React, classNames);
const demoStyle = document.getElementById('demo-style');

/**
 * Stylesheet-selecting demo
 */

const stylesheets = {
  base: require('../css/base.css'),
  bootstrap: require('../css/bootstrap.css'),
  foundation: require('../css/foundation.css'),
  google: require('../css/google.css'),
  github: require('../css/github.css')
};

const styleItems = [{
  content: 'Github',
  value: 'github'
}, {
  content: 'Bootstrap',
  value: 'bootstrap'
}, {
  content: 'Foundation',
  value: 'foundation'
}, {
  content: 'Google',
  value: 'google'
}, {
  content: 'Base',
  value: 'base'
}];

const firstSelected = 'github';
demoStyle.textContent = stylesheets[firstSelected];

class Demo extends React.Component {
  constructor() {
    this.state = { selected: firstSelected };
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
        <AriaMenuButton id='style-select'
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


/**
 * Fanciness demo
 */

const fancyStuff = ['bowling', 'science', 'scooting'];

const fancyMenuItem = fancyStuff.map(activity => {
  return {
    content: (
      <div className='Fancy-item'>
        <img src={`demo/svg/${activity}.svg`} className='Fancy-svg' />
        <span className='Fancy-text'>
          Humans enjoy
          <span className='Fancy-keyword'>
            {activity}
          </span>
        </span>
      </div>
    ),
    text: activity,
    value: activity
  };
});

class Fancy extends React.Component {
  render() {
    return (
      <AriaMenuButton id='fancy'
       handleSelection={() => {}}
       triggerLabel='Fancy stuff'
       items={fancyMenuItem}
       transition={true} />
    );
  }
}

React.render(
  /* eslint-disable */
  <Fancy />,
  /* eslint-enable */
  document.getElementById('fancy-container')
);

// Pre-load the SVGs
fancyStuff.forEach(t => {
  const x = new Image();
  x.src = `demo/svg/${t}.svg`;
});
