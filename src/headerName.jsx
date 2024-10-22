import {useEffect, useState } from "react";



function HeaderName() {

    const [fullname, setFullName] = useState("")
    const getFullName = async (email) => {
        let url = `http://localhost:8080/financewise/users/${email}?fields=firstName,lastName`
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
            
          });
    }

    useEffect(() => {
        let email = localStorage.getItem("EMAIL")
        getFullName(email)
    }, []);

    return <ul>
        <li class="is-active is-flex is-justify-content-center is-align-items-center p-3 is-size-6"><a>{fullname || 'Chargement...'}</a></li>
    </ul>
}

export default HeaderName