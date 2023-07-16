export type TSuggestResponse =
	| { ok: boolean }
	| { valid: boolean }
	| { alreadySuggested: boolean }
	| { alreadyRejected: boolean }
