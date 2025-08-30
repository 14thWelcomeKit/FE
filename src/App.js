import RouterComponent from './router';
import './App.css';
import GlobalStyle from './GlobalStyles';
import { AuthProvider } from './AuthContext';
import PWAInstall from './components/PWAInstall';

function App() {
  return (
  <>
    <AuthProvider>
      <GlobalStyle />
      <RouterComponent />
      <PWAInstall />
    </AuthProvider>
  </>);
}

export default App;
