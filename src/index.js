import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { AuthProvider } from './context/AuthContext'; // ✅ THÊM dòng này

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

        <AuthProvider> {/* ✅ Bọc App tại đây */}
            <App />
        </AuthProvider>

);

reportWebVitals();
