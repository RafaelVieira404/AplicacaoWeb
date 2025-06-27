if (!sessionStorage.getItem('auth')) window.location.href = 'index.html';

const form = document.getElementById('itemForm');
const list = document.getElementById('itemList');
const filter = document.getElementById('filterStatus');

let items = JSON.parse(localStorage.getItem('items')) || [];

function save() {
  localStorage.setItem('items', JSON.stringify(items));
}

async function render() {
  list.innerHTML = '';
  const filtro = filter.value;

  for (const item of items.filter(item => filtro === 'todos' || item.status === filtro)) {
    const posterUrl = await fetchPoster(item.title);

    const li = document.createElement('li');
    li.className = 'bg-neutral-800 text-white p-4 rounded shadow flex items-center gap-4';

    li.innerHTML = `
      <img src="${posterUrl}" alt="Poster de ${item.title}" class="w-24 h-36 object-cover rounded border border-red-600" onerror="this.src='https://via.placeholder.com/96x144?text=Sem+Imagem'">
      <div class="flex-1">
        <strong class="text-lg">${item.title}</strong> - <em>${item.status}</em>
        <p class="text-sm text-gray-300">${item.description || ''}</p>
        <a href="shared.html?id=${item.id}" class="text-red-400 underline text-sm">Ver Filme</a>
        <div class="flex gap-2 flex-wrap mt-2">
          <select onchange="changeStatus('${item.id}', this.value)" class="border p-1 rounded bg-black text-white">
            <option ${item.status === 'Não Assistido' ? 'selected' : ''}>Não Assistido</option>
            <option ${item.status === 'Assistido' ? 'selected' : ''}>Assistido</option>
            <option ${item.status === 'Assistindo' ? 'selected' : ''}>Assistindo</option>
          </select>
          <button onclick="editItem('${item.id}')" class="bg-yellow-400 px-2 py-1 rounded">Editar</button>
          <button onclick="deleteItem('${item.id}')" class="bg-red-600 text-white px-2 py-1 rounded">Excluir</button>
        </div>
      </div>
    `;
    list.appendChild(li);
  }
}

async function fetchPoster(title) {
  try {
    const apiKey = '1de13501';
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.Poster && data.Poster !== 'N/A') {
      return data.Poster;
    }
  } catch (error) {
    console.error('Erro ao buscar imagem do filme:', error);
  }
  return 'https://via.placeholder.com/96x144?text=Sem+Imagem';
}


form.addEventListener('submit', function (e) {
  e.preventDefault();
  const id = crypto.randomUUID();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const status = document.getElementById('status').value;
  items.push({ id, title, description, status });
  save();
  render();
  form.reset();
});

function deleteItem(id) {
  items = items.filter(i => i.id !== id);
  save();
  render();
}

function editItem(id) {
  const item = items.find(i => i.id === id);
  document.getElementById('title').value = item.title;
  document.getElementById('description').value = item.description;
  document.getElementById('status').value = item.status;
  deleteItem(id);
}

function changeStatus(id, newStatus) {
  const item = items.find(i => i.id === id);
  item.status = newStatus;
  save();
  render();
}

filter.addEventListener('change', render);

render();
