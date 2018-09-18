import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import axios from 'axios';
import { Button, Menu, Modal, Header, Icon, Form } from 'semantic-ui-react';

//==============
// Top Menu Bar
//==============

class TopMenuBar extends Component {
  render() {
    return (
      <Menu>
        <Menu.Item>
          <img src="/favicon.ico" alt="React Logo" />
        </Menu.Item>

        <Menu.Item name="map-action">
          <ModalQuery handleInputURL={this.props.handleInputURL} />
        </Menu.Item>

        <Menu.Item name="version" position="right">
          <a href="https://github.com/thawsitt/react-map/releases">v 0.1.0</a>
        </Menu.Item>
      </Menu>
    );
  }
}

//==========================
// Modal to paste query url
//==========================

class ModalQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      url: '',
    };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  handleChange = (event) => this.setState({ url: event.target.value });

  handleSubmit = (event) => {
    this.props.handleInputURL(this.state.url);
    this.setState({ modalOpen: false });
    this.setState({ url: '' });
  };

  render() {
    return (
      <Modal
        trigger={
          <Button primary onClick={this.handleOpen}>
            Map Search Results
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="small"
      >
        <Header icon="map marker alternate" content="Map Search Results" />
        <Modal.Content>
          <ModalDescription />
          <Form>
            <Form.Field>
              <label>"Export Results" URL</label>
              <input type="text" value={this.state.url} onChange={this.handleChange} />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={this.handleSubmit} inverted>
            <Icon name="checkmark" /> Map
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const ModalDescription = () => (
  <div className="modal-description">
    To map your search results,
    <ul>
      <li>
        Go to the{' '}
        <a href="https://rdorin.website/philologic/beta/" target="_blank" rel="noreferrer noopener">
          PhiloLogic database.
        </a>
      </li>
      <li>Make a search query.</li>
      <li>Click "Export results" button on top-right corner.</li>
      <li>Paste the resulting url below. The url should look something like this:</li>
    </ul>
    <code className="example">
      https://rdorin.website/philologic/beta/query?report=concordance&method=proxy&q=corpus&start=0&end=0&format=json
    </code>
  </div>
);

//====================
// Main App Component
//====================

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mappingData: null,
      loading: false,
    };
  }

  handleInputURL = (url) => {
    const testURL = url.replace('end=0', 'end=1');
    let query = null;
    this.setState({ loading: true });
    axios
      .get(testURL)
      .then((response) => response.data)
      .then((data) => {
        query = data.query;
        query.end = data.results_length;
        this.fetchData(query);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false });
      });
  };

  fetchData = (query) => {
    const baseURL = 'https://rdorin.website/philologic/beta/query';
    axios
      .get(baseURL, { params: query })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        this.processData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  processData = ({ results }) => {
    const dioceseMap = {};
    results.forEach((result) => {
      const metadata = result.metadata_fields;
      const { record_id, diocese_id } = metadata;
      if (diocese_id) {
        if (dioceseMap.hasOwnProperty(diocese_id)) {
          dioceseMap[diocese_id].add(record_id);
        } else {
          dioceseMap[diocese_id] = new Set([record_id]);
        }
      }
    });
    console.log(dioceseMap);
    this.setState({
      mappingData: dioceseMap,
      loading: false,
    });
  };

  render() {
    return (
      <div>
        <TopMenuBar handleInputURL={this.handleInputURL} />
        <Map mappingData={this.state.mappingData} />
        {this.state.loading && (
          <div className="center">
            <div className="loading-circle" />
          </div>
        )}
      </div>
    );
  }
}

export default App;
