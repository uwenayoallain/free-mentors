# Free Mentors Frontend | Sample Project

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript)
![MUI](https://img.shields.io/badge/MUI-6.4.6-007FFF?logo=mui)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)

Frontend application for Free Mentors - a platform connecting aspiring professionals with experienced mentors.

## 🚀 Overview

Free Mentors is designed to bridge the gap between mentors and mentees. The platform creates opportunities for professional growth through targeted mentorship sessions, knowledge sharing, and career guidance.

## ✨ Features

- **User Authentication**: Secure signup and login functionality
- **Role-Based Access**: Different features for users, mentors, and administrators
- **Mentor Discovery**: Browse and filter mentors by expertise and experience
- **Session Management**: Request, schedule, and track mentoring sessions
- **Reviews & Ratings**: Provide feedback after completed sessions
- **Profile Management**: Update personal information and preferences
- **Admin Dashboard**: Moderate content and manage users

## 🛠️ Tech Stack

- **React 19** with TypeScript for the UI
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Material UI** for component styling
- **React Hook Form** with Zod for form validation
- **Jest & Testing Library** for testing
- **Vite** for development and building

## 📦 Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd free-mentors/frontend
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Setup environment variables

   ```bash
   cp .env.example .env
   ```

   Configure the necessary environment variables in the .env file.

4. Start the development server
   ```bash
   pnpm dev
   ```

## 🧪 Testing

Run tests with Jest:

```bash
pnpm test
```

## 📁 Project Structure

```
frontend/
├── public/           # Static files
├── src/
│   ├── api/          # API client and types
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   ├── store/        # Redux store configuration
│   ├── theme/        # MUI theme customization
│   ├── utils/        # Utility functions
│   ├── App.tsx       # Root component
│   └── main.tsx      # Entry point
├── tests/            # Test files
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📬 Contact

Project Link: [https://github.com/uwenayoallain/free-mentors](https://github.com/uwenayoallain/free-mentors)
