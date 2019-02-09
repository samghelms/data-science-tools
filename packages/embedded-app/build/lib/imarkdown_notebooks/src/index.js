import './index.css'

import React from 'react'
import {render} from 'react-dom'

// import App from './App'
import Router from './router'

const dataEl = document.querySelector("#jupyter-config-data");
const config = JSON.parse(dataEl.textContent);

render(<Router token={config.token}/>, document.querySelector('#app'))
