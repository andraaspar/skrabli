import * as React from 'react'
import { ITile } from '../model/Tile'
import { AspectComp } from './AspectComp'
import './TileComp.css'

export function TileComp({
	tile,
	neverOwned,
}: {
	tile: ITile
	neverOwned?: boolean
}) {
	return (
		<AspectComp width={1} height={1}>
			<div
				className={[
					'tile',
					!neverOwned && tile.isOwned && 'is-owned',
					tile.isJoker && 'is-joker',
				]
					.filter(Boolean)
					.join(' ')}
			>
				<div className='tile-letter'>{tile.letter}</div>
				<div className='tile-score'>{tile.score}</div>
			</div>
		</AspectComp>
	)
}
