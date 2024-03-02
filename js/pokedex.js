const pokemonImage = document.querySelector('.pokemon-image');
const pokemonName = document.querySelector('.pokemon-name');
const pokemonType = document.querySelector('.pokemon-type');

const form = document.querySelector('.form');
const input = document.querySelector('.input-search');
const buttonPrev = document.querySelector('.bttn-prev');
const buttonNext = document.querySelector('.bttn-next');

let searchPokemon;

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon}/`
  );

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    searchPokemon = data.id;
    return data;
  }
};

const renderData = async (id, name) => {
  const pokemonNumber = document.querySelector('.pokemon-number');

  if (id) {
    pokemonNumber.innerHTML = `#${id}`;
    pokemonName.innerHTML = `${name}`;
  }

  if (!id || id > 1025) {
    pokemonNumber.innerHTML = '';
    pokemonName.innerHTML = '';
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

const renderSprites = async (pokemon) => {
  const sprite = pokemon['sprites']['front_default'];
  pokemonImage.style.display = 'block';
  pokemonImage.src = sprite;
}

const renderPokemon = async (pokemon = 1) => {
  pokemonImage.src = `./img/loading.gif`;
  pokemonType.innerHTML = '';
  pokemonName.innerHTML = `Loading...`;

  const data = await fetchPokemon(pokemon);

  if (data) {
    renderSprites(data)
    renderData(formatNumber(pokemon), data.name);
    renderType(pokemon);
    playCrieOnRender(data);

    input.value = '';
    searchPokemon = data.id;
  } else {
    pokemonImage.src = '';
    pokemonType.innerHTML = 'x';
    renderData('xxxx', 'Not found');
  }
};

const playCrieOnRender = (pokemon) => {
  const pokemonCrie = document.querySelector('.pokemon-crie');
  let crie = pokemon['cries']['latest'];

  pokemonCrie.src = `${crie}`;
  pokemonCrie.volume = 0.2;
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

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputValue = input.value.toLowerCase().trim();

  renderPokemon(inputValue);
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon--;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon++;
  renderPokemon(searchPokemon);
});

renderPokemon();
