# 🚀 My Web Project

A full-stack web application built with **React.js**, **Tailwind CSS**, **Node.js (backend in `/api` folder)**, and **Capacitor** for mobile support.

---

## 🖼️ Screenshots

<img src="images/screenshot1.png" alt="App Screenshot 1" width="600"/>
<img src="images/screenshot2.png" alt="App Screenshot 2" width="600"/>

---

## 📦 Folder Structure

my-project/
├── api/ # Node.js backend
├── public/
├── src/ # React frontend
├── capacitor.config.ts
├── tailwind.config.js
├── package.json
├── README.md

yaml
Copy
Edit

---

## 🛠️ **Technologies Used**

- React.js
- Tailwind CSS
- Node.js + Express
- Capacitor
- MongoDB
- Cloudinary
- Nodemailer

---

## 🚀 **Installation Guide**

### 1️⃣ **Install Node.js**

👉 If you **don’t have Node.js installed**, download and install it from [https://nodejs.org/](https://nodejs.org/)  
👉 To check if Node.js is already installed:

```bash
node -v
npm -v
If both return a version number, you’re good to go!

2️⃣ Clone the repository
bash
Copy
Edit
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
3️⃣ Install frontend dependencies
bash
Copy
Edit
npm install
or using Yarn:

bash
Copy
Edit
yarn install
4️⃣ Install backend dependencies
bash
Copy
Edit
cd api
npm install
📝 Backend Configuration (.env)
Inside /api folder, create a file called .env and paste the following content:

env
Copy
Edit
MONGO = mongodb+srv://vicerector:vicerector1234@verify-docs.iqzw8.mongodb.net/?retryWrites=true&w=majority&appName=verify-docs
JWT_KEY = accessToken
ADMIN_JWT_KEY = accessTokenAdmin

EMAIL_HOST = smtp.gmail.com
EMAIL_SERVICE = gmail
EMAIL_PORT = 587
EMAIL_SECURE = true
EMAIL_USER = moncite.service@gmail.com
EMAIL_PASS = wulnqefatxftnfvv

CLOUDINARY_CLOUD_NAME = diawojtfk
CLOUDINARY_API_KEY = 835315952334123
CLOUDINARY_API_SECRET = Fg5HKnbimW-KMQcwhnBPq87nisY
CLOUDINARY_URL = cloudinary://835315952334123:Fg5HKnbimW-KMQcwhnBPq87nisY@diawojtfk

BASE_URL = http://localhost:8800/
✅ Important: Replace sensitive credentials if deploying publicly or use environment variables safely.

🏃‍♂️ Running the Project in Development
✅ Start Backend (API)
From /api folder:

bash
Copy
Edit
npm run dev
(or if you use nodemon)

bash
Copy
Edit
nodemon index.js
Backend will run on http://localhost:8800/ (according to BASE_URL)

✅ Start Frontend
Go back to the root folder:

bash
Copy
Edit
npm start
Frontend runs on http://localhost:3000/.

👉 Make sure frontend is configured to call http://localhost:8800/ for API requests.

📱 Capacitor Setup (Mobile)
Initialize Capacitor (if not done already):

bash
Copy
Edit
npx cap init
Add platform:

bash
Copy
Edit
npx cap add android
# or
npx cap add ios
Sync and open native project:

bash
Copy
Edit
npx cap sync
npx cap open android
# or
npx cap open ios
Build frontend and copy to Capacitor:

bash
Copy
Edit
npm run build
npx cap copy
