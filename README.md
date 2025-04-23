# Comrade Univest - Student Investment Platform

![Comrade Univest Banner](https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)

## 🌱 Overview

Comrade Univest is a peer-to-peer investment platform designed for Kenyan university students to collaboratively invest in vetted opportunities. The platform enables students to pool resources, make informed investment decisions, and grow their finances together.

## ✨ Key Features

- **Group Investment Clubs**: Form investment squads with classmates
- **KES 50 Minimum Investment**: Accessible to all students
- **Diverse Portfolio Options**: Agriculture, real estate, stocks and more
- **M-Pesa Integration**: Seamless mobile money transactions
- **Educational Resources**: Learn while you invest
- **Transparent Tracking**: Real-time portfolio monitoring

## 🛠️ Technologies Used

### Frontend
- HTML5, CSS3, JavaScript
- Firebase Authentication
- Firestore Database
- Animate.css for animations
- Font Awesome icons
- Google Fonts (Poppins)

### Backend
- Firebase Cloud Firestore
- Firebase Hosting
- Firebase Cloud Functions (for future expansion)

## 🚀 Getting Started

### Prerequisites
- Firebase account
- Basic understanding of HTML/CSS/JS
- Modern web browser

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/comrade-univest.git
cd comrade-univest
```

2. Initialize Firebase:
```bash
firebase init
```

3. Deploy to Firebase Hosting:
```bash
firebase deploy
```

## 📂 Project Structure

```
comrade-univest/
├── public/                 # All public assets
│   ├── index.html          # Main landing page
│   ├── dashboard.html      # User dashboard
│   ├── css/                # Custom CSS
│   └── js/                 # Custom JavaScript
├── firebase.json           # Firebase configuration
├── .firebaserc             # Firebase project settings
└── README.md               # This file
```

## 🔒 Firebase Configuration

To connect to your Firebase project:

1. Create a new project in Firebase Console
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Replace the config in `index.html` with your credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## 🌍 Target Market

- Kenyan university students
- Student investment clubs (chamas)
- Campus entrepreneurs
- Young investors aged 18-25

## 📈 Business Model

- 1% transaction fee on successful investments
- Premium analytics features
- Sponsored investment opportunities
- Campus ambassador program

## 🤝 How to Contribute

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Project Lead: [Your Name]  
Email: your.email@example.com  
Twitter: [@ComradeUnivest](https://twitter.com/ComradeUnivest)

## 🙏 Acknowledgments

- Firebase team for amazing documentation
- Kenyan university students for their feedback
- All contributors who helped shape this project

---

<p align="center">
  <strong>Invest Together, Grow Together</strong><br>
  <em>Comrade Univest - For the students, by the students</em>
</p>
