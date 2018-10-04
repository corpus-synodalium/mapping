import React, { Component } from 'react';
import {
  Map as LeafletMap,
  TileLayer,
  GeoJSON,
  ScaleControl,
} from 'react-leaflet';
import {
  Button,
  Card,
  Dropdown,
  Header,
  Icon,
  Label,
  Modal,
  Table,
} from 'semantic-ui-react';
import mapConfig from '../assets/map_config';
import s2d from '../assets/s2d.json';
import dioceseInfo from '../assets/diocese_info.json';
import './Map.css';

//=================
// Mapbox base map
//=================

class BaseMap extends React.Component {
  render() {
    const { tileLayer } = this.props.config;
    return (
      <TileLayer
        attribution={tileLayer.params.attribution}
        url={tileLayer.uri}
        id={tileLayer.params.id}
        accessToken={tileLayer.params.accessToken}
        maxZoom={tileLayer.params.maxZoom}
      />
    );
  }
}

//================
// Geo JSON layer
//================

class GeoJSONLayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      geojson: null,
      isLoading: true,
    };
    this.geojsonRef = React.createRef();
    this.shapeToDiocese = s2d.map;
    this.onEachFeature = this.onEachFeature.bind(this);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.showSearchResultsModal = this.showSearchResultsModal.bind(this);
    this.style = this.style.bind(this);
    this.getDioceseData = this.getDioceseData.bind(this);
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_GEOJSON_URL)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          geojson: data,
          isLoading: false,
        });
      });
  }

  getColor(shpfid) {
    const { colorSchemes } = this.props.config;
    const { currentColorScheme } = this.props;
    const colors = colorSchemes[currentColorScheme];
    const { mappingData } = this.props;

    if (mappingData) {
      const dioceseID = this.shapeToDiocese[shpfid];
      const maxNumEntries = this.props.maxNumEntries;
      const numPerBucket = Math.ceil(maxNumEntries / colors.length);
      if (mappingData.hasOwnProperty(dioceseID)) {
        const numEntries = mappingData[dioceseID].length;
        let index = Math.floor((numEntries - 1) / numPerBucket);
        if (index > colors.length - 1) {
          index = colors.length - 1;
        }
        return colors[index];
      }
    }
    return '#fff';
  }

  style(feature) {
    return {
      fillColor: this.getColor(feature.properties.SHPFID),
      weight: 1,
      opacity: 3,
      color: 'grey',
      dashArray: '3',
      fillOpacity: 1.0,
    };
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.showSearchResultsModal,
    });
  }

  getDioceseData(layer) {
    const { SHPFID: shpfid } = layer.feature.properties;
    const { mappingData } = this.props;
    const info = {};
    if (this.shapeToDiocese.hasOwnProperty(shpfid)) {
      const dioceseID = this.shapeToDiocese[shpfid];
      if (dioceseInfo.hasOwnProperty(dioceseID)) {
        const {
          diocese_name,
          diocese_alt,
          province,
          country_modern,
        } = dioceseInfo[dioceseID];
        const diocese = diocese_alt
          ? `${diocese_name} (${diocese_alt})`
          : diocese_name;
        info.diocese = diocese;
        info.province = province;
        info.country = country_modern;
      }

      if (mappingData && mappingData.hasOwnProperty(dioceseID)) {
        info.hasMappingData = true;
        info.searchData = mappingData[dioceseID];
        info.query = mappingData.searchTerm;
      }
    }
    return info;
  }

  highlightFeature(e) {
    var layer = e.target;
    const info = this.getDioceseData(layer);
    this.props.updateInfo(info);

    layer.setStyle({
      weight: 2,
      color: 'black',
      dashArray: '',
      fillOpacity: 1.0,
    });

    layer.bringToFront();
  }

  resetHighlight(e) {
    const { leafletElement } = this.geojsonRef.current;
    leafletElement.resetStyle(e.target);
    this.props.updateInfo(null);
  }

  showSearchResultsModal(e) {
    var layer = e.target;
    const info = this.getDioceseData(layer);
    if (info.hasMappingData) {
      this.props.showModal(info);
    }
  }

  render() {
    if (this.state.isLoading) {
      return <span />;
    }
    return (
      <GeoJSON
        data={this.state.geojson}
        style={this.style}
        onEachFeature={this.onEachFeature}
        ref={this.geojsonRef}
      />
    );
  }
}

//======================
// Search Results Modal
//======================

class SearchResultsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: new Array(1000).fill(false),
    };
  }
  toggleMetadataTable = (index) => {
    const newState = [...this.state.show];
    newState[index] = !newState[index];
    this.setState({
      show: newState,
    });
  };
  render() {
    const { searchResults } = this.props;
    const headerText = searchResults ? (
      <span>
        {searchResults.diocese}
        <Label circular color="blue">
          {searchResults.searchData.length}
        </Label>
      </span>
    ) : (
      ''
    );
    let modalContent = null;
    if (searchResults && searchResults.searchData) {
      const baseURL =
        'https://corpus-synodalium.com/philologic/corpus/query?report=concordance&method=proxy&start=0&end=0';
      modalContent = searchResults.searchData.map(
        ({ context, metadata }, index) => {
          const url = `${baseURL}&q=${searchResults.query}&record_id=%22${
            metadata.record_id
          }%22`;
          const metadataTable = Object.keys(metadata).map((item, i) => (
            <Table.Row key={item}>
              <Table.Cell>{item}</Table.Cell>
              <Table.Cell>{metadata[item]}</Table.Cell>
            </Table.Row>
          ));
          const { origPlace, year, head } = metadata;
          const label = `${index + 1}. ${origPlace} (${year}) - ${head}`;
          return (
            <div className="search-fragment-card" key={context}>
              <Card fluid>
                <Label className="search-fragment-header" attached="top">
                  {label}
                </Label>
                <Card.Content>
                  <div
                    className="search-fragment-div"
                    dangerouslySetInnerHTML={{
                      __html: `<div>... ${context} ...</div>`,
                    }}
                  />
                  <Button icon labelPosition="left" href={url} target="_blank">
                    <Icon name="search" />
                    Show Record in PhiloLogic
                  </Button>
                  <Button
                    icon
                    labelPosition="left"
                    onClick={() => this.toggleMetadataTable(index)}
                  >
                    <Icon name="file alternate outline" />
                    Show Metadata
                  </Button>
                  {this.state.show[index] && (
                    <Table basic celled striped>
                      <Table.Body>{metadataTable}</Table.Body>
                    </Table>
                  )}
                </Card.Content>
              </Card>
            </div>
          );
        },
      );
    }
    return (
      <Modal
        open={this.props.modalOpen}
        onClose={this.props.closeModal}
        size="large"
      >
        <Header icon="map marker alternate" content={headerText} />
        <Modal.Content>{modalContent}</Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={this.props.closeModal}>
            <Icon name="checkmark" /> OK
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

//===============
// Control Panel
//===============

class ControlPanel extends React.Component {
  render() {
    const colorSchemeOptions = [
      {
        text: 'Black & White',
        value: 'bw',
      },
      {
        text: 'Colors #1',
        value: 'color1',
      },
      {
        text: 'Colors #2',
        value: 'color2',
      },
      {
        text: 'Colors #3',
        value: 'color3',
      },
      {
        text: 'Colors #4',
        value: 'color4',
      },
    ];
    return (
      <Card className="panel">
        <Card.Content>
          <h4>
            <Icon name="setting" /> Control Panel
          </h4>
          <Dropdown
            placeholder="color scheme"
            options={colorSchemeOptions}
            onChange={(e, data) => this.props.changeColorScheme(data.value)}
            selection
            fluid
          />
        </Card.Content>
      </Card>
    );
  }
}

//============
// Info Panel
//============

class InfoPanel extends React.Component {
  render() {
    const { info } = this.props;
    const diocese = info ? info.diocese : 'Hover over a region';

    // Province and Modern country
    const attributes = ['province', 'country'];
    const title = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const provinceCountry = [];
    if (info) {
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        if (info.hasOwnProperty(attr)) {
          provinceCountry.push(
            <li key={attr}>
              {title(attr)}: {info[attr]}
            </li>,
          );
        }
      }
    }

    return (
      <Card className="panel panel-info">
        <Card.Content>
          <h4>{diocese}</h4>
          {info && <ul className="panel-list">{provinceCountry}</ul>}
          {info &&
            info.searchData && (
              <div>Total hits: ({info.searchData.length})</div>
            )}
        </Card.Content>
      </Card>
    );
  }
}

//===============
// Color Legend
//===============

class ColorLegend extends React.Component {
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
      </React.Fragment>,
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
        </React.Fragment>,
      );
    }

    return (
      <Card className="panel-left panel-legend">
        <Card.Content>{colorBlocks}</Card.Content>
      </Card>
    );
  }
}

//====================
// Main map component
//====================

class LocalLegislationMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: mapConfig,
      currentColorScheme: 'color1',
      info: null,
      modalOpen: false,
      searchResults: null,
    };
    this.mapRef = React.createRef();
    this.changeColorScheme = this.changeColorScheme.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  showModal(searchResults) {
    this.setState({
      searchResults: searchResults,
      modalOpen: true,
    });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  changeColorScheme(colorScheme) {
    this.setState({
      currentColorScheme: colorScheme,
    });
  }

  updateInfo(info) {
    this.setState({
      info: info,
    });
  }

  getMaxNumEntries = () => {
    const { mappingData } = this.props;
    let maxNumEntries = 0;
    for (const prop in mappingData) {
      if (mappingData.hasOwnProperty(prop)) {
        const numEntries = mappingData[prop].length;
        if (numEntries > maxNumEntries) {
          maxNumEntries = numEntries;
        }
      }
    }
    return maxNumEntries;
  };

  render() {
    const config = this.state.config;
    const maxNumEntries = this.getMaxNumEntries();
    return (
      <div>
        <InfoPanel info={this.state.info} />
        <ControlPanel changeColorScheme={this.changeColorScheme} />
        <ColorLegend
          mappingData={this.props.mappingData}
          config={config}
          maxNumEntries={maxNumEntries}
          currentColorScheme={this.state.currentColorScheme}
        />
        <SearchResultsModal
          modalOpen={this.state.modalOpen}
          closeModal={this.closeModal}
          searchResults={this.state.searchResults}
        />
        <LeafletMap
          id="mapid"
          ref={this.mapRef}
          center={config.params.center}
          zoom={config.params.zoom}
          minZoom={config.params.minZoom}
          maxZoom={config.params.maxZoom}
        >
          <ScaleControl />
          <BaseMap config={config} />
          <GeoJSONLayer
            config={config}
            mapRef={this.mapRef}
            updateInfo={this.updateInfo}
            currentColorScheme={this.state.currentColorScheme}
            mappingData={this.props.mappingData}
            maxNumEntries={maxNumEntries}
            showModal={this.showModal}
          />
        </LeafletMap>
      </div>
    );
  }
}

export default LocalLegislationMap;
