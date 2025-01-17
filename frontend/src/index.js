import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';

// Create a root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
