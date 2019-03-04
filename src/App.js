import React, { Component } from 'react';
import queryString from 'query-string';
import axios from 'axios';
import './App.css';
import TopMenuBar from './components/TopMenuBar';
import Map from './components/Map';

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
