import { get } from 'illa/FunctionUtil'
import * as React from 'react'
import { connect } from 'react-redux'
import { newGameThunk } from '../action/newGameThunk'
import { nextPlayerAndSaveThunk } from '../action/nextPlayerAndSaveThunk'
import {
	collectTiles,
	disownTiles,
	fillHand,
	score,
	setJokerLetter,
	setMode,
} from '../model/actions'
import { TBag } from '../model/Bag'
import { TBoard } from '../model/Board'
import { Mode } from '../model/Mode'
import { MoveError } from '../model/MoveError'
import { IState } from '../model/State'
import letters from '../res/letters.json'
import { selectMoveErrorsFromState } from '../select/selectMoveErrors'
import { selectMoveScoreFromState } from '../select/selectMoveScore'
import {
	selectBagFromState,
	selectBoardFromState,
} from '../select/simpleSelectors'
import { DispatchProp } from './DispatchProp'
import './PlaceTileButtonsComp.css'

interface PlaceTileButtonsCompPropsFromStore {
	board: TBoard
	fieldIndex: number | null
	bag: TBag
	moveScore: number
	moveErrors: MoveError[]
}
export interface PlaceTileButtonsCompProps
	extends PlaceTileButtonsCompPropsFromStore,
		DispatchProp {}

export const PlaceTileButtonsComp = connect(
	(state: IState): PlaceTileButtonsCompPropsFromStore => ({
		bag: selectBagFromState(state),
		board: selectBoardFromState(state),
		fieldIndex: state.app.fieldIndex,
		moveScore: selectMoveScoreFromState(state),
		moveErrors: selectMoveErrorsFromState(state),
	}),
)(
	({
		board,
		fieldIndex,
		bag,
		moveScore,
		moveErrors,
		dispatch,
	}: PlaceTileButtonsCompProps) => {
		return (
			<div className='buttons'>
				<button
					disabled={moveErrors.length > 0}
					onClick={e => {
						dispatch(score())
						dispatch(disownTiles())
						dispatch(fillHand())
						dispatch(nextPlayerAndSaveThunk())
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
						if (confirm(`Biztos hogy nem teszel semmit?`)) {
							dispatch(collectTiles())
							dispatch(nextPlayerAndSaveThunk())
						}
					}}
				>
					{`Kihagyom`}
				</button>
				<button
					onClick={e => {
						if (confirm(`Biztos hogy új játékot akarsz kezdeni?`)) {
							dispatch(newGameThunk())
						}
					}}
				>
					{`Új játék`}
				</button>
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
