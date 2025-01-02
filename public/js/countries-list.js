const search = document.getElementById("search");
search.addEventListener("keyup", onKeyUpSearchCountry);

async function onKeyUpSearchCountry(e) {
	if (e.target.value.length) {
		const response = await fetch(
			`/country/search?country=${e.target.value}`
		);
		const countries = await response.json();
		for (const country of countries) {
			console.log(country.label);
		}
	}
}
