import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-135535706-1');
ReactGA.pageview('cosyn.app homepage');
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
