import * as React from 'react'
import { connect } from 'react-redux'
import { getWordScore } from '../fun/getWordScore'
import { getWordString } from '../fun/getWordString'
import { IAppState } from '../model/AppState'
import { IField } from '../model/Field'
import { DispatchProp } from './DispatchProp'

export interface WordListCompPropsFromStore {}
export interface WordListCompProps
	extends WordListCompPropsFromStore,
		DispatchProp {
	words: ReadonlyArray<ReadonlyArray<IField>>
	showScore?: boolean
	wordClassName?: string
	scoreClassName?: string
	label: React.ReactNode
}

export const WordListComp = connect(
	(state: IAppState): WordListCompPropsFromStore => ({}),
)(
	({
		words,
		showScore,
		wordClassName,
		scoreClassName,
		label,
	}: WordListCompProps) => {
		return (
			<>
				{words.length > 0 && (
					<div>
						{label}
						{`: `}
						{words.map((word, index) => {
							const wordString = getWordString(word)
							return (
								<React.Fragment key={index}>
									{index > 0 && <>{`, `}</>}
									{wordString.replace(' ', ' ')}{' '}
									<small>
										(
										<a
											className={wordClassName}
											href={`http://ertelmezo.oszk.hu/kereses.php?csakcimben=on&kereses=${encodeURIComponent(
												`"${wordString}"`,
											)}`}
											target='_blank'
											rel='noopener noreferrer'
										>
											MÉK
										</a>{' '}
										<a
											className={wordClassName}
											href={`https://hu.wiktionary.org/w/index.php?search=${encodeURIComponent(
												wordString,
											)}`}
											target='_blank'
											rel='noopener noreferrer'
										>
											Wiktionary
										</a>{' '}
										<a
											className={wordClassName}
											href={`https://hu.wikipedia.org/w/index.php?search=${encodeURIComponent(
												wordString,
											)}`}
											target='_blank'
											rel='noopener noreferrer'
										>
											Wikipedia
										</a>{' '}
										<a
											className={wordClassName}
											href={`https://www.google.hu/search?q=${encodeURIComponent(
												`"${wordString}"`,
											)}`}
											target='_blank'
											rel='noopener noreferrer'
										>
											Google
										</a>
										)
									</small>
									{showScore && (
										<>
											{` `}
											<span className={scoreClassName}>
												{getWordScore(word)}
												{` `}
												{`pont`}
											</span>
										</>
									)}
								</React.Fragment>
							)
						})}
					</div>
				)}
			</>
		)
	},
)
