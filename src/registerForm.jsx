import React, {useEffect, useState} from "react"
import "./resources/style.css"
function RegisterForm() {

    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false)
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
            setReport("Mot de passe trop court ! " + "Password : " + password + " longeur :" + password.length + " Password Confirm : "+ confirmPassword + " longeur :" + confirmPassword.length)
            return
        }
        if(password === confirmPassword) {
            setReport("Confirmation désactiver")
            setIsDisabled(false)
        } 
        if(isDisabled === false && password !== confirmPassword) {
            setReport("Confirmation actif")
            setIsDisabled(true)
        }
    });

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleConfirmPassword = (event) => {
        setConfirmPassword(event.target.value)
    }

    return  <div className="centerColumn maxWidth50">
                <form className="centerColumn">
                    <div className="flexRow width80">
                        <label className="marginR5">Nom
                            <input type="text" id="inputSecondNameRegister" required="required" className="backWiheTextBlack"></input>
                        </label>
                        <label>Prénom
                            <input type="text" id="inputFirstNameRegister" required="required" className="backWiheTextBlack"></input>
                        </label>
                    </div>
                    <label>Email
                        <input type="email" required="required" className="backWiheTextBlack"></input>
                    </label>
                    <label>Mot de passe
                        <div className="inputButton marginB5">
                            <input type={isVisible ? "text" : "password"} value={password} required="required" minLength="6" onChange={handlePassword} className="backWiheTextBlack marginR5 width80"></input><button type="button" id="btnPswRegister" onClick={handleVisibilityPassword} className="colorBlue borderBlack rounded25">🔓</button>
                        </div>
                    </label>
                    <label className="marginB5">Confirmer votre mot de passe
                        <div className="inputButton marginB5">
                            <input type={isVisibleConfirm ? "text" : "password"} value={confirmPassword} required="required" minLength="6" onChange={handleConfirmPassword} className="backWiheTextBlack marginR5 width80"></input><button type="button" id="btnPswConfirmRegister" onClick={handleVisibilityPswdConfirm} className="colorBlue borderBlack rounded25">🔓</button>
                        </div>
                    </label>
                    <button type="submit" disabled={isDisabled} className="btnWhite" style={{ opacity: isDisabled ? 0.3 : 1}}>Confirmer</button>
                </form>
            </div>
}

export default RegisterForm
