import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

class InfoPanel extends Component {
  render() {
    const { info } = this.props;
    const title = info ? info.title : 'Hover over a region';

    // Province and Modern country
    const attributes = ['province', 'country'];
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const provinceCountry = [];
    if (info) {
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        if (info.hasOwnProperty(attr)) {
          provinceCountry.push(
            <li key={attr}>
              {capitalize(attr)}: {info[attr]}
            </li>
          );
        }
      }
    }

    return (
      <Card className="panel panel-info">
        <Card.Content>
          <h4>{title}</h4>
          {info && <ul className="panel-list">{provinceCountry}</ul>}
          {info && info.searchData && (
            <div>Total hits: ({info.searchData.length})</div>
          )}
        </Card.Content>
      </Card>
    );
  }
}

export default InfoPanel;
