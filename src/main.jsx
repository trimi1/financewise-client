import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginForm from './loginForm.jsx'
import RegisterForm from './registerForm.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main className="container">
      <LoginForm />
      <RegisterForm />
    </main>
  </StrictMode>,
)
