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
                <th>Devise</th>
                <th>Catégorie</th>
                <th>Objectif</th>
            </tr>
            </thead>
            <tbody>
            {filteredDepenses.map(depense => (
                <tr key={depense.id}>
                    <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{depense.date}</td>
                    <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{depense.name}</td>
                    <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{depense.montant}</td>
                    <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{depense.devise}</td>
                    <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{depense.categorie.name}</td>
                    <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{depense.objectif.name}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default DepenseTable;
