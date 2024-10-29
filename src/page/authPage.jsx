import LoginForm from '../component/loginForm.jsx';
import RegisterForm from '../component/registerForm.jsx';

function AuthPage() {
return <>
    <header className="is-flex flex-direction-row">
        <div className="is-flex is-justify-content-end padding-R5 colorBlue">
            <h2 className="text-White">Finance</h2>
        </div>
        <div className="is-flex is-justify-content-start padding-L5">  
            <h2>Wise</h2>
        </div>
    </header>
    <main className="container" >
        <div id="main-2-div-only" className="colorBlue"> 
            <LoginForm />
        </div>
        <div id="main-2-div-only">
            <RegisterForm />
        </div>
    </main>
</>


}

export { AuthPage };
