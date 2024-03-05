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
	const crie = pokemon['cries']['latest'];

	pokemonCrie.src = `${crie}`;
	pokemonCrie.volume = volume;
};

const formatNumberToString = (number) => {
	return String(number).padStart(4, '0')
}

const pokemonNotFounded = () => {
	pokemonImage.style.display = 'none';
	pokemonImage.src = '';
	pokemonType.textContent = 'x';

	renderData('xxxx', 'Not found');
};



const renderSprites = (pokemon) => {
	const sprite = pokemon.sprites.front_default;
  pokemonImage.alt= `${pokemon.name} image`
	pokemonImage.style.display = 'block';
	pokemonImage.src = sprite;
};

const renderData = (id, name) => {
		pokemonNumber.textContent = `#${id}`;
		pokemonName.textContent = `${name}`
};

const renderType = async (dataPokemon) => {
	const types = dataPokemon.types;
	const typeNames = types.map((slot) => slot.type.name)

	for (let type of typeNames) {
		pokemonType.innerHTML += `
    <img src="img/icons/${type}.svg" alt="Pokemon Type is: ${type}" class="pokemon-type">
    `;
	}
};

const renderLoading = () => {
	pokemonImage.style.display = 'block';
	pokemonImage.src = `./img/loading.webp`;
	pokemonImage.alt = `Loading...`;
	pokemonType.textContent = '';
	pokemonName.textContent = `Loading...`;
	pokemonNumber.textContent = `#xxxx`;
};

const renderPokemon = async (pokemon = 1) => {
	renderLoading();

	const dataPokemon = await fetchPokemon(pokemon);
  
	if (dataPokemon && dataPokemon.id <= 1025) {
    renderSprites(dataPokemon);
    
		renderData(formatNumberToString(dataPokemon.id), dataPokemon.species.name);
    
		renderType(dataPokemon);
    
		playCrieOnRender(dataPokemon);
    
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
	}

	renderPokemon(searchedPokemon);
});

buttonNext.addEventListener('click', () => {
	if (searchedPokemon < 1025) {
		searchedPokemon++;
	}

	renderPokemon(searchedPokemon);
});

buttonSound.addEventListener('click', () => {
	const status = document.querySelector('.sound-status');
  
  volume = !volume ? 0.1 : 0;
	status.style.backgroundColor = volume ? '#9ffe58' : '#222';
});


renderPokemon();
