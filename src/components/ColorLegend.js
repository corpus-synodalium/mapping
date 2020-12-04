import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

class ColorLegend extends Component {
    render() {
        if (!this.props.mappingData) {
            return null;
        }
        const { maxNumEntries, currentColorScheme } = this.props;
        const { colorSchemes } = this.props.config;
        const colors = colorSchemes[currentColorScheme];
        const numPerBucket = Math.ceil(maxNumEntries / colors.length);

        const getStyle = (colorHex) => ({
            background: colorHex,
        });

        const colorBlocks = [];

        colorBlocks.push(
            <React.Fragment key="#fff">
                <i style={getStyle('#fff')} />
                0
                <br />
            </React.Fragment>
        );

        for (let i = 0; i < colors.length; i++) {
            const start = i * numPerBucket + 1;
            const end = (i + 1) * numPerBucket;
            let range = `${start} - ${end}`;
            if (i === colors.length - 1) {
                range = `> ${start}`;
            }
            colorBlocks.push(
                <React.Fragment key={colors[i]}>
                    <i style={getStyle(colors[i])} />
                    {range}
                    <br />
                </React.Fragment>
            );
        }

        return (
            <div className="panel-left panel-legend">
                <h4 className="panel-left-frequency">Frequency</h4>
                <Card>
                    <Card.Content>{colorBlocks}</Card.Content>
                </Card>
            </div>
        );
    }
}

export default ColorLegend;
