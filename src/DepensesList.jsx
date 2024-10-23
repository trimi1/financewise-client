import React from 'react';

function DepensesList() {

    const depenses = fetch(`http://localhost:8080/financewise/depenses/users/${localStorage.getItem("EMAIL")}`, {method: 'GET',  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`}})
                .then(response => response.json())
    console.log(depenses)



    return (
        <div>
            <h>It works</h>
        </div>
    )
}

export default DepensesList;