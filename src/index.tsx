import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from 'redux-starter-kit'
import { AppComp } from './comp/AppComp'
import './index.css'
import { stateReducer } from './model/State'
import * as serviceWorker from './serviceWorker'

export const store = configureStore({
	reducer: stateReducer,
})

ReactDOM.render(
	<Provider store={store}>
		<AppComp />
	</Provider>,
	document.getElementById('root'),
)

serviceWorker.register()
