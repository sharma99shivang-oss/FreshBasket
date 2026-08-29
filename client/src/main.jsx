import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './redux/store';
import { Toaster } from 'react-hot-toast';
import { restoreAuth } from './redux/slices/authSlice';
import './styles/index.css';

store.dispatch(restoreAuth());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
