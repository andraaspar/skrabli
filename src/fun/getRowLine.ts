import type { IBoardSize } from '@/model/IBoardSize'
import { type IField } from '../model/IField'

export function getRowLine(
	board: ReadonlyArray<IField>,
	boardSize: IBoardSize,
	lineIndex: number,
): IField[] {
	const firstFieldIndex = lineIndex * boardSize.width
	return board.slice(firstFieldIndex, firstFieldIndex + boardSize.width)
}
