import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../resources/style.css";

function LoginForm() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [report, setReport] = useState("");

    let regexProtection = /^[^<>&]*$/;
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,100}$/;

    const navigate = useNavigate();

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleVisibilityPassword = (event) => {
        event.preventDefault();
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        console.log("REGEX PROTECTION : " + regexProtection.test(password) + " / REGEX PASSWORD : " + regexPassword.test(password))
        if (regexEmail.test(email) && regexPassword.test(password)) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [password, email]);

    const login = async (email, password) => {
        return fetch('http://localhost:8080/financewise/auth/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 404) {
                        console.log(response.status)
                        throw new Error("Erreur : client");
                    }
                    throw new Error('Erreur HTTP POST : ' + response.status + ' Message : ' + response.message);
                }
                return response.json();
            })
            .then((data) => {
                localStorage.setItem("TOKEN", data.token);
                localStorage.setItem("IDUSER", data.idUser)
                navigate("/home");
            })
            .catch((error) => {
                if (error.message === "Erreur : client" ) {
                    setReport("Erreur de connexion : Veuillez vérifier vos identifiants.");
                } else {
                    setReport("Erreur de connexion : Service injoignable.");
                }
                document.getElementById('error-Text-login').setAttribute("class", "error-text");
            });
    };

    const handleSubmition = (event) => {
        event.preventDefault();
        login(email, password);
    };

    return ( <form onSubmit={handleSubmition}>
                <h2 id="error-Text-login">{report}</h2>
                <label className="text-White marginB3">
                    Email
                    <input
                        type="email"
                        required="required"
                        maxLength="250"
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        className="backBlueTextWhtie marginT3"
                        value={email}
                        onChange={handleEmail}
                        autoComplete="off"
                    />
                </label>
                <label className="text-White">
                    Mot de passe
                    <div className="inputButton marginB5 marginT3 is-flex is-align-items-center">
                        <input
                            type={isVisible ? "text" : "password"}
                            value={password}
                            required="required"
                            minLength="7"
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,100}$"
                            onChange={handlePassword}
                            className="backBlueTextWhtie marginR5 width80"
                            placeholder="******"
                        />
                        <img src={`./src/icon/${isVisible ? "hidden.png" : "visible.png"}`} onClick={handleVisibilityPassword}/>
                            
                    </div>
                </label>
                <button
                    type="submit"
                    className="btnBlue"
                    disabled={isDisabled}
                    style={{ opacity: isDisabled ? 0.3 : 1 }}
                >
                    Confirmer
                </button>
            </form>
    );
}

export default LoginForm;
