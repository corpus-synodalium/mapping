import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import PasteURLModal from './PasteURLModal';
import ShareMapButton from './ShareMapButton';

const VERSION = 'v0.6.0';

class TopMenuBar extends Component {
    render() {
        return (
            <Menu borderless>
                <Menu.Item>
                    <img src="/favicon.ico" alt="React Logo" />
                </Menu.Item>

                <Menu.Item name="map-action">
                    <PasteURLModal
                        inputURL={this.props.inputURL}
                        handleInputURL={this.props.handleInputURL}
                        searchTerm={this.props.searchTerm}
                    />
                </Menu.Item>

                {this.props.searchTerm && (
                    <Menu.Item name="current-search">
                        <ShareMapButton />
                    </Menu.Item>
                )}

                <Menu.Item name="version" position="right">
                    <a href="https://github.com/thawsitt/react-map/releases">
                        {VERSION}
                    </a>
                </Menu.Item>
            </Menu>
        );
    }
}

export default TopMenuBar;
