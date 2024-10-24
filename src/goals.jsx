import React, { useState } from 'react';
import { GoalsDTO } from './dto/goalsDTO';

function Goals() {
    const [editMode, setEditMode] = useState(false)
    const [handleAddedGoals, setAddedGoals] = useState([])
    const [handleUpdatedGoals, setUpdatedGoals] = useState([])
    const [handleDeletedGoals, setDeletedGoals] = useState([])

    const handleEditionMode = (event) => {
        event.preventDefault();
        setEditMode(!editMode)
    }

    function handleDeletion(goal) {
        // Vérifier si l'objectif est déjà sélectionné pour suppression
        const isSelected = handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id);

        if (isSelected) {
            // Si l'objectif est déjà sélectionné, le désélectionner (le retirer de handleDeletedGoals)
            setDeletedGoals(handleDeletedGoals.filter(deletedGoal => deletedGoal.id !== goal.id));
        } else {
            // Sinon, ajouter l'objectif à handleDeletedGoals
            setDeletedGoals([...handleDeletedGoals, goal]);
        }
    }

    const getGoals = async () => {
        return fetch(`http://localhost:8080/financewise/goals/users/${localStorage.getItem("IDUSER")}`,
    {method: 'GET',  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`}})
    .then(

    );
    }

    const addGoals = async (goals) => {

        return  fetch(`http://localhost:8080/financewise/goals/users/${localStorage.getItem("IDUSER")}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`},
            body: JSON.stringify(goals),
        }).then((response) => {
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error("Erreur : 403");
                }
                throw new Error('Erreur HTTP POST : ' + response.status + ' Message : ' + response.message);
            }
            navigate("/home");
        }).catch((error) => {
            console.log(error.message)
        });
    };

    const goalsList = [
        new GoalsDTO({
          id: 1,
          name: "Acheter une voiture",
          montant: 15000.0,
          devise: "EUR",
          deadline: new Date("2024-12-31"),
          recommendation: "Économiser 500€ par mois"
        }),
        new GoalsDTO({
          id: 2,
          name: "Voyage à Tokyo",
          montant: 5000.0,
          devise: "USD",
          deadline: new Date("2025-05-15"),
          recommendation: "Utiliser les économies des bonus annuels"
        }),
        new GoalsDTO({
          id: 3,
          name: "Achat d'une maison",
          montant: 200000.0,
          devise: "EUR",
          deadline: new Date("2030-01-01"),
          recommendation: "Investir dans des actions à faible risque"
        })
      ];
    
    return <section>
        <div className="is-flex flex-direction-row is-justify-content-end is-align-items-center"> 
            <h2 id="id-edition" className={`text-end marginR1 ${editMode ? "text-orange" : ""}`} onClick={handleEditionMode}>Mode édition</h2>
            <img id="id-edition-icon" src="./src/icon/edition.png" className="marginR5" onClick={handleEditionMode}></img>
        </div>
        <table className="margin-5">
                    <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Objectif financier</th>
                        <th>Date limite</th>
                        <th>Devise</th>
                        <th className={`${editMode ? "" : "width2 hidden"}`}></th>
                    </tr>
                    </thead>
                    <tbody>
                        {goalsList.map((goal, index) => (
                            <tr key={index}>
                                <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{goal.name}</td>
                                <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{goal.montant}</td>
                                <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{new Date(goal.deadline).toLocaleDateString()}</td>
                                <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{goal.devise}</td>
                                <td key={goal.id} className={`width2 text-center ${editMode ? "" : "hidden"} ${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? " border-bottom-red" : ""}`} onClick={() => handleDeletion(goal)}>❌</td>
                            </tr>
                        ))}
                    </tbody>
            </table>
            <div id="edit-confirm" className={`is-flex is-flex-direction-row is-justify-content-space-around width85 margin-5 ${editMode ? "" : "hidden"}`} >
                <h2>
                    Annuler les changements 🔄️
                </h2>
                <h2>
                    Supprimer x catégories ❌
                </h2>
                <h2>
                    Valider x changemnts ✅
                </h2>
            </div>
    </section>
}

export default Goals