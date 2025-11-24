import { ITile } from '../../model/ITile'
import { withInterface } from '../withInterface'

export function makeTile(letter: string) {
	return letter === '-'
		? null
		: withInterface<ITile>({
				letter: letter.toLowerCase(),
				score: 1,
				isOwned: letter === letter.toLowerCase() ? null : true,
				isJoker: null,
				isLast: null,
		  })
}
