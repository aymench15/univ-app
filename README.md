# 🚀 My Web Project

A comprehensive full-stack web application developed using **React.js**, **Tailwind CSS**, **Node.js** (backend located in the `/api` folder), **Vite**, and **Capacitor** for mobile support.

## 📦 Folder Structure

my-project/

├── api/ # Node.js backend

├── public/

├── src/ # React frontend

├── capacitor.config.ts

├── tailwind.config.js

├── package.json

├── README.md

---

## 🛠️ **Technologies Used**

- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Cloud Services:** Cloudinary
- **Email Services:** Nodemailer

---

## 🚀 **Installation Guide**

### 1️⃣ **Install Node.js**

If you **don't have Node.js installed**, download and install it from [Node.js Official Website](https://nodejs.org/).  
To verify the installation, run the following commands:

```bash

node -v
npm -v

```
If both return a version number, you're good to go!

```bash

2️⃣ Clone the repository


git clone https://github.com/yourusername/univ-app.git

cd univ-app
```

```bash

3️⃣ Install frontend dependencies



npm install

or using Yarn:

yarn install

```
```bash

4️⃣ Install backend dependencies

cd api

npm install
```
📝 Backend Configuration (.env)

Inside the `/api` folder, create a file named `.env` and include the following content:

```bash
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
````

```bash

node server.js
````

The backend will be accessible at [http://localhost:8800/](http://localhost:8800/).

#### ✅ Start Frontend

Return to the root folder and execute:

npm run dev

Frontend runs on http://localhost:5173/

👉 Make sure frontend is configured to call http://localhost:8800/ for API requests.

📱 Capacitor Setup (Mobile)
```bash

Initialize Capacitor (if not done already):

npx cap init

Add platform:

npx cap add android

npx cap add ios

Sync and open native project:

npx cap sync

npx cap open android

# or

npx cap open ios
````
```bash

Build frontend and copy to Capacitor:

npm run build

npx cap copy
```
The frontend will be available at [http://localhost:5173/](http://localhost:5173/). Ensure that the frontend is configured to make API requests to [http://localhost:8800/](http://localhost:8800/).

### 📱 **Capacitor Setup (Mobile)**

```bash

If you haven't initialized Capacitor yet, do so with:

npx cap init

Add the desired platforms:

npx cap add android
npx cap add ios

Sync and open the native project:

npx cap sync
npx cap open android

# or

npx cap open ios

Finally, build the frontend and copy it to Capacitor:

npm run build
npx cap copy

```
---

## 🖼️ Screenshots

<img src="images_for_readme/1.png" alt="App Screenshot 1" width="600"/>
<hr/>
<img src="images_for_readme/2.png" alt="App Screenshot 2" width="600"/>
<hr/>
<img src="images_for_readme/3.png" alt="App Screenshot 3" width="600"/>
<hr/>
<img src="images_for_readme/4.png" alt="App Screenshot 4" width="600"/>
<hr/>
<img src="images_for_readme/5.png" alt="App Screenshot 5" width="600"/>
<hr/>
<img src="images_for_readme/6.png" alt="App Screenshot 6" width="600"/>
<hr/>
<img src="images_for_readme/7.png" alt="App Screenshot 7" width="600"/>
<hr/>
<img src="images_for_readme/8.png" alt="App Screenshot 8" width="600"/>
<hr/>
<img src="images_for_readme/9.png" alt="App Screenshot 9" width="600"/>
<hr/>
<img src="images_for_readme/10.png" alt="App Screenshot 10" width="600"/>
<hr/>
<img src="images_for_readme/11.png" alt="App Screenshot 11" width="600"/>
<hr/>
<img src="images_for_readme/12.png" alt="App Screenshot 12" width="600"/>
<hr/>
<img src="images_for_readme/13.png" alt="App Screenshot 13" width="600"/>

---
