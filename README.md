# 🎧 Wrapped Now

![Wrapped Now preview](example.png)

**Wrapped Now** is an interactive web app that shows you your personalized Spotify Wrapped — anytime you want!  
View your top artists or songs across different time ranges (1 month, 6 months, or 1 year), with clickable cards and Spotify-integrated data.

---

## 🚀 Try It Yourself

You can use this project **as-is** to explore your own Spotify data.

💬 _I’d love it if you did! If people are using this, it means something I made is bringing value to someone._

Features:
- View your **top artists or songs**
- Choose a time range: **1 month**, **6 months**, or **1 year**
- Click a card to open it directly on Spotify
- Artist cards show Spotify’s **popularity score**

---

## 🛠 Requirements

To run the app locally, you’ll need:

- A modern browser (Chrome, Firefox, Safari, etc.)
- A local server (e.g., [Vite](https://vitejs.dev/), or `http-server` via npm)

You can run it easily with VS Code + npm:

```bash
npm install
npm run dev
```

Then visit `http://localhost:5173` in your browser.

🔐 Don’t worry — you’ll log in **via Spotify**, not through this site.  
Your credentials are handled securely through Spotify’s own platform.

---

## 🧪 Run Locally – Step-by-Step

1. **Clone or download this repository**

2. **Install dependencies** (if using Node.js tools):
   ```bash
   npm install
   ```

3. **Start the local server**:
   ```bash
   npm run dev
   ```

4. **Visit the app**:
   Go to `http://localhost:5173` (or your server URL)

5. **Log in with Spotify** and authorize the app

---

## ⚙️ Optional: Use Your Own Spotify Credentials

If you want to customize the app or host it yourself:

### 1. Create a Spotify Developer App

- Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
- Log in and **create a new app**
- Copy your **Client ID**

### 2. Set a Redirect URI

In your app settings:
- Add `http://localhost:5173/callback` (or your deployed site’s `/callback` path)

### 3. Update the App

Open `script.js` and replace the default values:

```js
const clientId = "YOUR_CLIENT_ID_HERE";
const redirectUrl = "YOUR_REDIRECT_URI_HERE";
```

---

Enjoy your Spotify stats on demand ✨  
Feel free to fork, star ⭐, or contribute!
