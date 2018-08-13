import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import { Menu } from 'semantic-ui-react';

//==============
// Top Menu Bar
//==============

class TopMenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home',
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
  }

  render() {
    const { activeItem } = this.state;

    return (
      <Menu>
        <Menu.Item>
          <img src="/favicon.ico" alt="React Logo" />
        </Menu.Item>

        <Menu.Item
          name="home"
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
        >
          Home
        </Menu.Item>

        <Menu.Item
          name="project"
          active={activeItem === 'project'}
          onClick={this.handleItemClick}
        >
          Project
        </Menu.Item>

        <Menu.Item
          name="about"
          active={activeItem === 'about'}
          onClick={this.handleItemClick}
        >
          About
        </Menu.Item>

        <Menu.Item name="version" position="right">
          <a href="https://github.com/thawsitt/react-map/releases">v 0.1.0</a>
        </Menu.Item>
      </Menu>
    );
  }
}

//====================
// Main App Component
//====================

class App extends Component {
  render() {
    return (
      <div>
        <TopMenuBar />
        <Map />
      </div>
    );
  }
}

export default App;
