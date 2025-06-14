import './App.css';
import Layout from './components/Layout';
import BraceletView from './views/BraceletView';
import EarringsView from './views/EarringsView';
import HomeView from './views/HomeView';
import NecklaceView from './views/NecklaceView';
import RingsView from './views/RingsViews';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WatchesView from './views/WatchesView';
import NewArrivalsView from './views/NewArrivalsView';
import LoginView from './views/LoginView';
import { AuthProvider } from './context/AuthContext';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import SignUpView from './views/SignUpView';
import NotFoundView from './views/NotFoundView';
import LayoutAdmin from './components/LayoutAdmin';
import AdminView from './views/AdminView';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/slices/userSlice';
import CategoryView from './views/CategoryView';
import ItemDetailView from './views/ItemsView';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if(user) {
      const userData = JSON.parse(user);
      dispatch(setUser({
        data: userData,
        isAdmin: userData.rol === 'admin'
      }));
    }
  }, [dispatch]);

  return (
    <AuthProvider>
      <ToastContainer position="bottom-right" />
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/sign-up"
            element={
              <PublicOnlyRoute>
                <SignUpView />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginView />
              </PublicOnlyRoute>
            }
          />

          {/* Rutas protegidas o con layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/category/:categoryId" element={<CategoryView/>} />
            <Route path="/item/:id" element={<ItemDetailView/>} />
          </Route>

          <Route element={<LayoutAdmin />}>
            <Route path="/admin" element={<AdminView />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
