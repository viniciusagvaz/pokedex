const pokemonImage = document.querySelector(".pokedex-screen__sprite");

const pokemonCries = document.querySelector(".pokemon-crie");
const pokemonNumber = document.querySelector(".pokemon-data__number");
const pokemonName = document.querySelector(".pokemon-data__name");
const pokemonType = document.querySelector(".pokemon-data__type");

const buttonSound = document.querySelector(".sound-button");

const form = document.querySelector("#form");
const input = document.querySelector("#form-input");

const buttonPrev = document.querySelector(".button-prev");
const buttonNext = document.querySelector(".button-next");
const buttonSearch = document.querySelector(".button-search");

let searchedPokemon;
let volume = 0.1;

const fetchPokemon = async (pokemon) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);

  if (response.status === 200) {
    const data = await response.json();
    searchedPokemon = data.id;
    return data;
  }

  notFound();
};

const notFound = () => {
  pokemonImage.style.display = "none";
  pokemonImage.src = "";

  renderData("xxxx", "Not found");
};

const playCries = (pokemon) => {
  const cries = pokemon["cries"]["latest"];

  pokemonCries.src = `${cries}`;
  pokemonCries.volume = volume;
};

const renderSprites = (pokemon) => {
  const sprite = pokemon.sprites.front_default;

  pokemonImage.alt = `${pokemon.name} image`;
  pokemonImage.style.display = "block";
  pokemonImage.src = sprite;
};

const renderType = async (dataPokemon) => {
  const types = dataPokemon.types;
  const typeNames = types.map((slot) => slot.type.name);

  for (let type of typeNames) {
    pokemonType.innerHTML += `
    <img src="img/icons/${type}.svg" alt="Pokemon Type is: ${type}" class="pokemon-type">
    `;
  }
};

const renderData = (id, name, type) => {
  const formatID = (number) => {
    return String(number).padStart(4, "0");
  };

  pokemonNumber.textContent = `#${formatID(id)}`;
  pokemonName.textContent = `${name}`;
};

const renderLoading = () => {
  pokemonImage.style.display = "block";
  pokemonImage.src = `./img/loading.webp`;
  pokemonImage.alt = `Loading...`;

  pokemonType.textContent = "";
  pokemonName.textContent = `Loading...`;
  pokemonNumber.textContent = `#xxxx`;
};

const renderPokemon = async (pokemon = 1) => {
  renderLoading();

  const dataPokemon = await fetchPokemon(pokemon);
  const id = dataPokemon.id;
  const name = dataPokemon.species.name;
  const types = dataPokemon.types;

  if (dataPokemon && id <= 1025) {
    renderSprites(dataPokemon);
    renderData(id, name, types);
    renderType(dataPokemon);
    playCries(dataPokemon);
  }

  input.value = "";
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = input.value.toLowerCase().trim();

  renderPokemon(inputValue);
});



buttonPrev.addEventListener("click", () => {
  if (searchedPokemon > 1) {
    searchedPokemon--;
  }

  renderPokemon(searchedPokemon);
});

buttonNext.addEventListener("click", () => {
  if (searchedPokemon < 1025) {
    searchedPokemon++;
  }

  renderPokemon(searchedPokemon);
});


buttonSearch.addEventListener("click", () => {
  if (searchedPokemon === searchedPokemon.id) {
    
    
    renderPokemon(searchedPokemon.id);
  }
})

buttonSound.addEventListener("click", () => {
  volume = !volume ? 0.1 : 0;
  status.style.backgroundColor = volume ? "#9ffe58" : "#222";
});



renderPokemon();
