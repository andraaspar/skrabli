import { get } from 'illa/FunctionUtil'
import { isUndefinedOrNull } from 'illa/Type'
import * as React from 'react'
import { useContext } from 'react'
import { isFieldIndexOwned } from '../select/isFieldIndexOwned'
import { swapHandAndBoard } from '../reduce/swapHandAndBoard'
import { swapTiles } from '../reduce/swapTiles'
import { FieldKind } from '../model/FieldKind'
import { Mode } from '../model/Mode'
import { AspectComp } from './AspectComp'
import './BoardComp.css'
import { SetStateContext, StateContext } from './ContextProvider'
import { TileComp } from './TileComp'

export function BoardComp() {
	const {
		mode,
		hands,
		playerIndex,
		handIndex,
		fieldIndex,
		board,
	} = useContext(StateContext)
	const setState = useContext(SetStateContext)
	return (
		<div className='board'>
			{board.map((field, aFieldIndex) => (
				<AspectComp key={aFieldIndex} width={1} height={1}>
					<div
						className={[
							'board-field',
							fieldKindToCssClass(field.kind),
							aFieldIndex === fieldIndex && 'is-selected',
						]
							.filter(Boolean)
							.join(' ')}
						onClick={e => {
							if (mode !== Mode.PlaceTile) return {}
							const handTile = get(
								() => hands[playerIndex!][handIndex!],
							)
							const oldField = get(() => board[fieldIndex!])
							const field = board[aFieldIndex]
							if (
								!field.tile ||
								isFieldIndexOwned(board, aFieldIndex)
							) {
								if (handTile) {
									setState(
										swapHandAndBoard({
											handIndex: handIndex!,
											fieldIndex: aFieldIndex,
										}),
									)
								} else {
									if (aFieldIndex === fieldIndex) {
										return { fieldIndex: null }
									} else {
										if (
											isUndefinedOrNull(fieldIndex) ||
											(!get(
												() => oldField!.tile!.isOwned,
											) &&
												!get(() => field.tile!.isOwned))
										) {
											setState(state => ({
												fieldIndex: field.tile
													? aFieldIndex
													: null,
											}))
										} else {
											setState(
												swapTiles({
													fieldIndexA: fieldIndex,
													fieldIndexB: aFieldIndex,
												}),
											)
										}
									}
								}
							} else {
								return { fieldIndex: null }
							}
						}}
					>
						{field.tile ? (
							<TileComp tile={field.tile} />
						) : (
							fieldKindToLabel(field.kind)
						)}
					</div>
				</AspectComp>
			))}
		</div>
	)
}

function fieldKindToCssClass(k: FieldKind): string {
	switch (k) {
		case FieldKind.Normal:
			return 'is-normal'
		case FieldKind.DoubleLetter:
			return 'is-double-letter'
		case FieldKind.DoubleWord:
			return 'is-double-word'
		case FieldKind.Start:
			return 'is-start'
		case FieldKind.TripleLetter:
			return 'is-triple-letter'
		case FieldKind.TripleWord:
			return 'is-triple-word'
		default:
			throw new Error(`[ppp03n]: ${k}`)
	}
}

function fieldKindToLabel(k: FieldKind): string {
	switch (k) {
		case FieldKind.Normal:
			return ' '
		case FieldKind.DoubleLetter:
			return '2×\nBetű'
		case FieldKind.DoubleWord:
			return '2×\nSzó'
		case FieldKind.Start:
			return 'Start'
		case FieldKind.TripleLetter:
			return '3×\nBetű'
		case FieldKind.TripleWord:
			return '3×\nSzó'
		default:
			throw new Error(`[ppp079]: ${k}`)
	}
}
