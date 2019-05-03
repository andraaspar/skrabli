import { get } from 'illa/FunctionUtil'
import * as React from 'react'
import { connect } from 'react-redux'
import { collectTiles, setJokerLetter, setMode } from '../action/actions'
import { doneThunk } from '../action/doneThunk'
import { newGameThunk } from '../action/newGameThunk'
import { skipThunk } from '../action/skipThunk'
import { IAppState } from '../model/AppState'
import { TBag } from '../model/Bag'
import { TBoard } from '../model/Board'
import { THand } from '../model/Hands'
import { Mode } from '../model/Mode'
import { MoveError } from '../model/MoveError'
import letters from '../res/letters.json'
import { selectHand } from '../select/selectHand'
import { selectMoveErrors } from '../select/selectMoveErrors'
import { selectMoveScore } from '../select/selectMoveScore'
import { selectBag, selectBoard } from '../select/simpleSelectors'
import { DispatchProp } from './DispatchProp'
import './PlaceTileButtonsComp.css'

interface PlaceTileButtonsCompPropsFromStore {
	board: TBoard
	fieldIndex: number | null
	bag: TBag
	moveScore: number
	moveErrors: MoveError[]
	hand: THand | null
}
export interface PlaceTileButtonsCompProps
	extends PlaceTileButtonsCompPropsFromStore,
		DispatchProp {}

export const PlaceTileButtonsComp = connect(
	(state: IAppState): PlaceTileButtonsCompPropsFromStore => ({
		bag: selectBag(state),
		board: selectBoard(state),
		fieldIndex: state.fieldIndex,
		moveScore: selectMoveScore(state),
		moveErrors: selectMoveErrors(state),
		hand: selectHand(state),
	}),
)(
	({
		board,
		fieldIndex,
		bag,
		moveScore,
		moveErrors,
		hand,
		dispatch,
	}: PlaceTileButtonsCompProps) => {
		return (
			<div className='buttons'>
				<button
					disabled={moveErrors.length > 0}
					onClick={e => {
						dispatch(doneThunk())
					}}
				>
					{`Oké`}
					{moveScore > 0 && (
						<>
							{`: `}
							<small>
								{moveScore}
								{` `}
								{`pont`}
							</small>
						</>
					)}
				</button>
				<button
					onClick={e => {
						dispatch(collectTiles())
					}}
				>
					{`Szedd össze`}
				</button>
				<button
					disabled={bag.length < 7}
					onClick={e => {
						dispatch(collectTiles())
						dispatch(setMode(Mode.ReplaceTiles))
					}}
				>
					{`Csere`}
				</button>
				<button
					onClick={e => {
						if (window.confirm(`Biztos hogy nem teszel semmit?`)) {
							dispatch(skipThunk())
						}
					}}
				>
					{`Kihagyom`}
				</button>
				<button
					onClick={e => {
						if (
							window.confirm(
								`Biztos hogy új játékot akarsz kezdeni?`,
							)
						) {
							dispatch(newGameThunk())
						}
					}}
				>
					{`Új játék`}
				</button>
				{/* {fieldIndex != null && hand != null && (
					<button
						onClick={e => {
							alert(
								getPotentialWordsInLine(
									getRowLine(board, fieldIndex),
									hand,
								).concat(
									getPotentialWordsInLine(
										getColumnLine(board, fieldIndex),
										hand,
									),
								),
							)
						}}
					>
						{`Tipp`}
					</button>
				)} */}
				{get(() => board[fieldIndex!].tile!.isJoker) && (
					<select
						value={board[fieldIndex!].tile!.letter}
						onChange={e => {
							dispatch(setJokerLetter({ letter: e.target.value }))
						}}
					>
						{letters.map((letter, index) => (
							<option key={index}>{letter.letter}</option>
						))}
					</select>
				)}
			</div>
		)
	},
)
