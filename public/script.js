const clientId = "YOUR_CLIENT_ID_HERE";       /* Something like: 435n4jsdjfj3345aa01fd138e5220 */
const redirectUrl = 'YOUR_REDIRECT_URL_HERE'; /* Ex: http://localhost:5173/callback */

const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = 'user-top-read';

const currentToken = {
  get access_token() {
    return sessionStorage.getItem('access_token') || null;
  },
  get expires_in() {
    return sessionStorage.getItem('expires_in') || null;
  },
  get expires() {
    return sessionStorage.getItem('expires') || null;
  },
  save(response) {
    const { access_token, expires_in } = response;
    sessionStorage.setItem('access_token', access_token);
    sessionStorage.setItem('expires_in', expires_in);
    const now = new Date();
    const expiry = new Date(now.getTime() + (expires_in * 1000));
    sessionStorage.setItem('expires', expiry);
  },
  clear() {
    sessionStorage.clear();
  }
};

const timePeriodLabels = {
  short_term: "1 Month",
  medium_term: "6 Months",
  long_term: "1 Year"
};

function clearContainers() {
  ['main', 'top', 'oauth'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });
}

async function init() {
  const args = new URLSearchParams(window.location.search);
  const code = args.get('code');

  if (code) {
    try {
      const token = await getToken(code);
      currentToken.save(token);
    } catch (e) {
      console.error("Failed to get token:", e);
      currentToken.clear();
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    const updatedUrl = url.search ? url.href : url.href.replace('?', '');
    window.history.replaceState({}, document.title, updatedUrl);
  }

  if (currentToken.access_token) {
    clearContainers();
    await renderUserTop();
  } else {
    clearContainers();
    renderTemplate("main", "login");
  }
}

async function renderUserTop() {
  const defaultType = 'tracks';       
  const defaultPeriod = 'short_term'; 

  const fetchUrl = `https://api.spotify.com/v1/me/top/${defaultType}?time_range=${defaultPeriod}&limit=50`;
  const response = await fetch(fetchUrl, {
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token }
  });

  if (!response.ok) {
    console.error('Failed to fetch user top tracks');
    return;
  }

  const userTop = await response.json();

  renderTemplate("top", "top-template", userTop);

  const charsSection = document.getElementById('container');
  charsSection.innerHTML = "";

  for (const track of userTop.items) {
    charsSection.innerHTML += `
      <div class='card'>
        <a href='${track.external_urls.spotify}' target='_blank'>
          <img width='150' src='${track.album.images[0].url}' />
          <h4 class='card-text'>${track.name}</h4>
          <p class='card-text'>${track.album.name}</p>
        </a>
      </div>`;
  }

  const timePeriodPlaceholder = document.getElementById('time-period-placeholder');
  if (timePeriodPlaceholder) {
    timePeriodPlaceholder.textContent = timePeriodLabels[defaultPeriod];
  }
}


async function redirectToSpotifyAuthorize() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = Array.from(randomValues).map(x => possible[x % possible.length]).join("");

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest('SHA-256', data);

  const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  sessionStorage.setItem('code_verifier', code_verifier);

  const authUrl = new URL(authorizationEndpoint);
  authUrl.search = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  }).toString();

  window.location.href = authUrl.toString();
}

async function getToken(code) {
  const code_verifier = sessionStorage.getItem('code_verifier');

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUrl,
      code_verifier
    })
  });

  if (!response.ok) {
    throw new Error('Token request failed');
  }

  return response.json();
}

async function getUserData() {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token }
  });
  return response.json();
}

async function getUserTop() {
  const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=50", {
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user top tracks');
  }

  return response.json();
}

async function getUserTopCustom() {
  const typeSelect = document.getElementById('type-select');
  const timePeriodSelect = document.getElementById('time-period-select');
  if (!typeSelect || !timePeriodSelect) return;

  const selectedType = typeSelect.value;
  const selectedPeriod = timePeriodSelect.value;

  const fetchUrl = `https://api.spotify.com/v1/me/top/${selectedType}?time_range=${selectedPeriod}&limit=50`;
  const response = await fetch(fetchUrl, {
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token }
  });

  if (!response.ok) {
    console.error('Failed to fetch custom user top');
    return;
  }

  const json = await response.json();

  const timePeriodPlaceholder = document.getElementById('time-period-placeholder');
  if (timePeriodPlaceholder) {
    timePeriodPlaceholder.textContent = timePeriodLabels[selectedPeriod] || '_';
  }

  if (selectedType === 'artists') {
    renderArtistTop(json);
  } else {
    renderTrackTop(json);
  }
}

function renderTrackTop(trackTop) {
  const charsSection = document.getElementById('container');
  if (!charsSection) return;
  charsSection.innerHTML = '';

  for (const track of trackTop.items) {
    charsSection.innerHTML += `
      <div class='card'>
        <a href='${track.external_urls.spotify}' target='_blank'>
          <img width='150' src='${track.album.images[0].url}' />
          <h4 class='card-text'>${track.name}</h4>
          <p class='card-text'>${track.album.name}</p>
        </a>
      </div>`;
  }
}

function renderArtistTop(artistTop) {
  const charsSection = document.getElementById('container');
  if (!charsSection) return;
  charsSection.innerHTML = '';

  for (const artist of artistTop.items) {
    charsSection.innerHTML += `
      <div class='card'>
        <a href='${artist.external_urls.spotify}' target='_blank'>
          <img width='150' src='${artist.images[0].url}' />
          <h4 class='card-text'>${artist.name}</h4>
          <p class='card-text'>Popularity: ${artist.popularity}</p>
        </a>
      </div>`;
  }
}

async function loginWithSpotifyClick() {
  await redirectToSpotifyAuthorize();
}

async function logoutClick() {
  currentToken.clear();
  window.location.href = redirectUrl;
}

function renderTemplate(targetId, templateId, data = null) {
  const template = document.getElementById(templateId);
  if (!template) return;

  const clone = template.content.cloneNode(true);

  const elements = clone.querySelectorAll("*");
  elements.forEach(ele => {
    [...ele.attributes].filter(a => a.name.startsWith("data-bind")).forEach(attr => {
      const target = attr.name.replace(/data-bind-?/, "");
      const isHandler = target.startsWith("onclick");
      const prop = target === "" ? "innerHTML" : target;

      const expr = isHandler ? attr.value : `data.${attr.value}`;

      try {
        ele[prop] = isHandler
          ? () => { eval(attr.value); }
          : eval(expr);
        ele.removeAttribute(attr.name);
      } catch (ex) {
        console.error(`Error binding ${expr} to ${prop}`, ex);
      }
    });
  });

  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = "";
  target.appendChild(clone);
}

init();
