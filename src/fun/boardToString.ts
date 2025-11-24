import type { IBoardSize } from '../model/IBoardSize'
import type { TBoard } from '../model/TBoard'

export function boardToString(board: TBoard, boardSize: IBoardSize): string {
	const tiles: string[] = []
	const fields: string[] = []
	for (let i = 0; i < boardSize.height; i++) {
		for (let j = 0; j < boardSize.width; j++) {
			const field = board[j + i * boardSize.width]!
			fields.push(field.kind)
			if (field.tile == null) {
				tiles.push('-')
			} else if (field.tile.isOwned) {
				tiles.push(field.tile.letter.toLocaleUpperCase('hu'))
			} else {
				tiles.push(field.tile.letter)
			}
		}
		tiles.push('\n')
		fields.push('\n')
	}
	return tiles.join('') + '\n\n' + fields.join('')
}
