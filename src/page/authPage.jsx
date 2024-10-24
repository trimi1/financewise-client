import LoginForm from '../component/loginForm.jsx';
import RegisterForm from '../component/registerForm.jsx';

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
