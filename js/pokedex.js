const pokemonCries = document.querySelector(".pokemon-crie");
const pokemonSprite = document.querySelector(".pokedex-screen__sprite");
const pokemonNumber = document.querySelector(".pokemon-data__number");
const pokemonName = document.querySelector(".pokemon-data__name");
const pokemonType = document.querySelector(".pokemon-data__type");

const buttonPrev = document.querySelector(".button-prev");
const buttonNext = document.querySelector(".button-next");
const buttonSound = document.querySelector(".button-sound");

const form = document.querySelector("#form");
const pokemonSearchInput = document.querySelector("#form-input");

let searchedPokemon;
let volume = 0.1;

const fetchPokemon = async (pokemon) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);

  if (response.ok) {
    const data = await response.json();
    searchedPokemon = data.id;
    return data;
  }

  renderNotFound();
};

const getSprites = (pokemon) => {
  const sprite = pokemon.sprites.front_default;

  pokemonSprite.alt = `${pokemon.name} image`;
  pokemonSprite.style.display = "block";
  pokemonSprite.src = sprite;
};

const getType = async (pokemon) => {
  const types = pokemon.types;
  const typeNames = types.map((slot) => slot.type.name);

  for (let type of typeNames) {
    pokemonType.innerHTML += `
    <img src="img/icons/${type}.svg" alt="Pokemon Type is: ${type}" class="pokemon-type">
    `;
  }
};

const getData = (id, name) => {
  const formatID = (number) => {
    return String(number).padStart(4, "0");
  };

  pokemonNumber.textContent = `#${formatID(id)}`;
  pokemonName.textContent = `${name}`;
};

const renderPokemon = async (pokemon = 1) => {
  renderLoadingAnimation();

  const dataPokemon = await fetchPokemon(pokemon);
  const { id, species, types } = dataPokemon;

  if (dataPokemon && id <= 1025) {
    getSprites(dataPokemon);
    getData(id, species.name, types);
    getType(dataPokemon);
    playCry(dataPokemon);
  }

  pokemonSearchInput.value = "";
};

const renderLoadingAnimation = () => {
  pokemonSprite.style.display = "block";
  pokemonSprite.src = `./img/loading.webp`;
  pokemonSprite.alt = `Loading...`;

  pokemonType.textContent = "";
  pokemonName.textContent = ``;
  pokemonNumber.textContent = `#Loading...`;
};

const renderNotFound = () => {
  pokemonSprite.style.display = "none";
  pokemonSprite.src = "";
  pokemonType.textContent = "?";

  getData("????", "Not found");
};

const playCry = (pokemon) => {
  const cries = pokemon["cries"]["latest"];

  pokemonCries.src = `${cries}`;
  pokemonCries.volume = volume;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = pokemonSearchInput.value.toLowerCase().trim();

  if (inputValue === "") {
    return renderNotFound();
  }

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

buttonSound.addEventListener("click", () => {
  const status = document.querySelector(".button-sound__status");

  volume = !volume ? 0.1 : 0;
  status.style.backgroundColor = volume ? "#9ffe58" : "#222";
});

renderPokemon();
