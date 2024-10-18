import React, {useEffect, useState} from "react"
import "./resources/style.css"
function RegisterForm() {

    const [passwordConnexion, setPasswordConnexion] = useState("")
    const [isVisiblePswConnexion, setIsVisiblePswConnexion] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false)
    const [passwordRegister, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isDisabled, setIsDisabled] = useState(true)
    const [report, setReport] = useState("")

    const handlePasswordConnexion = (event) => {
        setPasswordConnexion(event.target.value)
    }

    const handleDisplayPasswordConnexion = (event) => {
        event.preventDefault()
        if(isVisiblePswConnexion) {
            event.target.textContent = "🔓"
        } else {
            event.target.textContent = "🔒"
        }
        setIsVisiblePswConnexion(!isVisiblePswConnexion)
    }

    const handleDisplayPassword = (event) => {
        event.preventDefault()
        if(isVisible) {
            event.target.textContent = "🔓"
        } else {
            event.target.textContent = "🔒"
        }
        setIsVisible(!isVisible)
    }
    const handleDisplayPasswordConfirm = (event) => {
        event.preventDefault()
        if(isVisibleConfirm) {
            event.target.textContent = "🔓"
        } else {
            event.target.textContent = "🔒"
        }
        setIsVisibleConfirm(!isVisibleConfirm)
    }

    useEffect(() => {
        if(passwordRegister.length < 6 ||  confirmPassword.length < 6) {
            setReport("Mot de passe trop court ! " + "Password : " + passwordRegister + " longeur :" + passwordRegister.length + " Password Confirm : "+ confirmPassword + " longeur :" + confirmPassword.length)
            return
        }
        if(passwordRegister === confirmPassword) {
            setReport("Confirmation désactiver")
            setIsDisabled(false)
        } 
        if(isDisabled === false && passwordRegister !== confirmPassword) {
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




    return <main className="container">
        <div className="colorBlue centerColumn  maxWidth50" >
            <form className="centerColumn">
                <label className="textWhite marginB3">Email
                    <input type="email" required="required" className="backBlueTextWhtie marginT3"></input>
                </label>
                <label className="textWhite">Mot de passe
                    <div className="inputButton marginB5 marginT3">
                        <input type={isVisiblePswConnexion ? "text" : "password"} value={passwordConnexion} required="required" minLength="6" onChange={handlePasswordConnexion} className="backBlueTextWhtie marginR5 width80" placeholder="******"></input><button type="button" id="btnPswShow" onClick={handleDisplayPasswordConnexion} className="colorBlue borderWhite rounded25">🔓</button>
                    </div>
                </label>
                <button type="submit" className="btnBlue" disabled={isDisabled}>Confirmer</button>
            </form>
        </div>
        <div className="centerColumn maxWidth50">
            <form className="centerColumn">
                <div className="flexRow width80">
                    <label className="marginR5">nom
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
                        <input type={isVisible ? "text" : "password"} value={passwordRegister} required="required" minLength="6" onChange={handlePassword} className="backWiheTextBlack marginR5 width80"></input><button type="button" id="btnPswRegister" onClick={handleDisplayPassword} className="colorBlue borderBlack rounded25">🔓</button>
                    </div>
                </label>
                <label className="marginB5">Confirmer votre mot de passe
                    <div className="inputButton marginB5">
                        <input type={isVisibleConfirm ? "text" : "password"} value={confirmPassword} required="required" minLength="6" onChange={handleConfirmPassword} className="backWiheTextBlack marginR5 width80"></input><button type="button" id="btnPswConfirmRegister" onClick={handleDisplayPasswordConfirm} className="colorBlue borderBlack rounded25">🔓</button>
                    </div>
                </label>
                <button type="submit" disabled={isDisabled} className="btnWhite">Confirmer</button>
            </form>
        </div>
    </main>
}

export default RegisterForm
