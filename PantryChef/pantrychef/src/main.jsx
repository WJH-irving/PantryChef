import { createRoot } from 'react-dom/client'
import 'lib-flexible' // 移动端适配
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '@/store/auth'
import{
  BrowserRouter as Router,
} from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
 </>
)
