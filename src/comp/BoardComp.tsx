import { get } from 'illa/FunctionUtil'
import { isUndefinedOrNull } from 'illa/Type'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { TState } from '../index'
import { selectField, swapHandAndBoard, swapTiles } from '../model/actions'
import { TBoard } from '../model/Board'
import { FieldKind } from '../model/FieldKind'
import { THands } from '../model/Hands'
import { Mode } from '../model/Mode'
import { isFieldIndexOwned } from '../select/isFieldIndexOwned'
import { selectBoard, selectHands, selectMode } from '../select/simpleSelectors'
import { AspectComp } from './AspectComp'
import './BoardComp.css'
import { TileComp } from './TileComp'

interface BoardCompPropsFromState {
	mode: Mode
	hands: THands
	playerIndex: number | null
	handIndex: number | null
	fieldIndex: number | null
	board: TBoard
}
export interface BoardCompProps extends BoardCompPropsFromState, DispatchProp {}

export const BoardComp = connect(
	(state: TState): BoardCompPropsFromState => ({
		mode: selectMode(state),
		board: selectBoard(state),
		playerIndex: state.app.playerIndex,
		fieldIndex: state.app.fieldIndex,
		handIndex: state.app.handIndex,
		hands: selectHands(state),
	}),
	dispatch => ({ dispatch }),
)(
	({
		mode,
		hands,
		playerIndex,
		handIndex,
		fieldIndex,
		board,
		dispatch,
	}: BoardCompProps) => {
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
								if (mode !== Mode.PlaceTile) return
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
										dispatch(
											swapHandAndBoard({
												handIndex: handIndex!,
												fieldIndex: aFieldIndex,
											}),
										)
									} else {
										if (aFieldIndex === fieldIndex) {
											dispatch(
												selectField({
													fieldIndex: null,
												}),
											)
										} else {
											if (
												isUndefinedOrNull(fieldIndex) ||
												(!get(
													() =>
														oldField!.tile!.isOwned,
												) &&
													!get(
														() =>
															field.tile!.isOwned,
													))
											) {
												dispatch(
													selectField({
														fieldIndex: field.tile
															? aFieldIndex
															: null,
													}),
												)
											} else {
												dispatch(
													swapTiles({
														fieldIndexA: fieldIndex,
														fieldIndexB: aFieldIndex,
													}),
												)
											}
										}
									}
								} else {
									dispatch(selectField({ fieldIndex: null }))
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
	},
)

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
