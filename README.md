# cosyn.app

## About

This repo contains source files for https://cosyn.app/ which is a web-app used for mapping search results from the Corpus Synodalium [database](https://corpus-synodalium.com/philologic/corpus/).

![Imgur](https://i.imgur.com/DJBpY0r.png)

## Usage

- Click on the "Map All Results" button at the top-right corner of the [database website](https://corpus-synodalium.com/philologic/corpus/).

## Developer Notes

This project was built using [React](https://reactjs.org/) and [Leaflet](https://react-leaflet.js.org/).

Here is a list of useful libraries.

- [React JS](https://reactjs.org/): Web framework used for this app.
- [Leaflet](https://leafletjs.com/): Light-weight Javascript library for interactive maps. This project uses react-leaflet instead of the vanilla Leaflet library. (See below).
- [react-leaflet](https://react-leaflet.js.org/): React components for 🍃 Leaflet maps.
- [create-react-app](https://github.com/facebook/create-react-app): This project was set up using create-react-app.
- [Color Brewer 2](http://colorbrewer2.org): Color scheme for readable maps.
- [MapShaper.org](https://mapshaper.org/): Useful for viewing and compressing GeoJSON files.
- [geojson-precision](https://www.npmjs.com/package/geojson-precision): Command line tool to compress GeoJSON file by reducing level of precision. (e.g. `57.326` instead of `57.32652122521709`)

Here is a list of resources related to deployment.

- [Netlify](https://www.netlify.com/): This project is deployed using Netlify. Whenever a new commit is pushed to the master branch of this repo, Netlify will automatically build and deploy the new website. It's super convenient!
- [Amazon CloudFront](https://aws.amazon.com/cloudfront/): The geo-json file (2 MB) required for region boundaries is compressed and hosted on Amazon CloudFront CDN (Free tier is sufficient since it is cached heavily).
