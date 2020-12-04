import React, { Component } from 'react';
import { Card, Checkbox, Dropdown, Icon, Popup } from 'semantic-ui-react';
import {
    COLOR_SCHEMES,
    DIOCESE_PROVINCE,
    LAYER_VIEW_MODES,
} from '../utils/constants/cosyn-constants';

class ControlPanel extends Component {
    render() {
        return (
            <Card className="panel">
                <Card.Content>
                    <h4>
                        <Icon name="setting" /> Control Panel
                    </h4>
                    <Dropdown
                        placeholder="Color Scheme"
                        options={COLOR_SCHEMES}
                        onChange={(e, data) =>
                            this.props.changeColorScheme(data.value)
                        }
                        selection
                        fluid
                    />
                    <br />
                    <Dropdown
                        defaultValue={DIOCESE_PROVINCE}
                        options={LAYER_VIEW_MODES}
                        onChange={(e, data) =>
                            this.props.changeLayerViewMode(data.value)
                        }
                        selection
                        fluid
                    />
                    <br />

                    <Popup
                        content="Striped areas indicate the absence of any associated texts in the CoSyn corpus"
                        position="left center"
                        inverted
                        trigger={
                            <Checkbox
                                label="Show regions that are not in database"
                                checked={this.props.showStripedRegions}
                                onChange={(e, data) =>
                                    this.props.toggleCheckBox(
                                        'showStripedRegions',
                                        data.checked
                                    )
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
