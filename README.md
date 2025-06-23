# MERN Stack Blog - Client Side

A modern React-based blog application client that provides a clean interface for creating, reading, updating, and deleting blog posts.

## 🚀 Tech Stack

- **React 19.1.0** - Frontend framework
- **React Router DOM 7.6.2** - Client-side routing
- **Axios 1.10.0** - HTTP client for API requests
- **React Icons 5.5.0** - Icon library
- **CSS Modules** - Scoped styling
- **Create React App** - Build tooling

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   └── header/         # Navigation header
│   ├── context/           # Global state management
│   ├── pages/             # Route components
│   │   ├── home/          # Blog list view
│   │   ├── add-blog/      # Create/Edit blog form
│   │   └── contact/       # Contact page
│   ├── App.js             # Main app component
│   └── index.js           # App entry point
├── package.json
└── README.md
```

## 🔄 Data Flow

### State Management
- **Global Context** (`src/context/index.jsx`) manages application-wide state:
  - `formData` - Blog form inputs (title, description)
  - `blogList` - Array of blog posts
  - `pending` - Loading state
  - `isEdit` - Edit mode flag

### API Integration
- **Base URL**: `http://localhost:5011/api/blogs/`
- **Endpoints**:
  - `GET /` - Fetch all blogs
  - `POST /add` - Create new blog
  - `PUT /update/:id` - Update existing blog
  - `DELETE /delete/:id` - Delete blog

### Component Flow
1. **Header** - Navigation between pages
2. **Home** - Displays blog list with edit/delete actions
3. **Add Blog** - Form for creating/editing blogs
4. **Contact** - Static contact information

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 5011

### Installation Steps

1. **Clone and navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open browser**
   - Application runs on `http://localhost:3000`
   - Ensure backend server is running on `http://localhost:5011`

## 📜 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm run analyze` - Analyze bundle size

## 🌐 Routes

- `/` - Home page (blog list)
- `/add-blog` - Create new blog or edit existing
- `/contact` - Contact information

## 🔧 Key Features

### Blog Management
- **Create** - Add new blog posts with title and description
- **Read** - View all blogs in a responsive list
- **Update** - Edit existing blogs inline
- **Delete** - Remove blogs with confirmation

### User Experience
- Loading states during API calls
- Form validation and error handling
- Responsive design with CSS modules
- Icon-based actions (edit/delete)

## 🔗 Backend Integration

The client expects a REST API backend with the following contract:

```javascript
// GET /api/blogs/ - Returns array of blogs
[
  {
    _id: "string",
    title: "string", 
    description: "string"
  }
]

// POST /api/blogs/add - Create blog
// PUT /api/blogs/update/:id - Update blog
// DELETE /api/blogs/delete/:id - Delete blog
```

## 🎨 Styling

- **CSS Modules** for component-scoped styles
- **Responsive design** for mobile and desktop
- **Clean, minimal UI** with focus on readability

## 🚀 Production Build

```bash
npm run build
```

Creates optimized production build in `build/` directory ready for deployment.

## 📝 Development Notes

- Uses React 19 with latest features
- Context API for state management (no Redux needed)
- Functional components with hooks
- Modern ES6+ JavaScript syntax
- Error boundaries and loading states implemented