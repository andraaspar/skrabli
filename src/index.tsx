import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from 'redux-starter-kit'
import { AppComp } from './comp/AppComp'
import './index.css'
import { appStateReducer } from './model/AppState'
import * as serviceWorker from './serviceWorker'

export const store = configureStore({
	reducer: {
		app: appStateReducer,
	},
})

ReactDOM.render(
	<Provider store={store}>
		<AppComp />
	</Provider>,
	document.getElementById('root'),
)

serviceWorker.register()
