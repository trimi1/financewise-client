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

    const handleSubmition = (event) => {
        event.preventDefault()
        setReport(`Email : ${email} Password : ${password}`)
    }

    return <div className="colorBlue centerColumn  maxWidth50" >
            <form className="centerColumn" onSubmit={handleSubmition}>
                <label className="textWhite marginB3">Email
                    <input type="email" required="required" className="backBlueTextWhtie marginT3" value={email} onChange={handleEmail}></input>
                </label>
                <label className="textWhite">Mot de passe
                    <div className="inputButton marginB5 marginT3">
                        <input type={isVisible ? "text" : "password"} value={password} required="required" minLength="6" onChange={handlePassword} className="backBlueTextWhtie marginR5 width80" placeholder="******"></input><button type="button" id="btnPswShow" onClick={handleVisibilityPassword} className="colorBlue borderWhite rounded25">🔓</button>
                    </div>
                </label>
                <button type="submit" className="btnBlue" disabled={isDisabled} style={{ opacity: isDisabled ? 0.3 : 1}}>Confirmer</button>
                
            </form>
            <h2>{report}</h2>
        </div>
}

export default LoginForm
