import React, { Component } from 'react';
import { Card, Dropdown, Icon } from 'semantic-ui-react';

class ControlPanel extends Component {
  render() {
    const colorSchemeOptions = [
      {
        text: 'Black & White',
        value: 'bw',
      },
      {
        text: 'Colors #1',
        value: 'color1',
      },
      {
        text: 'Colors #2',
        value: 'color2',
      },
      {
        text: 'Colors #3',
        value: 'color3',
      },
      {
        text: 'Colors #4',
        value: 'color4',
      },
    ];
    return (
      <Card className="panel">
        <Card.Content>
          <h4>
            <Icon name="setting" /> Control Panel
          </h4>
          <Dropdown
            placeholder="color scheme"
            options={colorSchemeOptions}
            onChange={(e, data) => this.props.changeColorScheme(data.value)}
            selection
            fluid
          />
        </Card.Content>
      </Card>
    );
  }
}

export default ControlPanel;
