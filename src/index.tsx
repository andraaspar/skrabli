import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppComp } from './comp/AppComp'
import { ContextProvider } from './comp/ContextProvider'
import './index.css'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
	<ContextProvider>
		<AppComp />
	</ContextProvider>,
	document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
