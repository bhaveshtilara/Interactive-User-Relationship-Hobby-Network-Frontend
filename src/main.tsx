import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'reactflow/dist/style.css';

// 1. Import our new provider
import { GraphProvider } from './context/GraphContext.tsx';

// 2. Import the toast provider for notifications
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. Wrap the App with the GraphProvider */}
    <GraphProvider>
      <App />
      <Toaster position="bottom-right" />
    </GraphProvider>
  </React.StrictMode>
);