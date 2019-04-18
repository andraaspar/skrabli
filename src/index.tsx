import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { configureStore } from 'redux-starter-kit'
import { AppComp } from './comp/AppComp'
import './index.css'
import { appStateReducer } from './model/AppState'
import * as serviceWorker from './serviceWorker'

export const store = configureStore({
	reducer: combineReducers({
		app: appStateReducer,
	}),
})
export type TState = ReturnType<typeof store.getState>

ReactDOM.render(
	<Provider store={store}>
		<AppComp />
	</Provider>,
	document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
