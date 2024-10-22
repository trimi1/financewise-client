import React, {useEffect, useState} from "react"
import "./resources/style.css"
function RegisterForm() {

    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isDisabled, setIsDisabled] = useState(true)
    const [report, setReport] = useState("")

    const handleVisibilityPassword = (event) => {
        event.preventDefault()
        if(isVisible) {
            event.target.textContent = "🔓"
        } else {
            event.target.textContent = "🔒"
        }
        setIsVisible(!isVisible)
    }
    const handleVisibilityPswdConfirm = (event) => {
        event.preventDefault()
        if(isVisibleConfirm) {
            event.target.textContent = "🔓"
        } else {
            event.target.textContent = "🔒"
        }
        setIsVisibleConfirm(!isVisibleConfirm)
    }

    useEffect(() => {
        if(password.length < 6 ||  confirmPassword.length < 6) {
            // voir pour modifier le style css
            return
        }
        if(password === confirmPassword) {
            setIsDisabled(false)
        } 
        if(isDisabled === false && password !== confirmPassword) {
            setIsDisabled(true)
        }
    });

    const handleFirstName = (event) => {
        setFirstName(event.target.value)
    }

    const handleLastName = (event) => {
        setLastName(event.target.value)
    }

    const handleEmail = (event) => {
        setEmail(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleConfirmPassword = (event) => {
        setConfirmPassword(event.target.value)
    }

    const register = async (firstName, lastName, email, password) => {
        return fetch('http://localhost:8080/financewise/auth/register', {method: 'POST',  headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({
            firstName : firstName,
            lastName :  lastName,
            email : email,
            password : password
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
            document.getElementById('error-Text-register').setAttribute("class", "error-text")
          });
      }

    const handleSubmition = (event) => {
        event.preventDefault()
        register(firstName, lastName, email, password)
    }

    return  <div className="centerColumn maxWidth50">
                <form className="centerColumn" onSubmit={handleSubmition}> 
                    <h2 id="error-Text-register">{report}</h2>
                    <div className="flexRow width80">
                        <label className="marginR5">Nom
                            <input type="text" id="inputSecondNameRegister" required="required" className="backWiheTextBlack" maxLength="100" pattern="^[^<>&]*$" value={firstName} onChange={handleFirstName} autoComplete="of"></input>
                        </label>
                        <label>Prénom
                            <input type="text" id="inputFirstNameRegister" required="required" className="backWiheTextBlack" maxLength="100" pattern="^[^<>&]*$" value={lastName} onChange={handleLastName} autoComplete="of"></input>
                        </label>
                    </div>
                    <label>Email
                        <input type="email" required="required" className="backWiheTextBlack" maxLength="250" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" value={email} onChange={handleEmail} autoComplete="of"></input>
                    </label>
                    <label>Mot de passe
                        <div className="inputButton marginB5">
                            <input type={isVisible ? "text" : "password"} value={password} required="required" minLength="6" pattern="^[^<>&]*$" onChange={handlePassword} className="backWiheTextBlack marginR5 width80"></input><button type="button" id="btnPswRegister" onClick={handleVisibilityPassword} className="colorBlue borderBlack rounded25">🔓</button>
                        </div>
                    </label>
                    <label className="marginB5">Confirmer votre mot de passe
                        <div className="inputButton marginB5">
                            <input type={isVisibleConfirm ? "text" : "password"} value={confirmPassword} required="required" minLength="6" pattern="^[^<>&]*$" onChange={handleConfirmPassword} className="backWiheTextBlack marginR5 width80"></input><button type="button" id="btnPswConfirmRegister" onClick={handleVisibilityPswdConfirm} className="colorBlue borderBlack rounded25">🔓</button>
                        </div>
                    </label>
                    <button type="submit" disabled={isDisabled} className="btnWhite" style={{ opacity: isDisabled ? 0.3 : 1}}>Confirmer</button>
                </form>
            </div>
}

export default RegisterForm
