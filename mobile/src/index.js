import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // 从根目录的 App.js 导入

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
