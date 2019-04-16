import { IField } from './Field'
export interface IValidAndInvalidWords {
	readonly valid: ReadonlyArray<ReadonlyArray<IField>>
	readonly invalid: ReadonlyArray<ReadonlyArray<IField>>
}
