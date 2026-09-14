const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:3030';
const email = process.env.API_ADMIN_EMAIL ?? 'qa@adminlab.com';
const password = process.env.API_ADMIN_PASSWORD ?? 'pwd123';

let accessToken = '';
let refreshToken = '';
let rotatedRefreshToken = '';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, { method = 'GET', token, body, expected = 200 } = {}) {
  const isForm = body instanceof FormData;
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body === undefined || isForm ? {} : { 'content-type': 'application/json' }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });
  const payload = response.status === 204 ? undefined : await response.json();
  assert(
    response.status === expected,
    `${method} ${path}: esperado ${expected}, recebido ${response.status} (${JSON.stringify(payload)})`,
  );
  assert(response.headers.get('x-request-id'), `${method} ${path}: x-request-id ausente`);
  return payload;
}

async function run() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

  const health = await request('/api/health');
  assert(health.status === 'ok' && health.database === 'ok', 'Health não confirmou API e banco');

  const login = await request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  accessToken = login.data.accessToken;
  refreshToken = login.data.refreshToken;
  assert(login.data.session.idleTimeoutSeconds === 600, 'Timeout de inatividade deve ser 600s');

  await request('/api/people', { expected: 401 });
  await request('/api/people?page=0', { token: accessToken, expected: 400 });

  const personInput = {
    name: `API Smoke ${suffix}`,
    email: `api-smoke-${suffix}@example.com`,
    phone: '(11) 99999-0000',
    role: 'QA Engineer',
    status: 'ACTIVE',
  };
  const createdPerson = await request('/api/people', {
    method: 'POST',
    token: accessToken,
    body: personInput,
    expected: 201,
  });
  const personId = createdPerson.data.id;
  await request(`/api/people/${personId}`, { token: accessToken });
  const updatedPerson = await request(`/api/people/${personId}`, {
    method: 'PATCH',
    token: accessToken,
    body: { role: 'SDET', status: 'INACTIVE' },
  });
  assert(updatedPerson.data.role === 'SDET', 'Atualização da pessoa não foi persistida');
  const filteredPeople = await request(`/api/people?q=${encodeURIComponent(suffix)}`, {
    token: accessToken,
  });
  assert(filteredPeople.data.pagination.total === 1, 'Filtro de pessoas não retornou a massa criada');
  await request('/api/people', {
    method: 'POST',
    token: accessToken,
    body: { ...personInput, email: personInput.email.toUpperCase() },
    expected: 409,
  });

  const movieInput = {
    title: `API Smoke Movie ${suffix}`,
    genre: 'Drama',
    year: 2026,
    rating: 8.5,
    favorite: false,
    synopsis: 'Filme criado pela verificação completa da API.',
  };
  const createdMovie = await request('/api/movies', {
    method: 'POST',
    token: accessToken,
    body: movieInput,
    expected: 201,
  });
  const movieId = createdMovie.data.id;
  await request('/api/movies', {
    method: 'POST',
    token: accessToken,
    body: { ...movieInput, title: movieInput.title.toUpperCase() },
    expected: 409,
  });
  const favoriteMovie = await request(`/api/movies/${movieId}/favorite`, {
    method: 'POST',
    token: accessToken,
    body: {},
  });
  assert(favoriteMovie.data.favorite === true, 'Alternância de favorito falhou');
  const updatedMovie = await request(`/api/movies/${movieId}`, {
    method: 'PATCH',
    token: accessToken,
    body: { rating: 9.1 },
  });
  assert(Number(updatedMovie.data.rating) === 9.1, 'Atualização do filme não foi persistida');
  const filteredMovies = await request('/api/movies?favorite=true&pageSize=100', {
    token: accessToken,
  });
  assert(
    filteredMovies.data.items.some((movie) => movie.id === movieId),
    'Filtro de filmes favoritos não retornou a massa criada',
  );
  await request('/api/movies/not-a-uuid', { token: accessToken, expected: 400 });

  const invalidImage = new FormData();
  invalidImage.set('image', new Blob(['not-an-image'], { type: 'text/plain' }), 'poster.txt');
  await request('/api/movies', {
    method: 'POST',
    token: accessToken,
    body: invalidImage,
    expected: 415,
  });
  const oversizedImage = new FormData();
  oversizedImage.set(
    'image',
    new Blob([new Uint8Array(1_500_001)], { type: 'image/png' }),
    'large.png',
  );
  await request('/api/movies', {
    method: 'POST',
    token: accessToken,
    body: oversizedImage,
    expected: 413,
  });

  const refresh = await request('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
  rotatedRefreshToken = refresh.data.refreshToken;
  await request('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    expected: 401,
  });
  await request('/api/auth/logout', {
    method: 'POST',
    body: { refreshToken: rotatedRefreshToken },
    expected: 204,
  });
  await request('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken: rotatedRefreshToken },
    expected: 401,
  });

  await request(`/api/people/${personId}`, { method: 'DELETE', token: accessToken, expected: 204 });
  await request(`/api/movies/${movieId}`, { method: 'DELETE', token: accessToken, expected: 204 });

  console.log('API smoke: todos os fluxos e contratos verificados com sucesso.');
}

try {
  await run();
} finally {
  if (accessToken) {
    await request('/api/test-support/reset', {
      method: 'POST',
      token: accessToken,
      body: {},
    }).catch((error) => console.error(`Falha ao restaurar massas: ${error.message}`));
  }
}
