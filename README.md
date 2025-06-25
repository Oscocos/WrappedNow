# Wrapped Now
![Wrapped Now preview](example.png)

An interactive web app that shows your personalized Spotify Wrapped 
your top artists and songs over custom time periods from 1 month to 1 year.

---

## Using This Project

You can use this project **as is** right away if you want to explore your own Spotify data 
(I would appreciate that! It lets me know cool people are using something I made!)

### Requirements to run locally:

- A modern browser (Chrome, Firefox, Edge, Safari)
- A local HTTP server to serve the files (e.g., [Vite](https://vitejs.dev/), or `http-server` via npm)
- If you install the dependencies and run it using something like VS-Code and npm start/run then you can just go to the localhost (:3000, :5173, or whatever)
- You will be asked to log in, **dont trust me?** that's okay! I don't ever handle or see your password or user, you will be redirected to Spotify and they will handle the rest! (plus it's all local)

### How to run locally:

1. Clone or download the repository.
2. If using Node.js tools, install dependencies (if any, e.g., with `npm install`).
3. Start your local server in the project folder (npm run).
4. Open the browser and go to `http://localhost:5173` (or your local server URL).
5. Click **Log in with Spotify** and authorize the app.

---

## Setup & Customization (Optional)

### 1. Create a Spotify Developer Account

- Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
- Log in with your Spotify account (or create one)
- Create a new app
- Copy the **Client ID**

### 2. Configure Redirect URI

- In your Spotify app settings, add your redirect URI:
  - For local development: `http://localhost:5173/callback`
  - For production, update this accordingly to your deployed URL (e.g., `https://yourdomain.com/callback`)

### 3. Update the Client ID & Redirect URI

In the `script.js` file:

```js
const clientId = "YOUR_CLIENT_ID_HERE";
const redirectUrl = "YOUR_REDIRECT_URI_HERE";
