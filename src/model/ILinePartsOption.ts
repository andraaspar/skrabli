import type { IWordPart } from './IWordPart'

export interface ILinePartsOption {
	option: IWordPart[]
	/**
	 * At what field index the option starts in the line.
	 */
	fieldOffset: number
}
