import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root.jsx'
import store from './store/configureStore'

ReactDOM.render(<Root store={store} />, document.getElementById('root'))

