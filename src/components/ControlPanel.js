import React, { Component } from 'react';
import { Card, Checkbox, Dropdown, Icon, Popup } from 'semantic-ui-react';

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
          <br />
          <Checkbox
            label="Dioceses"
            checked={this.props.showDioceses}
            onChange={(e, data) =>
              this.props.toggleCheckBox('showDioceses', data.checked)
            }
          />
          <br />
          <Checkbox
            label="Provinces"
            checked={this.props.showProvinces}
            onChange={(e, data) =>
              this.props.toggleCheckBox('showProvinces', data.checked)
            }
          />
          <br />

          <Popup
            content="Show regions that do not appear in the database as striped area"
            position="left center"
            inverted
            trigger={
              <Checkbox
                label="Base Layer"
                checked={this.props.showStripedRegions}
                onChange={(e, data) =>
                  this.props.toggleCheckBox('showStripedRegions', data.checked)
                }
              />
            }
          />
        </Card.Content>
      </Card>
    );
  }
}

export default ControlPanel;
