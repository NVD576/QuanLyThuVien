// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BookProvider } from './contexts/BookContext.jsx'; // Import Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BookProvider> {/* Bọc App trong Provider */}
      <App />
    </BookProvider>
  </React.StrictMode>,
)
