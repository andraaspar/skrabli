import * as React from 'react'
import { useContext } from 'react'
import './BagComp.css'
import { StateContext } from './ContextProvider'

export function BagComp() {
	const c = useContext(StateContext)
	return <div className='bag'>{`Lapkák a zsákban: ${c.bag.length}`}</div>
}
