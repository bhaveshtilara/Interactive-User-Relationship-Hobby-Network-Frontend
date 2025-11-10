import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'reactflow/dist/style.css';
import { GraphProvider } from './context/GraphContext.tsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GraphProvider>
    <App />
    <Toaster position="bottom-right" />
  </GraphProvider>
);