import * as React from 'react'
import { connect } from 'react-redux'
import { selectFieldThunk } from '../action/selectFieldThunk'
import { TState } from '../index'
import { TBoard } from '../model/Board'
import { FieldKind } from '../model/FieldKind'
import { selectBoardFromState } from '../select/simpleSelectors'
import { AspectComp } from './AspectComp'
import './BoardComp.css'
import { DispatchProp } from './DispatchProp'
import { TileComp } from './TileComp'

interface BoardCompPropsFromState {
	fieldIndex: number | null
	board: TBoard
}
export interface BoardCompProps extends BoardCompPropsFromState, DispatchProp {}

export const BoardComp = connect(
	(state: TState): BoardCompPropsFromState => ({
		board: selectBoardFromState(state),
		fieldIndex: state.app.fieldIndex,
	}),
)(({ fieldIndex, board, dispatch }: BoardCompProps) => {
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
							dispatch(selectFieldThunk(aFieldIndex))
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
})

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
