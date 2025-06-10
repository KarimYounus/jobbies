# 🗂 Jobbies - Job Application Manager

A sleek, cross-platform desktop application built with Electron and React for tracking job applications with style and efficiency.

![Jobbies Screenshot](./docs/screenshot.png) <!-- Add screenshot when available -->

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

## 📁 Project Structure

```
jobbies/
├── src/
│   ├── components/          # React components
│   │   ├── AnimatedButton.tsx
│   │   ├── JobList.tsx
│   │   ├── JobListItem.tsx
│   │   └── JobView.tsx
│   ├── types/              # TypeScript type definitions
│   │   ├── job-types.ts
│   │   └── status-types.ts
│   ├── App.tsx             # Main application component
│   └── main.tsx            # React entry point
├── electron/               # Electron main process files
│   ├── main.ts             # Main process
│   └── preload.ts          # Preload script
├── docs/                   # Documentation
└── dist-electron/          # Built Electron files
```

## 🎯 Usage

### Adding a New Application

1. Click the "Add Job" button in the header
2. Fill in the company details, position, and status
3. Optionally attach your CV and add cover letter content
4. Include any application-specific questions and answers
5. Save to track your application

### Managing Applications

- **View Details**: Click on any job card to see full details
- **Edit Applications**: Use the edit button in the detailed view
- **Filter by Status**: Expand different status categories to see relevant applications
- **File Management**: Click on CV previews to view full-size documents

### Application Statuses

- **Applied**: Recently submitted applications
- **Interview**: Applications that have progressed to interview stage
- **Rejected**: Unfortunately declined applications
- **Offer**: Successful applications with job offers
- **Archived**: Completed or outdated applications

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production and create distributable packages
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the built application

### Adding New Features

The application follows a modular component architecture:

1. **Components**: Create reusable UI components in `src/components/`
2. **Types**: Define TypeScript interfaces in `src/types/`
3. **Styling**: Use Tailwind CSS classes for consistent styling
4. **Animation**: Implement smooth transitions using Framer Motion

## 📦 Building & Distribution

The application uses `electron-builder` for packaging:

- **Windows**: Creates NSIS installer (.exe)
- **macOS**: Creates DMG installer
- **Linux**: Creates AppImage

Build artifacts are saved to `release/{version}/` directory.

## 🔒 Privacy & Security

- **Offline-First**: All data stored locally, no cloud dependencies
- **No Tracking**: Zero telemetry or user data collection
- **Secure Storage**: Application data stored in user's local app data directory

## 🗂 Data Storage

Currently uses local JSON storage with plans for:
- SQLite database integration
- Optional cloud sync (Dropbox/Firebase)
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