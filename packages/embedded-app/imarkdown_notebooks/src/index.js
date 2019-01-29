import './index.css'

import React from 'react'
import {render} from 'react-dom'

import App from './App'

const dataEl = document.querySelector("#jupyter-config-data");
const config = JSON.parse(dataEl.textContent);

render(<App token={config.token}/>, document.querySelector('#app'))
