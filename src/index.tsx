import { configureStore } from '@reduxjs/toolkit'
import 'normalize.css'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { AppComp } from './comp/AppComp'
import './index.css'
import { appStateReducer } from './model/AppState'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

export const store = configureStore({
	reducer: appStateReducer,
})

const root = createRoot(document.getElementById('root')!)
root.render(
	<Provider store={store}>
		<AppComp />
	</Provider>,
)

serviceWorkerRegistration.register()
