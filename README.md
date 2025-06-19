# AI Ticket Assistant 🤖

A simple AI-powered ticket management system built as a learning project by following the "Chai aur Code" YouTube series by Hitesh Choudhary. This app uses AI to help organize, prioritize, and assign support tickets to moderators automatically.

## Features ✨

- **AI Ticket Handling:** 🧠
  - Automatically categorizes and prioritizes tickets 🏷️
  - Assigns tickets to moderators based on skills 🎯
  - Adds helpful AI-generated notes for moderators 📝

- **User Roles:** 👥
  - User, Moderator, Admin 🧑‍💻
  - Secure login with JWT 🔒

- **Background Processing:** 🔄
  - Event-driven ticket updates using Inngest ⚡
  - Email notifications for ticket assignments 📧

## Tech Stack 🛠️

- **Backend:** Node.js, Express, MongoDB, Inngest, Google Gemini API, Nodemailer
- **Frontend:** React, Vite, TailwindCSS

## Getting Started 🚀

### Prerequisites 📋
- Node.js (v14+)
- MongoDB
- Google Gemini API key
- Mailtrap account (for email testing)

### Setup 🏗️

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd Full-Stack-AI-Agent
   ```

2. **Install dependencies:**
   - Backend:
     ```sh
     cd AI-Ticket-Assistant
     npm install
     ```
   - Frontend:
     ```sh
     cd ../ai-ticket-frontend
     npm install
     ```

3. **Environment Variables:**
   Create a `.env` file in `AI-Ticket-Assistant` with:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   MAILTRAP_SMTP_HOST=your_mailtrap_host
   MAILTRAP_SMTP_PORT=your_mailtrap_port
   MAILTRAP_SMTP_USER=your_mailtrap_user
   MAILTRAP_SMTP_PASS=your_mailtrap_password
   GEMINI_API_KEY=your_gemini_api_key
   APP_URL=http://localhost:3000
   ```

### Running the App ▶️

- **Backend:**
  ```sh
  npm run dev
  ```
- **Inngest Dev Server:**
  ```sh
  npm run inngest-dev
  ```
- **Frontend:**
  ```sh
  npm run dev
  ```

## Credits 🙏

This project was created for learning purposes by following the "Chai aur Code" YouTube series by Hitesh Choudhary. 

Original inspiration and guidance: [Chai aur Code](https://www.youtube.com/@chaiaurcode) 