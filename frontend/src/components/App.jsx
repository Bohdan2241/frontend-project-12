import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import ChatPage from './ChatPage/ChatPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import NotFoundPage from './NotFoundPage';
import { AuthContext } from '../contexts';
import { useAuth } from '../hooks';
import routes from '../routes';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(
    currentUser ? { username: currentUser.username } : null
  );
  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        getAuthHeader,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return auth.user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();

  return auth.user && <Button onClick={auth.logOut}>{t('logout')}</Button>;
};

const App = () => {
  const { t } = useTranslation();

  return (
    <>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column h-100">
            <Navbar className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
              <div className="container">
                <Navbar.Brand as={Link} to={routes.chatPagePath()}>
                  {t('hexletChat')}
                </Navbar.Brand>
                <AuthButton />
              </div>
            </Navbar>

            <Routes>
              <Route
                path={routes.chatPagePath()}
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
              <Route path={routes.loginPagePath()} element={<LoginPage />} />
              <Route path={routes.signupPagePath()} element={<SignupPage />} />
            </Routes>
            <ToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;