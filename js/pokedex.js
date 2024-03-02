const buttonSound = document.querySelector('.sound-button');
const pokemonCrie = document.querySelector('.pokemon-crie');
const pokemonImage = document.querySelector('.pokemon-image');
const pokemonNumber = document.querySelector('.pokemon-number');
const pokemonName = document.querySelector('.pokemon-name');
const pokemonType = document.querySelector('.pokemon-type');

const form = document.querySelector('.form');
const input = document.querySelector('.input-search');
const buttonPrev = document.querySelector('.bttn-prev');
const buttonNext = document.querySelector('.bttn-next');


let searchedPokemon;
let volume = 0.1;


const fetchPokemon = async (pokemon) => {
	const APIResponse = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${pokemon}/`
	);

	if (APIResponse.status === 200) {
		const data = await APIResponse.json();
		searchedPokemon = data.id;
		return data;
	}
};


const playCrieOnRender = (pokemon) => {
	let crie = pokemon['cries']['latest'];
	pokemonCrie.src = `${crie}`;
	pokemonCrie.volume = volume;
};

const formatNumber = (number) => {
	return number < 10
		? `000${number}`
		: `${number}` && number < 100
		? `00${number}`
		: `${number}` && number < 1000
		? `0${number}`
		: `${number}`;
};

const loadingRender = () => {
	pokemonImage.src = `./img/loading.webp`;
	pokemonType.textContent = '';
	pokemonName.textContent = `Loading...`;
	pokemonNumber.textContent = `#xxxx`;
};

const pokemonNotFounded = () => {
	pokemonImage.style.display = 'none';
	pokemonImage.src = '';
	pokemonType.textContent = 'x';
	renderData('xxxx', 'Not found');
};


const renderSprites = (pokemon) => {
	const sprite = pokemon['sprites']['front_default'];
	pokemonImage.style.display = 'block';
	pokemonImage.src = sprite;
};

const renderData = (id, name) => {
	if (id) {
		pokemonNumber.textContent = `#${id}`;
		pokemonName.textContent = `${name}`;
	}

	if (!id || id > 1025) {
		pokemonNumber.textContent = '';
		pokemonName.textContent = '';
	}
};

const renderType = async (pokemon) => {
	const data = await fetchPokemon(pokemon);
	const types = data['types'];
	const typeNames = types.map((slot) => slot['type']['name']);

	for (let type of typeNames) {
		pokemonType.innerHTML += `
    <img src="img/icons/${type}.svg" alt="pokemon type" class="pokemon-type">
    `;
	}
};

const renderPokemon = async (pokemon = 1) => {
	loadingRender();
	const data = await fetchPokemon(pokemon);

	if (data && data.id <= 1025) {
		renderSprites(data);
		renderData(formatNumber(data.id), data.species.name);
		renderType(pokemon);
		playCrieOnRender(data);
	} else {
		pokemonNotFounded();
	}
};


form.addEventListener('submit', (event) => {
	event.preventDefault();
	const inputValue = input.value.toLowerCase().trim();

	input.value = '';
	renderPokemon(inputValue);
});

buttonPrev.addEventListener('click', () => {
	if (searchedPokemon > 1) {
		searchedPokemon--;
		renderPokemon(searchedPokemon);
	}
});

buttonNext.addEventListener('click', () => {
	searchedPokemon++;
	renderPokemon(searchedPokemon);
});

buttonSound.addEventListener('click', () => {
	const status = document.querySelector('.sound-status');
	volume = !volume;
	volume ? (volume = 0.1) : volume;
	volume
		? (status.style.backgroundColor = '#9ffe58')
		: (status.style.backgroundColor = '#222');
});

renderPokemon();
