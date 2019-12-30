import React, { Component } from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class ShareMapButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMouseHovered: false,
      isURLCopied: false,
    };
  }

  onCopyToClipboardCallback = () => this.setState({ isURLCopied: true });
  onMouseEnter = (event) => this.setState({ isMouseHovered: true });
  onMouseLeave = (event) => {
    this.setState({
      isMouseHovered: false,
      isURLCopied: false,
    });
  };

  render() {
    return (
      <Popup
        content="Click to copy the current URL. You can share this map using the copied link."
        position="bottom center"
        inverted
        trigger={
          <CopyToClipboard
            text={window.location.href}
            onCopy={this.onCopyToClipboardCallback}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            <Button icon labelPosition="left">
              <Icon name="share" />
              {this.state.isMouseHovered ? (
                <span>
                  {this.state.isURLCopied
                    ? 'URL copied!'
                    : 'Copy URL to clipboard'}
                </span>
              ) : (
                'Share Map'
              )}
            </Button>
          </CopyToClipboard>
        }
      />
    );
  }
}

export default ShareMapButton;
