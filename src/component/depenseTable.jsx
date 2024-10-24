import React from 'react';

function DepenseTable({ depenses, selectedCategory }) {
    const filteredDepenses = selectedCategory
        ? depenses.filter(depense => depense.categorie.name === selectedCategory)
        : depenses;

    return (
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
            {filteredDepenses.map(depense => (
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
    );
}

export default DepenseTable;
