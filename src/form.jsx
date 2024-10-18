import React, {useEffect, useState} from "react"
import "./resources/style.css"
function RegisterForm() {

    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isDisabled, setIsDisabled] = useState(true)
    const [report, setReport] = useState("")

    const handleDisplayPassword = (event) => {
        event.preventDefault()
        setIsVisible(!isVisible)
    }
    const handleDisplayPasswordConfirm = (event) => {
        event.preventDefault()
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




    return <main className="container">
        <div className="colorBlue centerColumn left" >
            <form className="centerColumn">
                <label className="textWhite">Email
                    <input type="email" required="required" className="backBlueTextWhtie"></input>
                </label>
                <label className="textWhite">Mot de passe
                    <div className="inputButton marginB5">
                        <input type={isVisible ? "text" : "password"} value={password} required="required" minLength="6" onChange={handlePassword} className="backBlueTextWhtie marginR5 width80"></input><button type="button" onClick={handleDisplayPassword}>📌</button>
                    </div>
                </label>
                <button type="submit" className="btnBlue" disabled={isDisabled}>Confirmer</button>
            </form>
        </div>
        <div className="centerColumn right">
            <form className="centeColumn">
                <div style={{display : "flex", flexDirection : "row"}}>
                    <label style={{display : "flex", flexDirection: "column"}} className="marginR5">nom
                        <input type="text" id="nomInput" required="required" className="backWiheTextBlack"></input>
                    </label>
                    <label>Prénom
                        <input type="text" required="required" className="backWiheTextBlack"></input>
                    </label>
                </div>
                <label>Email
                    <input type="email" required="required" className="backWiheTextBlack"></input>
                </label>
                <label>Mot de passe
                    <div className="inputButton marginB5">
                        <input type={isVisible ? "text" : "password"} value={password} required="required" minLength="6" onChange={handlePassword} className="backWiheTextBlack marginR5 width80"></input><button type="button" onClick={handleDisplayPassword}>📌</button>
                    </div>
                </label>
                <label className="marginB5">Confirmer votre mot de passe
                    <div className="inputButton marginB5">
                        <input type={isVisibleConfirm ? "text" : "password"} value={confirmPassword} required="required" minLength="6" onChange={handleConfirmPassword} className="backWiheTextBlack marginR5 width80"></input><button type="button" onClick={handleDisplayPasswordConfirm}>📌</button>
                    </div>
                </label>
                <button type="submit" disabled={isDisabled} className="btnWhite">Confirmer</button>
            </form>
        </div>
    </main>
}

export default RegisterForm
