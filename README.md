# 🧠 ResearchAI Assistant

ResearchAI Assistant is a web-based tool that transforms academic papers into accessible content formats—slides, podcast scripts, executive summaries, and visual infographics—powered by **Grok AI** and **Supabase**.

> ⚡ A weekend-build, vibe-coded to make research shareable and human-friendly.

---

## ✨ Features

- 🎙️ Convert papers into podcast scripts
- 📊 Generate structured presentation slides
- 📄 Extract concise executive summaries
- 📈 Create infographic-ready visual content
- 📤 Upload `.pdf`, `.docx`, `.txt`, or paste raw text
- 🔐 Email-based authentication (Supabase)
- 🌙 Modern, responsive dark UI

---

## 🛠️ Tech Stack

| Layer       | Tech                     |
|------------|--------------------------|
| Frontend    | React + TailwindCSS      |
| Backend     | Supabase (Auth + DB)     |
| AI Engine   | Grok AI (via API)        |
| Hosting     | Vercel (optional)        |
| File Support| `.pdf`, `.docx`, `.txt`  |

---

## 🔧 Setup Locally

\`\`\`bash
git clone https://github.com/Dumebii/research-assistant.git
cd research-assistant
npm install
npm run dev
