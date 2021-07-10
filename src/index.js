import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import { unregister } from './registerServiceWorker';
import './styles/index.css';

ReactGA.initialize('UA-135535706-1');
ReactGA.pageview('cosyn.app homepage');
ReactDOM.render(<App />, document.getElementById('root'));
unregister();
