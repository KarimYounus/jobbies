# 🗂 Jobbies - Job Application Manager

A sleek, cross-platform desktop application built with Electron and React for tracking job applications with style and efficiency.

<img width="400" alt="image" src="https://github.com/user-attachments/assets/31622649-0112-4d32-8315-2351ee625404" />

## ✨ Features

- **📝 Application Tracking**: Keep detailed records of each job application
- **📊 Status Management**: Organize applications by status (Applied, Interview, Rejected, Offer, Archived)
- **📎 File Management**: Store and link CV files and cover letters
- **💼 Rich Details**: Track salary, location, application dates, and detailed notes
- **🎯 Application Questions**: Store and review interview questions and your responses
- **🔍 Quick Overview**: Expandable lists with key information at a glance
- **🎨 Modern UI**: Beautiful, responsive interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jobbies.git
cd jobbies

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build and package the application
npm run build
```

This will create distributable packages in the `release/` directory for your platform.

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | Electron + React |
| **UI Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Icons** | Material Design Icons |
| **Typography** | Ivysoft Variable Font |
| **Build Tool** | Vite |
| **Language** | TypeScript |

## 🎯 Usage

### Adding a New Application

1. Click the "Add Job" button in the header
2. Fill in the company details, position, and status
3. Optionally attach your CV and add cover letter content
4. Include any application-specific questions and answers
5. Save to track your application

### Managing Applications

- **View Details**: Click on any job item to see full details
- **Edit Applications**: Use the edit button in the detailed view
- **Filtered by Status**: Expand different status categories to see relevant applications

### Application Statuses

- **Applied**: Recently submitted applications
- **Assessment Stage**: Applications that have progressed to the technical assessment stage
- **Interview Stage**: Applications that have progressed to the interview stage
- **Offer**: Successful applications with job offers
- **No Response**: Where most of my applications end up ...
- **Rejected**: Applications that have been rejected

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production and create distributable packages
- `build:portable`: - Build a portable version without the need for installtion,
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the built application

### Adding New Features

The application follows a modular component architecture:

1. **Components**: Create reusable UI components in `src/components/`
2. **Types**: Define TypeScript interfaces in `src/types/`
3. **Styling**: Use Tailwind CSS classes for consistent styling
4. **Animation**: Implement smooth transitions using Framer Motion

## 🔒 Privacy & Security

- **Offline-First**: All data stored locally, no cloud dependencies
- **No Tracking**: Zero telemetry or user data collection
- **Secure Storage**: Application data stored in user's local app data directory

## 🗂 Data Storage

Currently uses local JSON storage with plans for:
- SQLite database integration
- Optional cloud sync (Firebase)
- Data export/import functionality

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/) and [React](https://reactjs.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations powered by [Framer Motion](https://framer.com/motion/)
- Icons from [Material Design Icons](https://materialdesignicons.com/)

---

*Made with ❤️ for job seekers everywhere*
