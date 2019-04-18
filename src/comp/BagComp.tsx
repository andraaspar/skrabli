import * as React from 'react'
import { TBag } from '../model/Bag'
import './BagComp.css'

export function BagComp({ bag }: { bag: TBag }) {
	return <div className='bag'>{`Lapkák a zsákban: ${bag.length}`}</div>
}
