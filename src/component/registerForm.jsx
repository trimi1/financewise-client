import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../resources/style.css";

function RegisterForm() {
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [report, setReport] = useState("");

    const navigate = useNavigate();

    let regexProtection = /^[^<>&]*$/;
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,100}$/;

    const handleVisibilityPassword = () => {
        setIsVisible(!isVisible);
    };

    const handleVisibilityPswdConfirm = () => {
        setIsVisibleConfirm(!isVisibleConfirm);
    };

    useEffect(() => {
        if (regexEmail.test(email) && regexProtection.test(password) && regexPassword.test(password)  && password === confirmPassword) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [email, password, confirmPassword]);

    const register = async (firstName, lastName, email, password) => {
        try {
            const response = await fetch("http://localhost:8080/financewise/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                if (response.status === 500) {
                    console.log(response)
                    throw new Error("Erreur : 500");
                }
                throw new Error(`Erreur HTTP POST : ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem("TOKEN", data.token);
            localStorage.setItem("IDUSER", data.idUser)
            navigate("/home");
        } catch (error) {
            setReport(
                error.message === "Erreur : 500"
                    ? "Une erreur est survenue lors de votre enregistrement. Veuillez réessayer."
                    : "Erreur de connexion : Service injoignable."
            );
            document.getElementById("error-Text-register").className = "error-text";
        }
    };

    const handleSubmition = (event) => {
        event.preventDefault();
        register(firstName, lastName, email, password);
    };

    return (<form onSubmit={handleSubmition}>
                <h2 id="error-Text-register">{report}</h2>
                <div id="tow-label-one-row">   
                    <label className="marginR5">
                        Nom
                        <input
                            type="text"
                            required
                            className="backWiheTextBlack"
                            maxLength="100"
                            pattern="^[^<>&]*$"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="off"
                        />
                    </label>
                    <label>
                        Prénom
                        <input
                            type="text"
                            required
                            className="backWiheTextBlack"
                            maxLength="100"
                            pattern="^[^<>&]*$"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="off"
                        />
                    </label>
                </div>
                <label>
                    Email
                    <input
                        type="email"
                        required
                        className="backWiheTextBlack"
                        maxLength="250"
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"
                    />
                </label>
                <label>
                    Mot de passe
                    <div className="inputButton marginB5">
                        <input
                            type={isVisible ? "text" : "password"}
                            value={password}
                            required
                            minLength="7"
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,100}$"
                            onChange={(e) => setPassword(e.target.value)}
                            className="backWiheTextBlack marginR5 width80"
                        />
                        <img src={`./src/icon/${isVisible ? "hidden.png" : "visible.png"}`} onClick={handleVisibilityPassword} />
                    </div>
                </label>
                <label className="marginB5">
                    Confirmer votre mot de passe
                    <div className="inputButton marginB5">
                        <input
                            type={isVisibleConfirm ? "text" : "password"}
                            value={confirmPassword}
                            required
                            minLength="7"
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,100}$"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="backWiheTextBlack marginR5 width80"
                        />
                        <img src={`./src/icon/${isVisibleConfirm ? "hidden.png" : "visible.png"}`} onClick={handleVisibilityPswdConfirm} />
                    </div>
                </label>
                <button
                    type="submit"
                    disabled={isDisabled}
                    className="btnWhite"
                    style={{ opacity: isDisabled ? 0.3 : 1 }}
                >
                    Confirmer
                </button>
            </form>
    );
}

export default RegisterForm;
