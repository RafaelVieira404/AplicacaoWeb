const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const container = document.getElementById('container');
const items = JSON.parse(localStorage.getItem('items')) || [];
const item = items.find(i => i.id === id);

if (item) {
  fetchPoster(item.title).then(posterUrl => {
    container.innerHTML = `
      <div class="flex flex-col md:flex-row gap-6 items-start w-full">
        <img src="${posterUrl}" alt="Poster de ${item.title}" class="w-48 h-72 object-cover border border-red-600 rounded">

        <div class="flex flex-col flex-1 text-left">
          <h1 class="text-2xl font-bold mb-2 text-red-500">${item.title}</h1>
          <p class="mb-4 text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
            ${item.description || 'Sem descrição'}
          </p>
          <span class="bg-red-600 text-white px-2 py-1 rounded self-start">${item.status}</span>
        </div>
      </div>
    `;
  });
} else {
  container.innerHTML = `<p class="text-red-500 text-center">Filme não encontrado.</p>`;
}

async function fetchPoster(title) {
  try {
    const apiKey = '1de13501';
    const searchRes = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${apiKey}`);
    const searchData = await searchRes.json();

    if (searchData.Search?.length > 0) {
      const imdbID = searchData.Search[0].imdbID;
      const detailRes = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
      const detailData = await detailRes.json();

      if (detailData.Poster && detailData.Poster !== 'N/A') {
        return detailData.Poster;
      }
    }
  } catch (error) {
    console.error('Erro ao buscar pôster:', error);
  }

  return 'https://via.placeholder.com/192x288?text=Sem+Imagem';
}
