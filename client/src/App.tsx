import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import './App.css';
import { defaultToastStyle } from './utils/toastStyles';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0f1014] text-white">
          <ToastContainer
            position={defaultToastStyle.position}
            autoClose={defaultToastStyle.autoClose}
            hideProgressBar={defaultToastStyle.hideProgressBar}
            newestOnTop
            closeOnClick={defaultToastStyle.closeOnClick}
            rtl={false}
            pauseOnFocusLoss
            draggable={defaultToastStyle.draggable}
            pauseOnHover={defaultToastStyle.pauseOnHover}
            theme="dark"
            aria-label="toast-notifications"
            className="font-mono"
          />
          <Navbar />
          <main className="pb-12">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
