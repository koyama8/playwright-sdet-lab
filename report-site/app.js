const tabs = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('[data-panel]')];
const videoGrid = document.querySelector('#video-grid');
const videoCount = document.querySelector('#video-count');
const videoHeading = document.querySelector('#video-heading');
let allVideos = [];

function renderVideos(kind) {
  const videos = allVideos.filter((video) => video.kind === kind);
  videoHeading.textContent = kind === 'api' ? 'Vídeos API' : 'Vídeos Web';
  videoCount.textContent = `${videos.length} vídeo${videos.length === 1 ? '' : 's'}`;
  videoGrid.replaceChildren();

  if (videos.length === 0) {
    videoGrid.innerHTML = `<p class="empty-state">Nenhum vídeo ${kind.toUpperCase()} foi produzido nesta execução.</p>`;
    return;
  }

  videos.forEach(({ id, title, file }) => {
    const card = document.createElement('article');
    card.className = 'video-card';

    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.src = `./${file}`;

    const body = document.createElement('div');
    body.className = 'video-card__body';

    const identifier = document.createElement('span');
    identifier.className = 'scenario-id';
    identifier.textContent = id;

    const heading = document.createElement('h3');
    heading.textContent = title;

    body.append(identifier, heading);
    card.append(video, body);
    videoGrid.append(card);
  });
}

function activateTab(tabName) {
  const selectedTab = tabs.some((tab) => tab.dataset.tab === tabName) ? tabName : 'report';

  tabs.forEach((tab) => {
    const active = tab.dataset.tab === selectedTab;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  panels.forEach((panel) => {
    const selectedPanel = selectedTab.startsWith('videos-') ? 'videos' : selectedTab;
    panel.hidden = panel.dataset.panel !== selectedPanel;
  });

  if (selectedTab.startsWith('videos-')) renderVideos(selectedTab.replace('videos-', ''));

  const url = new URL(window.location.href);
  url.searchParams.set('tab', selectedTab);
  window.history.replaceState({}, '', url);
}

async function loadVideos() {
  try {
    const response = await fetch(`./videos/manifest.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Manifesto de vídeos indisponível.');

    allVideos = await response.json();
    const selectedTab = new URLSearchParams(window.location.search).get('tab') ?? 'report';
    if (selectedTab.startsWith('videos-')) renderVideos(selectedTab.replace('videos-', ''));
  } catch (error) {
    videoCount.textContent = 'Indisponível';
    videoGrid.innerHTML = `<p class="empty-state">${error.message}</p>`;
  }
}

tabs.forEach((tab) => tab.addEventListener('click', () => activateTab(tab.dataset.tab)));

activateTab(new URLSearchParams(window.location.search).get('tab') ?? 'report');
loadVideos();
