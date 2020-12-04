import React, { Component } from 'react';
import {
    Button,
    Card,
    Header,
    Icon,
    Label,
    Modal,
    Table,
} from 'semantic-ui-react';
import { METADATA_FIELDS } from '../utils/constants/metadata-fields';

class RecordsModal extends Component {
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

    handleClose = () => {
        this.setState({
            show: new Array(1000).fill(false),
        });
        this.props.closeRecordsModal();
    };

    render() {
        const { searchResults } = this.props;
        return (
            <Modal
                open={this.props.recordsModalOpen}
                onClose={this.handleClose}
                size="large"
            >
                <Header>
                    <Title searchResults={searchResults} />
                </Header>
                <Modal.Content>
                    <CardList
                        searchResults={searchResults}
                        toggleMetadataTable={this.toggleMetadataTable}
                        showTable={this.state.show}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button color="blue" onClick={this.handleClose}>
                        <Icon name="checkmark" /> OK
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

const Title = ({ searchResults }) => {
    return searchResults ? (
        <span>
            <Icon name="map marker alternate" />
            {searchResults.title}
            <Label circular color="blue">
                {searchResults.searchData.length}
            </Label>
        </span>
    ) : (
        ''
    );
};

const MetadataTable = ({ metadata }) => {
    return METADATA_FIELDS.map(({ id, label }, i) => {
        // skip empty fields
        if (!metadata[id]) {
            return <Table.Row key={id} />;
        }
        return (
            <Table.Row key={id}>
                <Table.Cell>{label}</Table.Cell>
                <Table.Cell>{metadata[id]}</Table.Cell>
            </Table.Row>
        );
    });
};

// prettier-ignore
const CardList = ({ searchResults, toggleMetadataTable, showTable }) => {
  if (!searchResults || !searchResults.searchData) {
    return <div />;
  }
  const baseURL = 'https://corpus-synodalium.com/philologic/corpus/query?report=concordance&method=proxy&start=0&end=0';
  return searchResults.searchData.map(({ context, metadata }, index) => {
    const url = `${baseURL}&q=${searchResults.query}&record_id=%22${metadata.record_id}%22`;
    const { origPlace, year, head } = metadata;
    const label = `${index + 1}. ${origPlace} (${year}) - ${head}`;
    return <SingleCard
      key={index}
      index={index}
      context={context}
      url={url}
      label={label}
      showTable={showTable}
      metadataTable={(<MetadataTable metadata={metadata}/>)}
      toggleMetadataTable={toggleMetadataTable}
    />;
  });
};

const SingleCard = (props) => (
    <div className="search-fragment-card">
        <Card fluid>
            <Label className="search-fragment-header" attached="top">
                {props.label}
            </Label>
            <Card.Content>
                <div
                    className="search-fragment-div"
                    dangerouslySetInnerHTML={{
                        __html: `<div>... ${props.context} ...</div>`,
                    }}
                />
                <Button
                    icon
                    labelPosition="left"
                    href={props.url}
                    target="_blank"
                >
                    <Icon name="search" />
                    Show Record in PhiloLogic
                </Button>
                <Button
                    icon
                    labelPosition="left"
                    onClick={() => props.toggleMetadataTable(props.index)}
                >
                    <Icon name="file alternate outline" />
                    Show Metadata
                </Button>
                {props.showTable[props.index] && (
                    <Table basic celled striped>
                        <Table.Body>{props.metadataTable}</Table.Body>
                    </Table>
                )}
            </Card.Content>
        </Card>
    </div>
);

export default RecordsModal;
