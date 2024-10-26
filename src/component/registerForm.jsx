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

    const handleVisibilityPassword = (event) => {
        event.preventDefault();
        event.target.textContent = isVisible ? "🔓" : "🔒";
        setIsVisible(!isVisible);
    };

    const handleVisibilityPswdConfirm = (event) => {
        event.preventDefault();
        event.target.textContent = isVisibleConfirm ? "🔓" : "🔒";
        setIsVisibleConfirm(!isVisibleConfirm);
    };

    useEffect(() => {
        if (password.length >= 6 && confirmPassword.length >= 6 && password === confirmPassword) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [password, confirmPassword]);

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
                if (response.status === 403) {
                    throw new Error("Erreur : 403");
                }
                throw new Error(`Erreur HTTP POST : ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem("TOKEN", data.token);
            localStorage.setItem("IDUSER", data.idUser)
            navigate("/home");
        } catch (error) {
            setReport(
                error.message === "Erreur : 403"
                    ? "Erreur de connexion : Veuillez vérifier vos identifiants."
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
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
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
                            minLength="6"
                            pattern="^[^<>&]*$"
                            onChange={(e) => setPassword(e.target.value)}
                            className="backWiheTextBlack marginR5 width80"
                        />
                        <button
                            type="button"
                            onClick={handleVisibilityPassword}
                            className="colorBlue borderBlack rounded25"
                        >
                            🔓
                        </button>
                    </div>
                </label>
                <label className="marginB5">
                    Confirmer votre mot de passe
                    <div className="inputButton marginB5">
                        <input
                            type={isVisibleConfirm ? "text" : "password"}
                            value={confirmPassword}
                            required
                            minLength="6"
                            pattern="^[^<>&]*$"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="backWiheTextBlack marginR5 width80"
                        />
                        <button
                            type="button"
                            onClick={handleVisibilityPswdConfirm}
                            className="colorBlue borderBlack rounded25"
                        >
                            🔓
                        </button>
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
