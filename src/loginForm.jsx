import React, {useEffect, useState} from "react"
import "./resources/style.css"
function LoginForm() {

    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const [report, setReport] = useState("")

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleEmail = event => {
        setEmail(event.target.value)
    }

    const handleVisibilityPassword = (event) => {
        event.preventDefault()
        if(isVisible) {
            event.target.textContent = "🔓"
        } else {
            event.target.textContent = "🔒"
        }
        setIsVisible(!isVisible)
    }

    useEffect(() => {
        if (password.length >= 6 && email.length > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [password, email]);

    const login = async (email, password) => {
        return fetch('http://localhost:8080/financewise/auth/authenticate', {method: 'POST',  headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({
            email: email,
            password: password
          })}).then(response => {
            if (!response.ok) {
                if(response.status === 403) {
                    throw new Error("Erreur : 403") ;
                }
                throw new Error('Erreur HTTP POST : ' + response.status + ' Message : ' + response.message) ;
            }
            return response.json();
          }).then(data => {
            localStorage.setItem("TOKEN", data.token)
            localStorage.setItem("EMAIL", email)
            window.location.href = '../home.html';
          }).catch(error => {
            if(error.message === "Erreur : 403") {
                setReport("Erreur de connexion : Veuillez vérifier vos identifiants.")
            } else {
                setReport("Erreur de connexion : Service injoignable.") 
            }
            document.getElementById('error-Text-login').setAttribute("class", "error-text")
          });
      }

    const handleSubmition = (event) => {
        event.preventDefault()
        login(email, password)
    }

    return <div className="colorBlue centerColumn  maxWidth50" >
            <form className="centerColumn" onSubmit={handleSubmition}>
                <h2 id="error-Text-login">{report}</h2>
                <label className="text-White marginB3">Email
                    <input type="email" required="required" maxLength="250" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" className="backBlueTextWhtie marginT3" value={email} onChange={handleEmail} autoComplete="of"></input>
                </label>
                <label className="text-White">Mot de passe
                    <div className="inputButton marginB5 marginT3">
                        <input type={isVisible ? "text" : "password"} value={password} required="required" minLength="6" pattern="^[^<>&]*$" onChange={handlePassword} className="backBlueTextWhtie marginR5 width80" placeholder="******"></input><button type="button" id="btnPswShow" onClick={handleVisibilityPassword} className="colorBlue borderWhite rounded25">🔓</button>
                    </div>
                </label>
                <button type="submit" className="btnBlue" disabled={isDisabled} style={{ opacity: isDisabled ? 0.3 : 1}}>Confirmer</button>
            </form>
        </div>
}

export default LoginForm
