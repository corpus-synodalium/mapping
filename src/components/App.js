import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import queryString from 'query-string';
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
          <ModalQuery
            inputURL={this.props.inputURL}
            handleInputURL={this.props.handleInputURL}
          />
        </Menu.Item>

        {this.props.searchTerm && (
          <Menu.Item name="current-search">
            Current query: "{this.props.searchTerm}"
          </Menu.Item>
        )}

        <Menu.Item name="version" position="right">
          <a href="https://github.com/thawsitt/react-map/releases">v 0.4.1</a>
        </Menu.Item>
      </Menu>
    );
  }
}

//==========================
// Modal to paste query url
//==========================

class ModalQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      url: this.props.inputURL,
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
              <input
                type="text"
                value={this.state.url}
                onChange={this.handleChange}
              />
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
        Go to the PhiloLogic database:{' '}
        <a
          href="https://corpus-synodalium.com/philologic/corpus/"
          target="_blank"
          rel="noreferrer noopener"
        >
          /corpus
        </a>{' '}
        or{' '}
        <a
          href="https://corpus-synodalium.com/philologic/corpusnorm/"
          target="_blank"
          rel="noreferrer noopener"
        >
          /corpusnorm
        </a>
      </li>
      <li>Make a search.</li>
      <li>
        Click "Map All Results" button on the top-right corner. (recommended)
      </li>
      <li>Alternatively, you can paste in the search URL below.</li>
    </ul>
  </div>
);

//====================
// Main App Component
//====================

class App extends Component {
  constructor(props) {
    super(props);
    const query = queryString.parse(window.location.search);
    this.state = {
      searchTerm: null,
      mappingData: null,
      loading: false,
      inputURL: query.url ? query.url : '',
    };
  }

  componentDidMount() {
    if (this.state.inputURL) {
      this.handleInputURL(this.state.inputURL);
    }
  }

  handleInputURL = (url) => {
    const testURL = url.replace('end=0', 'end=1').concat('&format=json');
    let query = null;
    this.setState({ loading: true });
    axios
      .get(testURL)
      .then((response) => response.data)
      .then((data) => {
        query = data.query;
        query.end = data.results_length;
        this.fetchData(query, testURL);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ loading: false, searchTerm: null });
      });
  };

  fetchData = (query, testURL) => {
    const i = testURL.indexOf('/query');
    const baseURL = testURL.substring(0, i + 6);
    axios
      .get(baseURL, { params: query })
      .then((response) => response.data)
      .then((data) => {
        //console.log(data);
        this.setState({ searchTerm: query.q });
        this.processData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  processData = ({ results }) => {
    const dioceseMap = {};
    const mappingData = {};
    mappingData.searchTerm = this.state.searchTerm;
    results.forEach((result) => {
      const { context, metadata_fields: metadata } = result;
      const { record_id, diocese_id } = metadata;
      if (diocese_id) {
        if (dioceseMap.hasOwnProperty(diocese_id)) {
          if (!dioceseMap[diocese_id].has(record_id)) {
            dioceseMap[diocese_id].add(record_id);
            mappingData[diocese_id].push({ metadata, context });
          }
        } else {
          dioceseMap[diocese_id] = new Set([record_id]);
          mappingData[diocese_id] = [{ metadata, context }];
        }
      }
    });
    //console.log(mappingData);
    this.setState({
      mappingData,
      loading: false,
    });
  };

  render() {
    return (
      <div>
        <TopMenuBar
          inputURL={this.state.inputURL}
          handleInputURL={this.handleInputURL}
          searchTerm={this.state.searchTerm}
        />
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
