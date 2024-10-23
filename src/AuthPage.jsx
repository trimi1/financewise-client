import LoginForm from './loginForm.jsx';
import RegisterForm from './registerForm.jsx';

function AuthPage() {
    return (
        <div className="auth-container">
            <div className="auth-form">
                <LoginForm />
            </div>
            <div className="auth-form">
                <RegisterForm />
            </div>
        </div>
    );
}

export default AuthPage;
