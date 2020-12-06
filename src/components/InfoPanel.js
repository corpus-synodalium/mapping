import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { Card } from 'semantic-ui-react';

class InfoPanel extends Component {
    render() {
        const { info } = this.props;
        const title = info ? info.title : 'Hover over a region';

        // Province and Modern country
        const attributes = ['province', 'country'];
        const displayNames = {
            province: 'Province',
            country: 'Modern Country',
        };
        const provinceCountry = [];
        if (info) {
            for (let i = 0; i < attributes.length; i++) {
                const attr = attributes[i];
                if (info.hasOwnProperty(attr)) {
                    provinceCountry.push(
                        <li key={attr}>
                            {displayNames[attr]}: {info[attr]}
                        </li>
                    );
                }
            }
        }

        return (
            <Draggable>
                <Card className="panel panel-info">
                    <Card.Content>
                        <h4>{title}</h4>
                        {info && (
                            <ul className="panel-list">{provinceCountry}</ul>
                        )}
                        {info && info.searchData && (
                            <div>Total hits: ({info.searchData.length})</div>
                        )}
                    </Card.Content>
                </Card>
            </Draggable>
        );
    }
}

export default InfoPanel;
