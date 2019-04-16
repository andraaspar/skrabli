import { IField } from '../model/Field'
import { isTileOwned } from './isTileOwned'
export function isFieldIndexOwned(
	board: ReadonlyArray<IField>,
	fieldIndex: number,
): boolean {
	return isTileOwned(board[fieldIndex].tile)
}
