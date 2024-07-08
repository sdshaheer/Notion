import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotionProvider } from './context/notionContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <AuthProvider>
      <NotionProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </NotionProvider>
    </AuthProvider>

    <ToastContainer
      className="toast-position"
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    // theme="dark"
    />
  </>

)
