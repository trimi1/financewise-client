import {useEffect, useState } from "react";
import { Link } from 'react-router-dom';


function Header() {

    const [fullname, setFullName] = useState("")
    const getFullName = async () => {
        let url = `http://localhost:8080/financewise/users/${localStorage.getItem("IDUSER")}?fields=firstName,lastName`
        let token = localStorage.getItem("TOKEN")
        return fetch(url, {method: 'GET',  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}}).then(response => {
            if (!response.ok) {
                //setReport(`Error STATUS : ${response.status}`)
                throw new Error('Erreur HTTP POST : ' + response.status + ' Message : ' + response.message) ;
            }
            return response.json();
          }).then(data => {
            setFullName(data.firstName + ' ' + data.lastName)
        }).catch(error => {
            console.log(error.message)
        });
    }

    useEffect(() => {
        getFullName()
    }, []);

    return <header className="is-justify-content-space-between">
    <div id="name-project-link" className="is-flex is-align-items-center is-justify-content-center colorBlue">
        <Link to="/home" className="is-flex is-justify-content-center is-align-items-center text-size-1-3 text-White">Finance Wise</Link>
    </div>
    <li className="is-flex is-justify-content-center is-align-items-center text-size-1-3 marginR1"><a>{fullname || 'Chargement...'}</a></li>
</header>
}

export default Header