import React, { Component } from 'react';
import { Button, Modal, Header, Icon, Form } from 'semantic-ui-react';

class PasteURLModal extends Component {
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
            {this.props.searchTerm
              ? `Current query: "${this.props.searchTerm}"`
              : 'Map Search Results'}
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="small"
      >
        <Header
          icon="map marker alternate"
          content="How to map search results from CoSyn database"
        />
        <Modal.Content>
          <Description />
          <URLInput url={this.state.url} handleChange={this.handleChange} />
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

const URLInput = ({ url, handleChange }) => (
  <Form>
    <Form.Field>
      <label>URL</label>
      <input type="text" value={url} onChange={handleChange} />
    </Form.Field>
  </Form>
);

const Description = () => (
  <div className="modal-description">
    To map your search results,
    <ul>
      <li>
        Go to the PhiloLogic database: <Corpus /> or <CorpusNorm />
      </li>
      <li>Make a search.</li>
      <li>
        Click "Map All Results" button on the top-right corner. (recommended)
      </li>
      <li>Alternatively, you can paste in the search URL below.</li>
    </ul>
  </div>
);

const Corpus = () => (
  <a
    href="https://corpus-synodalium.com/philologic/corpus/"
    target="_blank"
    rel="noreferrer noopener"
  >
    /corpus
  </a>
);

const CorpusNorm = () => (
  <a
    href="https://corpus-synodalium.com/philologic/corpusnorm/"
    target="_blank"
    rel="noreferrer noopener"
  >
    /corpusnorm
  </a>
);

export default PasteURLModal;
