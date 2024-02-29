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
let on;

const fetchPokemon = async pokemon => {
  const APIResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon}`
  );

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }

  return
};

const typeIcon = async pokemon => {
  const data = await fetchPokemon(pokemon);
  const iconsList = await fetch('./js/datatype.js');

  const types = data['types'];
  let typeNames = types.map(slot => slot['type']['name']);

  return typeNames
}

const renderPokemon = async pokemon => {
  pokemonName.innerHTML = `Loading...`;
  const data = await fetchPokemon(pokemon);
  pokemonType.innerHTML = '';

    if (data) {
      let types = await typeIcon(pokemon);
      pokemonImage.style.display = 'block';
      pokemonName.innerHTML = data.name;
      pokemonNumber.innerHTML = ` #${data.id}`;
      pokemonImage.src =
        data['sprites']['versions']['generation-v']['black-white']['animated'][
        'front_default'
        ];
      pokemonCry(data)

      for (let i = 0; i < types.length; i++) {
        pokemonType.innerHTML += `<img src="img/icons/${types[i]}.svg" alt="pokemon type" class="pokemon--type">`
      }

      input.value = '';
      searchPokemon = data.id;
    } else {
      pokemonImage.style.display = 'none';
      pokemonNumber.innerHTML = '';
      pokemonType.innerHTML = '';
      pokemonName.innerHTML = 'Not found';
    }
  }


const pokemonCry = (pokemon) => {
  let crie = pokemon['cries']['legacy']

  pokemonCrie.volume = 0.1
  pokemonCrie.src = `${crie}`
}

const loadingPokemon = (pokemon) => {
  pokemonImage.style.display = 'none';
  pokemonNumber.innerHTML = '';
  pokemonType.innerHTML = '';

  setTimeout(() => {
    renderPokemon(input.value.toLowerCase());
    pokemonType.innerHTML = ''
  }, 2000)
}

form.addEventListener('submit', event => {
  event.preventDefault();
  loadingPokemon()
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    renderPokemon(searchPokemon);
    pokemonType.innerHTML = ''
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  renderPokemon(searchPokemon);
  pokemonType.innerHTML = ''
});

buttonStart.addEventListener('click', () => {
  setTimeout(() => {
    renderPokemon(1)
  }, 1000)
})