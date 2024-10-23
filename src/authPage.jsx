import LoginForm from './loginForm.jsx';
import RegisterForm from './registerForm.jsx';

function AuthPage() {
return <main className="container" >
            <div className="colorBlue centerColumn maxWidth50"> 
                <LoginForm />
            </div>
            <div className="centerColumn maxWidth50">
                <RegisterForm />
            </div>
        </main>
}

export default AuthPage;
