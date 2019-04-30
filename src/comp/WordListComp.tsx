import * as React from 'react'
import { getWordScore } from '../fun/getWordScore'
import { getWordString } from '../fun/getWordString'
import { IField } from '../model/Field'

export interface WordListCompProps {
	words: ReadonlyArray<ReadonlyArray<IField>>
	showScore?: boolean
	wordClassName?: string
	scoreClassName?: string
	label: React.ReactChild
}

export function WordListComp({
	words,
	showScore,
	wordClassName,
	scoreClassName,
	label,
}: WordListCompProps) {
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
								<a
									className={wordClassName}
									href={`http://ertelmezo.oszk.hu/kereses.php?csakcimben=on&kereses=${encodeURIComponent(
										`"${wordString}"`,
									)}`}
									target='_blank'
									rel='noopener noreferrer'
								>
									{wordString.replace(' ', ' ')}
								</a>
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
}
