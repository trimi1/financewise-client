import React, { useEffect, useState } from 'react';
import GoalsDTO from "../dto/goalsDTO.js";

function Goals() {
    const [idCreation, setIdCreation] = useState(-1)
    const [editMode, setEditMode] = useState(false)
    const [deafaultGoals, setDefaultGoals] = useState([])
    const [viewGoals, setViewGoals] = useState([])
    const [addedGoals, setAddedGoals] = useState([])
    const [updatedGoals, setUpdatedGoals] = useState([])
    const [deletedGoals, setDeletedGoals] = useState([])
    const [devises, setDevises] = useState([])

    // Return true or false if the goal (id) is in addedGoals.
    function hasBeenAdded(id) {
        return addedGoals.some(addedGoal => addedGoal.id === id);
    }
    // Return true or false if the goal (id) is in uupdatedGoals.
    function hasBeenUpdated(id) {
        return updatedGoals.some(updatedGoal => updatedGoal.id === id);
    }
    // Return true or false if the goal (id) is in deletedGoals.
    function hasBeenDeleted(id) {
        return deletedGoals.some(deletedGoal => deletedGoal.id === id);
    }

    // Load all currency and update state of currency at the first load of the component.
    useEffect(() => {
        const fetchDevises = async () => {
            try {
                const response = await fetch('http://localhost:8080/financewise/devises', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`}});
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des devises');
                }
                const data = await response.json();
                setDevises(data);
            } catch (error) {
                console.error('Erreur :', error);
            }
        };

        fetchDevises();
    }, []); 
    // Load all goals and update the states of default goals and view at the first load of the component.
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await fetch(`http://localhost:8080/financewise/goals/users/${localStorage.getItem("IDUSER")}`,
                {method: 'GET',  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`}});
                if (!response.ok) {
                    throw new Error('Pas de réponse serveur');
                }
                const data = await response.json()
                setDefaultGoals(data)
                setViewGoals(data)
            } catch (error) {
                console.error('Erreur :', error);
            }
        }
        
        fetchGoals(); 
    }, []); 

    // Handle all processes of changing inputs in edit mode.
    function handleInputChange(event, goal, field) {
        // First step: Create a goal based on the base value and update the chosen one.
        // If the goal has already been updated, we take all the updated values and update the chosen one.
        // If the goal is updated for the first time, we take the base value and update the chosen one.
        let goalCompare = hasBeenUpdated(goal.id) ? new GoalsDTO(updatedGoals.find(g =>g.id === goal.id)) : new GoalsDTO(goal);
        goalCompare.setProperty(field, event.target.value);

        // Step two: If the goal being updated is equal to the default one, the update of the goal is over. If not go to step 3.
        let isEqual = deafaultGoals.some(g => JSON.stringify(g) === JSON.stringify(goalCompare));
        if(isEqual) {
            if(hasBeenUpdated(goal.id)) {
                // We remove the goal from the list of updated goals and refresh the view.
                let index = updatedGoals.findIndex(g => g.id === goal.id);
                setUpdatedGoals(updatedGoals.filter((_, i) => i !== index));
                setViewGoals([...deafaultGoals])
            }
        } else {
            // Step three: In case of an update, there are two possibilities to check.
            // The first one: In case of an update on a created goal.
            // The second one: In case of an update of an existing goal.
            if(hasBeenAdded(goal.id)) {
                // First case: Update the value of the added goal. It counts as one change, ensuring that the update of created goals doesn't count as two.
                // We update the goal from the list of add goals and refresh the view.
                let index = addedGoals.findIndex(g => g.id === goal.id);
                let updatedGoal = addedGoals[index];
                updatedGoal.setProperty(field, event.target.value);
                setAddedGoals([...addedGoals.slice(0, index), updatedGoal, ...addedGoals.slice(index+1)])
                index = viewGoals.findIndex(g => g.id === updatedGoal.id);
                setViewGoals([...viewGoals.slice(0, index), updatedGoal, ...viewGoals.slice(index+1)])
            } else {
                // Second case: Update an existing goal. If the goal has already been updated, we take all updated inputs and update the chosen one.
                // If not, we take the base value and add the existing goal to the update list.
                let index = updatedGoals.findIndex(g => g.id === goal.id);
                let updatedGoal = hasBeenUpdated(goal.id) ? updatedGoals[index] : new GoalsDTO(goal);
                updatedGoal.setProperty(field, event.target.value);
                hasBeenUpdated(goal.id) ? setUpdatedGoals([...updatedGoals.slice(0, index), updatedGoal, ...updatedGoals.slice(index+1)]) 
                :  setUpdatedGoals(prevUpdatedGoals => {
                    const newUpdatedGoals = [...prevUpdatedGoals, updatedGoal];
                    return newUpdatedGoals;
                });
                let indexGoal = viewGoals.findIndex(g => g.id === updatedGoal.id);
                setViewGoals([...viewGoals.slice(0, indexGoal), updatedGoal, ...viewGoals.slice(indexGoal+1)])
            }
        }
    }
    
    // Activate or deactivate edit mode and refresh the entire state of the editing list.
    function handleEditionMode(event) {
        event.preventDefault();
        setEditMode(!editMode)
        setAddedGoals([])
        setUpdatedGoals([])
        setDeletedGoals([])
    }

    // Allow to create a new goal and update the state of the added goals list and view.
    // Rule: By creating a new goal, its ID will be negative to indicate that it's intended for creation, not for updating.
    // Decrease the negative ID by one for each new goal.
    function handleAddGoals() {
        const newGoal = new GoalsDTO({
            id: idCreation,
            name: "Nouvel Objectif",
            montant: 0.0,
            devise: "Euro",
            deadline: new Date(),
            recommendation: "Ajouter une recommandation"
        });

        setAddedGoals((prevAddedGoals) => {
            const newAddedGoals = [...prevAddedGoals, newGoal];
            setViewGoals((prevViewGoals) => [...prevViewGoals, newGoal]);
            return newAddedGoals;
        });

        setIdCreation(idCreation-1);
    }

    function handleCancelOrDelete(goal) {
        if(hasBeenAdded(goal.id)) {
            let index = addedGoals.findIndex(g => g.id === goal.id);
            const updatedAddedGoals = addedGoals.filter((_, i) => i !== index);
            setAddedGoals(updatedAddedGoals);
            setViewGoals([...deafaultGoals, ...updatedAddedGoals]);
            return;
        }

        if(hasBeenUpdated(goal.id)) {
            let index = updatedGoals.findIndex(g => g.id === goal.id);
            setUpdatedGoals(updatedGoals.filter((_, i) => i !== index));
            setViewGoals([...deafaultGoals])
            return;
        }
        
        hasBeenDeleted(goal.id) ? setDeletedGoals(deletedGoals.filter(deletedGoal => deletedGoal.id !== goal.id)) : setDeletedGoals([...deletedGoals, goal]);
    }

    function handleCancelChanges() {
        setAddedGoals([])
        setUpdatedGoals([])
        setDeletedGoals([])
        setViewGoals([...deafaultGoals])
    }

    function handelChangeConfirm() {
        let addGoalsConfirm = [...addedGoals];
        addGoalsConfirm.forEach(g => g.id = -1);
        addGoalsConfirm.push(...updatedGoals)
        fetch(`http://localhost:8080/financewise/goals/users/${localStorage.getItem("IDUSER")}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}` 
            },
            body: JSON.stringify(addGoalsConfirm),
        })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error("Erreur : 403");
                }
                throw new Error('Erreur HTTP POST : ' + response.status + ' Message : ' + response.message);
            }
            console.log("Ajout confirmé !");
            setAddedGoals([]);
            setUpdatedGoals([])
    
            // Une fois l'ajout confirmé, on recharge la liste des objectifs
            return fetch(`http://localhost:8080/financewise/goals/users/${localStorage.getItem("IDUSER")}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem("TOKEN")}` 
                }
            });
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des objectifs');
            }
            return response.json();
        })
        .then((data) => {
            setDefaultGoals(data);
            setViewGoals(data);
        })
        .catch((error) => {
            console.error('Erreur :', error.message);
        });
    }

    function handleDeleteConfirm() {
        let deletedGoalsConfirm = [...deletedGoals]
         
        fetch(`http://localhost:8080/financewise/goals/users/${localStorage.getItem("IDUSER")}`,
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`},
            body: JSON.stringify(deletedGoalsConfirm),
        }).then((response) => {
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error("Erreur : 403");
                }
                throw new Error('Erreur HTTP POST : ' + response.status + ' Message : ' + response.message);
            }
            console.log("Goals Supprimer !")
            let remainingGoals = deafaultGoals.filter(element => !deletedGoals.includes(element));
            setDefaultGoals(remainingGoals)
            setViewGoals(remainingGoals)
            setDeletedGoals([])

        }).catch((error) => {
            console.log(error.message)
        });
    }

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
                        {viewGoals.map((goal, index) => (
                            <tr key={index}>
                                <td className={`${hasBeenDeleted(goal.id) ? "border-bottom-red text-red" : ""}`}> 
                                    {editMode && !hasBeenDeleted(goal.id) ? (<input type="text" value={updatedGoals.find(g => g.id === goal.id)?.name || goal.name} onChange={(e) => handleInputChange(e, goal, 'name')}/>) : (goal.name)}
                                </td>
                                <td className={`${hasBeenDeleted(goal.id) ? "border-bottom-red text-red" : ""}`}> 
                                    {editMode && !hasBeenDeleted(goal.id) ? (<input type="number" value={updatedGoals.find(g => g.id === goal.id)?.montant || goal.montant} onChange={(e) => handleInputChange(e, goal, 'montant')}/>) : (goal.montant)}
                                </td>
                                <td className={`${hasBeenDeleted(goal.id) ? "border-bottom-red text-red" : ""}`}>
                                    {editMode && !hasBeenDeleted(goal.id) ? (<input type="date" value={new Date(updatedGoals.find(g => g.id === goal.id)?.deadline || goal.deadline).toISOString().substr(0, 10)} onChange={(e) => handleInputChange(e, goal, 'deadline')}/>) : (new Date(goal.deadline).toLocaleDateString() )}
                                </td>
                                <td className={`${deletedGoals.some(deletedGoal => deletedGoal.id === goal.id)  ? "border-bottom-red text-red" : ""}`}>
                                    {editMode && !hasBeenDeleted(goal.id) ? 
                                    ( 
                                        <select value={updatedGoals.find(g => g.id === goal.id)?.devise || goal.devise} onChange={(e) => handleInputChange(e, goal, 'devise')}>
                                            {devises.map((devise, index) => (<option key={index} value={devise.name}> {devise.name} </option>))}
                                        </select>
                                    ) : (goal.devise)}
                                </td>
                                <td key={goal.id} className={`width2 text-center ${editMode ? "" : "hidden"} ${hasBeenDeleted(goal.id) && !hasBeenUpdated(goal.id) && !hasBeenAdded(goal.id) ? " border-bottom-red" : ""}`} onClick={() => handleCancelOrDelete(goal)}>
                                    <img src={`./src/icon/${hasBeenDeleted(goal.id) || hasBeenUpdated(goal.id) || hasBeenAdded(goal.id) ? "cancel.png" : "delete.png"}`} className="img-action"/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </table>
            <div id="edit-confirm" className={`is-flex is-flex-direction-row is-justify-content-space-around width85 margin-5 ${editMode ? "" : "hidden"}`} >
                <h2 onClick={handleCancelChanges}>
                    Annuler les changements 🔄️
                </h2>
                <h2 onClick={handleDeleteConfirm}>
                    {`Supprimer ${deletedGoals.length} catégories ❌`}
                </h2>
                <h2 onClick={handelChangeConfirm}>
                    {`Valider ${addedGoals.length + updatedGoals.length} changemnts ✅`}
                </h2>
            </div>
    </section>
}

export default Goals
