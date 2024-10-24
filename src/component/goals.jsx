import React, { useState } from 'react';
import GoalsDTO from "../dto/goalsDTO.js";

function Goals() {
    const [editMode, setEditMode] = useState(false)
    const [handleAddedGoals, setAddedGoals] = useState([])
    const [handleUpdatedGoals, setUpdatedGoals] = useState([])
    const [handleDeletedGoals, setDeletedGoals] = useState([])

    function handleEditionMode(event) {
        event.preventDefault();
        setEditMode(!editMode)
    }

    function handleAddGoals() {
        const newGoal = new GoalsDTO({
            // Pour la db faire gaffe à l'id
            id: handleAddedGoals.length + goalsList.length + 1,
            name: "Nouvel Objectif",
            montant: 0.0,
            devise: "EUR",
            deadline: new Date(),
            recommendation: "Ajouter une recommandation"
        });

        // Ajout du nouvel objectif dans l'état
        setAddedGoals([...handleAddedGoals, newGoal]);
    }

    function handleDeletion(goal) {
        let isSelected = handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id);
        isSelected ?  setDeletedGoals(handleDeletedGoals.filter(deletedGoal => deletedGoal.id !== goal.id)) : setDeletedGoals([...handleDeletedGoals, goal]);
    }

    function handleCancelChanges() {
        setAddedGoals([])
        setUpdatedGoals([])
        setDeletedGoals([])
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

    const allGoals = [...goalsList, ...handleAddedGoals];
    
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
                        <th id="action-column" className={`text-center ${editMode ? "" : "width2 hidden"}`}><img className="img-action" src="./src/icon/plus.png" onClick={handleAddGoals}/></th>
                    </tr>
                    </thead>
                    <tbody>
                        {allGoals.map((goal, index) => (
                            <tr key={index}>
                                <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{goal.name}</td>
                                <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{goal.montant}</td>
                                <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{new Date(goal.deadline).toLocaleDateString()}</td>
                                <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>{goal.devise}</td>
                                <td key={goal.id} className={`width2 text-center ${editMode ? "" : "hidden"} ${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? " border-bottom-red" : ""}`} onClick={() => handleDeletion(goal)}>
                                    <img src={`./src/icon/${handleDeletedGoals.some(deletedGoal => deletedGoal.id === goal.id) ? "cancel.png" : "delete.png"}`} className="img-action"/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </table>
            <div id="edit-confirm" className={`is-flex is-flex-direction-row is-justify-content-space-around width85 margin-5 ${editMode ? "" : "hidden"}`} >
                <h2 onClick={handleCancelChanges}>
                    Annuler les changements 🔄️
                </h2>
                <h2>
                    {`Supprimer ${handleDeletedGoals.length} catégories ❌`}
                </h2>
                <h2>
                    {`Valider ${handleAddedGoals.length + handleUpdatedGoals.length} changemnts ✅`}
                </h2>
            </div>
    </section>
}

export default Goals
