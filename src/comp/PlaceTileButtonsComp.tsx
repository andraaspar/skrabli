import { get } from 'illa/FunctionUtil'
import * as React from 'react'
import { useContext } from 'react'
import { collectTiles } from '../reduce/collectTiles'
import { disownTiles } from '../reduce/disownTiles'
import { fillHand } from '../reduce/fillHand'
import { getMoveScore } from '../select/getMoveScore'
import { nextPlayer } from '../reduce/nextPlayer'
import { score } from '../reduce/score'
import { setJokerLetter } from '../reduce/setJokerLetter'
import { setMode } from '../reduce/setMode'
import { validateMove } from '../select/validateMove'
import { Mode } from '../model/Mode'
import letters from '../res/letters.json'
import { SetStateContext, StateContext } from './ContextProvider'
import './PlaceTileButtonsComp.css'

export function PlaceTileButtonsComp() {
	const { board, fieldIndex, bag } = useContext(StateContext)
	const setState = useContext(SetStateContext)
	const moveScore = getMoveScore(board)
	return (
		<div className='buttons'>
			<button
				disabled={validateMove(board).size > 0}
				onClick={e => {
					setState(score())
					setState(disownTiles())
					setState(fillHand())
					setState(nextPlayer())
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
					setState(collectTiles())
				}}
			>
				{`Szedd össze`}
			</button>
			<button
				disabled={bag.length < 7}
				onClick={e => {
					setState(collectTiles())
					setState(setMode(Mode.ReplaceTiles))
				}}
			>
				{`Csere`}
			</button>
			<button
				onClick={e => {
					setState(collectTiles())
					setState(nextPlayer())
				}}
			>
				{`Kihagyom`}
			</button>
			{get(() => board[fieldIndex!].tile!.isJoker) && (
				<select
					value={board[fieldIndex!].tile!.letter}
					onChange={e => {
						setState(setJokerLetter(e.target.value))
					}}
				>
					{letters.map((letter, index) => (
						<option key={index}>{letter.letter}</option>
					))}
				</select>
			)}
		</div>
	)
}
