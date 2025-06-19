

# 🗂 'Jobbies' - Job Application Manager Project Specification

## 🧭 Purpose

Jobbies is an Electron-based desktop application for tracking job applications. It is intended to help me keep a clear record of each application submitted, including the specific CV and cover letter used, and its current status in the process.

---

## 🧑‍💻 Target User

- Myself - A software engineer graduate applying to companies

- Primarily designed for personal use on Windows and macOS.

---

## 🚀 Key Features

### 1. **Add New Application**

- Fields:
  
   - **Company name** (string)
  
   - **Position title** (string)
  
   - **Application date** (date)
  
   - **Status** (dropdown: Ongoing, Rejected, Interview, Offer, Archived)
  
   - **CV file** (PDF file path; stored or linked)
  
   - **Cover letter** (either PDF file path, or rich text stored in app)
  
   - **Notes** (optional free-text)

### 2. **Application Listing**

- View a list of all applications.

- Click into each item to view full details.

### 3. **Status Filtering**

- Filter the application list by status (e.g., only show “Ongoing” applications).

### 4. **Edit / Archive / Delete Application**

- Update details or change status.

- Archive or delete old entries if desired.

---

## 📁 File Handling

- CV and cover letter PDFs can be:
  
   - Stored in a managed folder (e.g., `~/JobAppManagerFiles`)
  
   - Or referenced by original file path (configurable later)

- Metadata about applications is stored in:
  
   - **Phase 1**: Local JSON or SQLite DB file in user data directory
  
   - **Phase 2 (optional)**: Cloud sync via Dropbox or Firebase

---

## 🖥 Platform & Tech Stack

| Layer             | Choice                                                       |
| ----------------- | ------------------------------------------------------------ |
| Desktop Platform  | Electron                                                     |
| UI Framework      | React + Tailwind CSS                                         |
| App Bootstrap     | [`electron-vite`](https://github.com/alex8088/electron-vite) |
| State Management  | React Context or Zustand                                     |
| Storage (Local)   | JSON or SQLite                                               |
| IPC Communication | Electron's IPC via preload bridge                            |
| Packaging         | `electron-builder`                                           |

---

## 📦 Future Enhancements (Optional)

- 🔄 **Cloud sync**: Firebase or Dropbox support

- 📆 **Timeline view**: Visualize progress over time

- 📎 **Attachment preview**: Quick view of PDFs in app

- 🔔 **Reminders**: Follow-up dates or notification system

- 🧠 **Tagging system**: e.g., "Remote", "Tech", "Urgent"

---

## ✍️ Development Milestones

1. **Core UI and Entry Form** (React + Tailwind)

2. **File picker integration** (CV and cover letter)

3. **Data storage logic** (JSON or SQLite)

4. **Basic status filtering and editing**

5. **App packaging for Windows and macOS**

---

## 📄 Specification Notes

- **Security**: No sensitive data is sent to the cloud by default.

- **Offline-first**: Entire app works without an internet connection.

- **Modular design**: Aim for maintainability and simple extension.


