import { AddWordContext } from '../model/AddWordContext'
import { ThunkValue } from './ThunkValue'

export function addWordRequestThunk(
	context: AddWordContext,
	word: string,
): ThunkValue {
	return (dispatch, getState) => {
		if (
			window.confirm(`Itt jelezheted nekem, hogy a kiválasztott „${word}” ${
				context === AddWordContext.Request
					? `szót szeretnéd érvényessé tenni a játékban.`
					: `szó nem szabályos.`
			}

FONTOS:
- Ha ige, csak az egyes szám harmadik személyű alakja (pl. eszik, megy, tesz) szabályos.
- Ha főnév, csak ragozatlan alakban (pl. asztal, szék, zimankó) szabályos.
- Ha melléknév, akkor csak az alapesetű alakban (pl. egész, kerek, szép) szabályos.
- Ritka szavakat csak akkor fogadok el, ha van szócikkük a Wikiszótárban vagy a Wikipédián.
- Trágárságot nem fogadok el.
- Időbe telik – napok, hetek, hónapok, ki tudja? Légy türelmes!
- Az én döntésem, hogy mit fogadok el. Légy megértő!`)
		) {
			fetch('https://prwxi9.herokuapp.com/add-word', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `context=${encodeURIComponent(
					context,
				)}&word=${encodeURIComponent(word)}`,
			})
				.then(response => response.json())
				.then((response: { result: number; error: string }) => {
					if (response.error) {
						throw response.error
					}
					window.alert(
						response.result > 0
							? `Sikerült, köszönöm a visszajelzést!`
							: `Ez a szó már rajta van a listámon, de azért köszönöm!`,
					)
				})
				.catch(e => {
					const eString = e + ''
					if (eString.startsWith('[pusoac]')) {
						switch (context) {
							case AddWordContext.Flag:
								window.alert(
									`Ezt a szót már jelezték nekem, de én elfogadhatónak tartom.`,
								)
								return
							case AddWordContext.Request:
								window.alert(
									`Ezt a szót már javasolták nekem, de én nem tartom elfogadhatónak.`,
								)
								return
							default:
						}
					}
					window.alert(eString.replace(/^Error:\s*/g, ''))
				})
		}
	}
}
