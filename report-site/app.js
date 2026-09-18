const tabs = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('[data-panel]')];
const folderGrid = document.querySelector('#folder-grid');
const journeyView = document.querySelector('#journey-view');
const backToFolders = document.querySelector('#back-to-folders');
const journeyTitle = document.querySelector('#journey-title');
const journeyVideoCount = document.querySelector('#journey-video-count');
const videoGrid = document.querySelector('#video-grid');
const videoCount = document.querySelector('#video-count');
const videoHeading = document.querySelector('#video-heading');
let allVideos = [];
let selectedKind = 'web';

function journeyFrom(video) {
  return video.journey ?? video.id.match(/^CT-(?:WEB|API)-(.+)-\d+$/)?.[1] ?? 'OUTROS';
}

function createFolderIcon() {
  const icon = document.createElement('span');
  icon.className = 'folder-card__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = `
    <svg viewBox="0 0 64 52" role="img">
      <path class="folder-shape" d="M4 12a6 6 0 0 1 6-6h15l6 7h23a6 6 0 0 1 6 6v25a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V12Z" />
      <rect class="lock-body" x="27" y="28" width="18" height="14" rx="3" />
      <path class="lock-loop" d="M31 28v-4a5 5 0 0 1 10 0v4" />
    </svg>`;
  return icon;
}

function renderVideoCards(videos) {
  videoGrid.replaceChildren();

  videos.forEach(({ id, title, file }) => {
    const card = document.createElement('article');
    card.className = 'video-card';

    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.src = new URL(file, window.location.href).href;

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

function openJourney(journey, videos) {
  folderGrid.hidden = true;
  journeyView.hidden = false;
  journeyTitle.textContent = journey;
  journeyVideoCount.textContent = `${videos.length} vídeo${videos.length === 1 ? '' : 's'}`;
  renderVideoCards(videos);
}

function renderFolders(kind) {
  selectedKind = kind;
  const videos = allVideos.filter((video) => video.kind === kind);
  const journeys = new Map();

  videos.forEach((video) => {
    const journey = journeyFrom(video);
    if (!journeys.has(journey)) journeys.set(journey, []);
    journeys.get(journey).push(video);
  });

  videoHeading.textContent = kind === 'api' ? 'Vídeos API' : 'Vídeos Web';
  videoCount.textContent = `${journeys.size} pasta${journeys.size === 1 ? '' : 's'}`;
  folderGrid.replaceChildren();
  folderGrid.hidden = false;
  journeyView.hidden = true;

  if (journeys.size === 0) {
    folderGrid.innerHTML = `<p class="empty-state">Nenhuma jornada ${kind.toUpperCase()} foi produzida nesta execução.</p>`;
    return;
  }

  journeys.forEach((journeyVideos, journey) => {
    const folder = document.createElement('button');
    folder.className = 'folder-card';
    folder.type = 'button';
    folder.setAttribute('aria-label', `Abrir vídeos da jornada ${journey}`);

    const content = document.createElement('span');
    content.className = 'folder-card__content';

    const label = document.createElement('strong');
    label.textContent = journey;

    const amount = document.createElement('span');
    amount.textContent = `${journeyVideos.length} vídeo${journeyVideos.length === 1 ? '' : 's'}`;

    const action = document.createElement('span');
    action.className = 'folder-card__action';
    action.textContent = 'Abrir jornada →';

    content.append(label, amount, action);
    folder.append(createFolderIcon(), content);
    folder.addEventListener('click', () => openJourney(journey, journeyVideos));
    folderGrid.append(folder);
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

  if (selectedTab.startsWith('videos-')) renderFolders(selectedTab.replace('videos-', ''));

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
    if (selectedTab.startsWith('videos-')) renderFolders(selectedTab.replace('videos-', ''));
  } catch (error) {
    videoCount.textContent = 'Indisponível';
    folderGrid.innerHTML = `<p class="empty-state">${error.message}</p>`;
  }
}

tabs.forEach((tab) => tab.addEventListener('click', () => activateTab(tab.dataset.tab)));
backToFolders.addEventListener('click', () => renderFolders(selectedKind));

activateTab(new URLSearchParams(window.location.search).get('tab') ?? 'report');
loadVideos();
