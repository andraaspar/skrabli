import { get } from 'illa/FunctionUtil'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { TState } from '../index'
import {
	collectTiles,
	disownTiles,
	fillHand,
	nextPlayer,
	score,
	setJokerLetter,
	setMode,
} from '../model/actions'
import { TBag } from '../model/Bag'
import { TBoard } from '../model/Board'
import { Mode } from '../model/Mode'
import { MoveError } from '../model/MoveError'
import letters from '../res/letters.json'
import { getMoveScoreFromState } from '../select/getMoveScore'
import { selectBag, selectBoard } from '../select/simpleSelectors'
import { validateMoveFromState } from '../select/validateMove'
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
	(state: TState): PlaceTileButtonsCompPropsFromStore => ({
		bag: selectBag(state),
		board: selectBoard(state),
		fieldIndex: state.app.fieldIndex,
		moveScore: getMoveScoreFromState(state),
		moveErrors: validateMoveFromState(state),
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
						dispatch(nextPlayer())
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
						dispatch(collectTiles())
						dispatch(nextPlayer())
					}}
				>
					{`Kihagyom`}
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
