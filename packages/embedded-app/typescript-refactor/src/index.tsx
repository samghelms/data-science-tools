import React from 'react';
import './index.css'
import {render} from 'react-dom';

import App from './App'
// import Router from './router';

const dataEl: any = document.querySelector("#jupyter-config-data");
const config: any = JSON.parse(dataEl.textContent);

render(<App token="" path=""/>, document.querySelector('#app'))
