
YouTube Clone Backend

A full-featured YouTube-like video streaming backend application built with modern web technologies.
This backend supports core video platform features including user authentication, video uploads, history tracking, subscriptions, 
likes/comments, channel dashboards, playlists, and more.

🚀 Features
🔐 User Authentication (Login / Register / JWT tokens)

🎬 Video Upload & Streaming

📜 Video History Tracking

❤️ Like/Dislike Functionality

💬 Comments on Videos

📺 Channel Dashboard with Analytics

🔔 Subscribe/Unsubscribe Channels

📂 Playlists (Create, Add, Remove Videos)

💳 Subscription Plans (Paid or Free)

📈 App Health Checker (API Status Monitoring)

🧵 Trending, Tags, Categories

🐦 Twitter Share Integration

⏳ Watch Later & Save Video

```
Backend Framework: Node.js / Express.js

Database: MongoDB / PostgreSQL / MySQL

Authentication: JWT / OAuth

Cloud Storage: AWS S3 / Cloudinary

```

Project Structure
```
youtube-clone-backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
├── uploads/
├── .env
├── package.json
└── README.md

```

```
# Clone the repo
git clone https://github.com/Mayanks08/youtube-clone-backend.git
cd youtube-clone-backend

# Install dependencies
npm install

# Add environment variables
cp .env.example .env
# Edit .env with DB, JWT, Cloud keys, etc.

# Start the server
npm run dev

```

 End Points Collection

``` Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	User login
POST	/api/video/upload	Upload a new video
GET	/api/video/:id	Get video details
POST	/api/video/:id/like	Like a video
POST	/api/video/:id/comment	Comment on a video
POST	/api/subscribe/:channelId	Subscribe to a channel
GET	/api/dashboard	View channel analytics
GET	/api/health	API Health check

```

This project is licensed under the MIT License - see the LICENSE file for details.





