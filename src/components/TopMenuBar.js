import React, { Component } from 'react';
import PasteURLModal from './PasteURLModal';
import ShareMapButton from './ShareMapButton';
import { Menu } from 'semantic-ui-react';

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
          <a href="https://github.com/thawsitt/react-map/releases">v 0.5.0</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default TopMenuBar;
