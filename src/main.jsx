import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const App = lazy(() => import('./App.jsx'));

const root = createRoot(document.getElementById('root'));
root.render(
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 dark:text-slate-400">Yükleniyor...</div>}>
    <App />
  </Suspense>
);
