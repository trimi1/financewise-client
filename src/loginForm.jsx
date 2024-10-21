import React, {useEffect, useState} from "react"
import axios from "axios"
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
                //setReport(`Error STATUS : ${response.status}`)
                throw new Error('Erreur HTTP POST : ' + response.status + ' Message : ' + response.message) ;
            }
            return response.json();
          }).then(data => {
            localStorage.setItem("TOKEN", data.token)
            window.location.href = '../home.html';
          }).catch(error => {
            setReport(`${error.message}`);
          });
      }

    const handleSubmition = (event) => {
        event.preventDefault()
        login(email, password)

    }

    return <div className="colorBlue centerColumn  maxWidth50" >
            <form className="centerColumn" onSubmit={handleSubmition}>
                <label className="textWhite marginB3">Email
                    <input type="email" required="required" maxLength="100" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" className="backBlueTextWhtie marginT3" value={email} onChange={handleEmail} ></input>
                </label>
                <label className="textWhite">Mot de passe
                    <div className="inputButton marginB5 marginT3">
                        <input type={isVisible ? "text" : "password"} value={password} required="required" minLength="6" pattern="^[^<>&]*$" onChange={handlePassword} className="backBlueTextWhtie marginR5 width80" placeholder="******"></input><button type="button" id="btnPswShow" onClick={handleVisibilityPassword} className="colorBlue borderWhite rounded25">🔓</button>
                    </div>
                </label>
                <button type="submit" className="btnBlue" disabled={isDisabled} style={{ opacity: isDisabled ? 0.3 : 1}}>Confirmer</button>
                
            </form>
            <h2>{report}</h2>
        </div>
}

export default LoginForm
