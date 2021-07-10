import React, { Component, useState } from 'react';
import { Menu, Modal, Button, Header } from 'semantic-ui-react';
import PasteURLModal from './PasteURLModal';
import ShareMapButton from './ShareMapButton';

const MapGuideModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <Modal
            trigger={
                <Button primary onClick={() => setIsModalOpen(true)}>
                    Map Guide
                </Button>
            }
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            size="small"
        >
            <Header content="Map Guide" />
            <Modal.Content>
                <p>
                    Rather than corresponding to any particular year, the
                    boundaries used in this mapping tool represent an amalgam of
                    all Latin dioceses and ecclesiastical provinces that existed
                    at some point during the period 1200-1500. The map excludes
                    jurisdictions in the Latin East and in parts of eastern
                    Europe whose boundaries are unknown (or were never
                    established).
                </p>

                <p>
                    In both the “Dioceses” and “Provinces” views, the frequency
                    of search results is represented by differential shading.
                    Jurisdictions that returned null results are shown as white.
                </p>

                <p>
                    In the “Dioceses + Provinces” view, the base map depicts
                    provincial boundaries (with differential shading to
                    represent the frequency of search results), while
                    diocese-level results are represented as super-imposed
                    circles.
                </p>

                <p>
                    The regions depicted with grey horizontal stripes represent
                    ecclesiastical jurisdictions in late medieval Latin
                    Christendom for which no local ecclesiastical legislation
                    appears in the Corpus Synodalium database (either because
                    none is extant for the period in question, or because it
                    remains to be added). The grey horizontal stripes can be
                    turned off using the toggle switch in the Control Panel. The
                    outlines of the individual jurisdictions appear as dotted
                    lines as the cursor passes over them.
                </p>

                <p>
                    The boundary files were generated from 2016-2021 as part of
                    the Corpus Synodalium project (project leader: Rowan Dorin),
                    with Thawsitt Naing responsible for the development of the
                    online map tool. Boundary files and supplementary
                    documentation can be downloaded here:{' '}
                    <a
                        href="https://doi.org/10.25740/rh195hm5975"
                        target="_blank"
                    >
                        https://doi.org/10.25740/rh195hm5975
                    </a>
                    . For more details on the project as a whole, see{' '}
                    <a href="https://www.corpus-synodalium.com" target="_blank">
                        https://www.corpus-synodalium.com
                    </a>
                    .
                </p>
            </Modal.Content>
        </Modal>
    );
};
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

                <Menu.Item name="map-guide" position="right">
                    <MapGuideModal />
                </Menu.Item>
            </Menu>
        );
    }
}

export default TopMenuBar;
