# Prime X Earn — 3D Ad Landing Page & Telegram Analytics Tracker

An interactive 3D landing page and real-time Telegram channel & group tracking system for Prime X Earn ad campaigns.

## 🚀 Features

- **3D Interactive Card & Physics Effects**: High-converting visual layout built with React, Tailwind CSS, and Framer Motion.
- **Telegram Bot Auto-Alerts**: Real-time notifications sent directly to Telegram whenever a new member joins or asks a question.
- **Multi-Domain Link Generator**: Auto-generates unique tracking URLs for multiple domains for both Telegram Channels and VIP Groups.
- **Q&A Modal**: Allows potential members to submit questions directly routed to the support team's VIP Telegram Group.
- **Real-Time Admin Dashboard**: Monitor page visits, link CTR, member joins, and question submissions with live IP & geolocation details.

---

## 🛠 Local Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your details:
   ```env
   TELEGRAM_BOT_TOKEN="your_telegram_bot_token_from_botfather"
   TELEGRAM_ADMIN_CHAT_ID="your_telegram_chat_id"
   APP_URL="https://your-deployed-domain.com"
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 📦 Production Deployment

### Option 1: Render.com Web Service Deployment (Recommended)

1. **Connect Repository**: Connect your GitHub repo (`https://github.com/PremKumar829/Trackp`) to [Render](https://render.com).
2. **Build Command**: Set to `npm install && npm run build` (or leave default, as `"postinstall": "npm run build"` will run automatically).
3. **Start Command**: Set to `npm run start` (or `node dist/server.cjs`).
4. **Environment Variables** (In Render Dashboard -> Environment):
   - `TELEGRAM_BOT_TOKEN`: Your Telegram Bot Token from @BotFather
   - `TELEGRAM_ADMIN_CHAT_ID`: Your Telegram Chat ID
   - `APP_URL`: Your Render App Web URL (e.g., `https://trackp.onrender.com`)
5. Click **Save Changes & Manual Deploy** -> **Deploy latest commit**.

### Option 2: VPS (Ubuntu / Nginx / PM2)

```bash
npm run build
pm2 start dist/server.cjs --name "primexearn"
```

---

*Ads managed by VYRNXY ADS*
