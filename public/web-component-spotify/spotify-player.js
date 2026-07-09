(() => {
  if (window.customElements.get('spotify-player')) return;

  const CLIENT_ID = 'c28e8be7094940c58fb46b4ae1aac24d';
  const REDIRECT_URI = 'https://dazd.me/spotify-player/callback.html';
  const SCOPES = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming'
  ];

  class SpotifyPlayer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.token = null;
      this.refreshToken = null;
      this.expiresAt = 0;
    }
    
    connectedCallback() {
      this.render();
      this.restoreSession();
      this.bindMessage();
      this.checkRedirectFallback();
    }
    
    checkRedirectFallback() {
      const code = sessionStorage.getItem('SPOTIFY_AUTH_CODE');
      if (code) {
        sessionStorage.removeItem('SPOTIFY_AUTH_CODE');
        this.exchangeToken(code);
      }
    }

    
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #1db954;
            color: white;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,.4);
            user-select: none;
          }
        </style>
        <div class="btn">🎵</div>
      `;

      this.shadowRoot.querySelector('.btn')
        .addEventListener('click', () => {
          this.token ? alert('Spotify 已登录') : this.login();
        });
    }

    bindMessage() {
      window.addEventListener('message', async e => {
        if (e.data?.type !== 'SPOTIFY_AUTH_CALLBACK') return;
        if (e.data.code) {
          await this.exchangeToken(e.data.code);
          this.saveSession();
        }
      });
    }

    async login() {
      const verifier = this.randomString(64);
      localStorage.setItem('spotify_verifier', verifier);
      const challenge = await this.pkceChallenge(verifier);

      const url = new URL('https://accounts.spotify.com/authorize');
      url.search = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES.join(' '),
        code_challenge_method: 'S256',
        code_challenge: challenge
      });

      window.open(url, 'spotify-auth', 'width=500,height=700');
    }

    async exchangeToken(code) {
      const verifier = localStorage.getItem('spotify_verifier');
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: verifier
        })
      });

      const data = await res.json();
      this.token = data.access_token;
      this.refreshToken = data.refresh_token;
      this.expiresAt = Date.now() + data.expires_in * 1000;
    }

    async refresh() {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        })
      });

      const data = await res.json();
      this.token = data.access_token;
      this.expiresAt = Date.now() + data.expires_in * 1000;
      this.saveSession();
    }

    saveSession() {
      localStorage.setItem('spotify_session', JSON.stringify({
        token: this.token,
        refreshToken: this.refreshToken,
        expiresAt: this.expiresAt
      }));
    }

    restoreSession() {
      const raw = localStorage.getItem('spotify_session');
      if (!raw) return;
      const s = JSON.parse(raw);
      this.token = s.token;
      this.refreshToken = s.refreshToken;
      this.expiresAt = s.expiresAt;

      if (Date.now() > this.expiresAt - 60000) {
        this.refresh();
      }
    }

    randomString(len) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return [...crypto.getRandomValues(new Uint8Array(len))]
        .map(x => chars[x % chars.length]).join('');
    }

    async pkceChallenge(v) {
      const hash = await crypto.subtle.digest(
        'SHA-256', new TextEncoder().encode(v)
      );
      return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }
  }

  customElements.define('spotify-player', SpotifyPlayer);

  // auto mount
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('spotify-player')) {
      document.body.appendChild(document.createElement('spotify-player'));
    }
  });
})();
