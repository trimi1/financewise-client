import React, { useEffect, useState } from 'react';
import CategoryDTO from "../dto/categoryDTO.js";
import DepenseDTO from "../dto/depenseDTO.js";
import {GoalsDTO} from "../dto/goalsDTO.js";

function Depenses() {
    const [depenses, setDepenses] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/financewise/depenses/users/${localStorage.getItem("IDUSER")}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(array => {
                const depensesArray = array.map(depense => {
                    let objectif = new GoalsDTO({id: depense.objectif.id, name: depense.objectif.name, montant: depense.objectif.montant, devise: depense.objectif.devise, deadline: depense.objectif.deadline,recommendation: depense.objectif.recommendation});
                    let categorie = new CategoryDTO(depense.categorie.id, depense.categorie.name, depense.categorie.montantMax, depense.categorie.devise);
                    return new DepenseDTO(depense.id, depense.name, depense.montant, depense.devise, depense.date, categorie, objectif);
                });
                console.log(depensesArray)
                setDepenses(depensesArray);
            })
    }, []);

    return (
        <section>
            <div className="is-flex is-flex-direction-row is-justify-content-end">
                <h2 className="text-end marginR5">Mode édition</h2>
                <img alt="edit" src="path/to/edit/icon.png" />
            </div>
            <table className="margin-5">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Nom</th>
                    <th>Montant</th>
                    <th>Catégorie</th>
                    <th>Objectif</th>
                </tr>
                </thead>
                <tbody>
                {depenses.map(depense => (
                    <tr key={depense.id}>
                        <td>{depense.date}</td>
                        <td>{depense.name}</td>
                        <td>{depense.montant} {depense.devise}</td>
                        <td>{depense.categorie.name}</td>
                        <td>{depense.objectif.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}

export default Depenses;
