import * as React from 'react'
import { useContext } from 'react'
import { getValidAndInvalidWords } from '../select/getValidAndInvalidWords'
import { getWordScore } from '../select/getWordScore'
import { getWordString } from '../select/getWordString'
import { validateMove } from '../select/validateMove'
import { MoveError } from '../model/MoveError'
import { StateContext } from './ContextProvider'
import './WordInfoComp.css'

export function WordInfoComp() {
	const { board } = useContext(StateContext)
	const { valid, invalid } = getValidAndInvalidWords(board)
	const errors = validateMove(board)
	return (
		<div className='word-info'>
			{valid.length > 0 && (
				<div>
					{`Érvényes szavak:`}
					{` `}
					{valid.map((word, index) => {
						const wordString = getWordString(word)
						return (
							<React.Fragment key={index}>
								{index > 0 && <>{`, `}</>}
								<a
									className='valid-word'
									href={`http://ertelmezo.oszk.hu/kereses.php?csakcimben=on&kereses=${encodeURIComponent(
										`"${wordString}"`,
									)}`}
									target='_blank'
								>
									{wordString.replace(' ', ' ')}
								</a>
								{` `}
								<span className='word-score'>
									{getWordScore(word)}
									{` `}
									{`pont`}
								</span>
							</React.Fragment>
						)
					})}
				</div>
			)}
			{invalid.length > 0 && (
				<div>
					{`Érvénytelen szavak:`}
					{` `}
					{invalid.map((word, index) => {
						const wordString = getWordString(word)
						return (
							<React.Fragment key={index}>
								{index > 0 && <>{`, `}</>}
								<a
									className='invalid-word'
									href={`http://ertelmezo.oszk.hu/kereses.php?csakcimben=on&kereses=${encodeURIComponent(
										`"${wordString}"`,
									)}`}
									target='_blank'
								>
									{wordString.replace(' ', ' ')}
								</a>
							</React.Fragment>
						)
					})}
				</div>
			)}
			{errors.size > 0 && (
				<div>
					{Array.from(errors)
						.map(e => {
							switch (e) {
								case MoveError.InvalidWord:
									return `Van egy érvénytelen szavad!`
								case MoveError.NoConnection:
									return `Kapcsolódnod kell a meglévő lapkákhoz!`
								case MoveError.NoDirection:
									return `Egy vonalba tedd a lapkáid, hézag nélkül!`
								case MoveError.NoStart:
									return `Érintened kell a Start mezőt!`
								case MoveError.NoTile:
									return `Tégy le egy lapkát!`
								case MoveError.OneTile:
									return `Egy érvényes szóhoz legalább két lapka kell!`
								default:
									return `[ppy6tx]: ${e}`
							}
						})
						.map((e, index) => (
							<div key={index}>{e}</div>
						))}
				</div>
			)}
		</div>
	)
}
