const pokemonName = document.querySelector('.pokemon--name');
const pokemonNumber = document.querySelector('.pokemon--number');
const pokemonImage = document.querySelector('.pokemon--image');
const pokemonType = document.querySelector('.pokemon--type');
const pokemonCrie = document.querySelector('.pokemon--crie');

const form = document.querySelector('.form');
const input = document.querySelector('.input--search');
const buttonPrev = document.querySelector('.btn--prev');
const buttonNext = document.querySelector('.btn--next');
const buttonStart = document.querySelector('.btn--start');

let searchPokemon = 1;

const fetchPokemon = async pokemon => {
	const APIResponse = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${pokemon}/`
	);

	if (APIResponse.status === 200) {
		const data = await APIResponse.json();
		return data;
	}

	return;
};

const fetchTypes = async pokemon => {
	const data = await fetchPokemon(pokemon);
	const types = data['types'];
	const typeNames = types.map(slot => slot['type']['name']);

	return typeNames;
};

const playCrie = pokemon => {
	let crie = pokemon['cries']['latest'];

	pokemonCrie.volume = 0.2;
	pokemonCrie.src = `${crie}`;
};

const formatNumber = number => {
	return number < 10
		? `000${number}`
		: `${number}` && number < 100
		? `00${number}`
		: `${number}` && number < 1000
		? `0${number}`
		: `${number}`;
};

const renderPokemon = async (pokemon = 1) => {
	pokemonName.innerHTML = `Loading...`;
	pokemonType.innerHTML = '';

	const data = await fetchPokemon(pokemon);

	if (data) {
		const types = await fetchTypes(pokemon);
		const sprite = data['sprites']['front_default'];
		const number = formatNumber(data.id);

		pokemonImage.style.display = 'block';
		pokemonImage.src = sprite;
		pokemonNumber.innerHTML = `#${number}`;
		pokemonName.innerHTML = `${data.species.name}`;

		for (let i = 0; i < types.length; i++) {
			pokemonType.innerHTML += `
      <img src="img/icons/${types[i]}.svg" alt="pokemon type" class="pokemon--type">
      `;
		}

		playCrie(data);

		input.value = '';
		searchPokemon = data.id;
	} else {
		pokemonImage.style.display = 'none';
		pokemonNumber.innerHTML = '#';
		pokemonName.innerHTML = 'Not found';
		pokemonType.innerHTML = 'x';
	}
};

form.addEventListener('submit', event => {
	event.preventDefault();
	const inputValue = input.value.toLowerCase().trim();

	renderPokemon(inputValue);
});

buttonPrev.addEventListener('click', () => {
	if (searchPokemon > 1) {
		searchPokemon -= 1;
		renderPokemon(searchPokemon);
	}
});

buttonNext.addEventListener('click', () => {
	searchPokemon += 1;
	renderPokemon(searchPokemon);
});

renderPokemon(1);
