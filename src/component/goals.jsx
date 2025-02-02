import React, { useEffect, useState } from 'react';
import GoalsDTO from "../dto/goalsDTO.js";
import DepenseDTO from "../dto/depenseDTO.js";

function Goals() {
    const [idCreation, setIdCreation] = useState(-1)
    const [editMode, setEditMode] = useState(false)
    const [defaultGoals, setDefaultGoals] = useState([])
    const [viewGoals, setViewGoals] = useState([])
    const [addedGoals, setAddedGoals] = useState([])
    const [updatedGoals, setUpdatedGoals] = useState([])
    const [deletedGoals, setDeletedGoals] = useState([])
    const [devises, setDevises] = useState([])
    const [depenses, setDepenses] = useState([])

    // Return true or false if the goal (id) is in addedGoals.
    function hasBeenAdded(id) {
        return addedGoals.some(addedGoal => addedGoal.id === id);
    }
    // Return true or false if the goal (id) is in updatedGoals.
    function hasBeenUpdated(id) {
        return updatedGoals.some(updatedGoal => updatedGoal.id === id);
    }
    // Return true or false if the goal (id) is in deletedGoals.
    function hasBeenDeleted(id) {
        return deletedGoals.some(deletedGoal => deletedGoal.id === id);
    }

    // Load all currencies and update state of currency at the first load of the component.
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
                data.map(goal => new GoalsDTO(goal))
                let goals = []
                data.forEach(goal => {
                    goals.push(new GoalsDTO(goal))
                });

                setDefaultGoals(goals)
                setViewGoals(goals)
            } catch (error) {
                console.error('Erreur :', error);
            }
        }
        
        fetchGoals(); 
    }, []);

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
                    throw new Error('Pas de réponse serveur');
                }
                return response.json();
            })
            .then(array => {
                const depensesArray = array.map(depense => new DepenseDTO(depense));
                setDepenses(depensesArray);
            });
    }, []);

    // Handle all processes of changing inputs in edit mode.
    function handleInputChange(event, goal, field) {
        console.log(goal.id)
        // First step: Create a goal based on the base value and update the chosen one.
        // If the goal has already been updated, we take all the updated values and update the chosen one.
        // If the goal is updated for the first time, we take the base value and update the chosen one.
        let goalCompare = hasBeenUpdated(goal.id) ? new GoalsDTO(updatedGoals.find(g =>g.id === goal.id)) : new GoalsDTO(goal);
        goalCompare.setProperty(field, event.target.value);

        // Step two: If the goal being updated is equal to the default one, the update of the goal is over. If not go to step 3.
        let isEqual = defaultGoals.some(g => JSON.stringify(g) === JSON.stringify(goalCompare));
        if(isEqual) {
            if(hasBeenUpdated(goal.id)) {
                // We remove the goal from the list of updated goals and refresh the view.
                let index = updatedGoals.findIndex(g => g.id === goal.id);
                setUpdatedGoals(updatedGoals.filter((_, i) => i !== index));
                index = viewGoals.findIndex(g => g.id === goal.id);
                let defaultGoal = defaultGoals.find(g => g.id === goal.id);
                setViewGoals([...viewGoals.slice(0, index), defaultGoal, ...viewGoals.slice(index+1)])
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
                setViewGoals(prevViewGoals => [...prevViewGoals.slice(0, index), updatedGoal, ...prevViewGoals.slice(index + 1)]);
            } else {
                // Second case: Update an existing goal. If the goal has already been updated, we take all updated inputs and update the chosen one.
                // If not, we take the base value and add the existing goal to the update list.
                let index = updatedGoals.findIndex(g => g.id === goal.id);
                let updatedGoal = hasBeenUpdated(goal.id) ? updatedGoals[index] : new GoalsDTO(goal);
                updatedGoal.setProperty(field, event.target.value);
                hasBeenUpdated(goal.id) ? setUpdatedGoals(prevUpdatedGoals => {return [...prevUpdatedGoals.slice(0, indexGoal), updatedGoal, ...prevUpdatedGoals.slice(indexGoal + 1)]}) 
                :  setUpdatedGoals(prevUpdatedGoals => { return [...prevUpdatedGoals, updatedGoal]});
                let indexGoal = viewGoals.findIndex(g => g.id === updatedGoal.id);
                setViewGoals(prevViewGoals => {return [...prevViewGoals.slice(0, indexGoal), updatedGoal, ...prevViewGoals.slice(indexGoal + 1)]});
                console.log(updatedGoals)
            }
        }
    }

    // Effect to log updated goals whenever they change
    useEffect(() => {
         console.log("Updated goals have changed:", updatedGoals);
    }, [updatedGoals]);
    
    // Effect to log view goals whenever they change
    useEffect(() => {
        console.log("View goals have changed:", viewGoals);
    }, [viewGoals]);
    
    // Activate or deactivate edit mode and refresh the entire state of the editing list.
    function handleEditionMode(event) {
        event.preventDefault();
        setEditMode(!editMode)
        setAddedGoals([])
        setUpdatedGoals([])
        setDeletedGoals([])
        setViewGoals(defaultGoals)
    }

    // Allow to create a new goal and update the state of the added goals list and view.
    // Rule: By creating a new goal, its ID will be negative to indicate that it's intended for creation, not for updating.
    // Decrease the negative ID by one for each new goal.
    function handleAddGoals() {
        const newGoal = new GoalsDTO({
            id: idCreation,
            name: "Objectif #" + (addedGoals.length + 1),
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
    // This function allows for the cancellation of a single add, update, or delete action. 
    // In the case of deletion, it permits adding a goal to the deletedGoals list or canceling the deletion by deselecting the goal.
    function handleCancelOrDelete(goal) {
        if(hasBeenAdded(goal.id)) {
            let index = addedGoals.findIndex(g => g.id === goal.id);
            const updatedAddedGoals = addedGoals.filter((_, i) => i !== index);
            setAddedGoals(updatedAddedGoals);
            setViewGoals([...defaultGoals, ...updatedAddedGoals]);
            return;
        }

        if(hasBeenUpdated(goal.id)) {
            let index = updatedGoals.findIndex(g => g.id === goal.id);
            setUpdatedGoals([...updatedGoals.filter((_, i) => i !== index)]);
            let defaultGoal = defaultGoals.find(g => g.id === goal.id);
            index = viewGoals.findIndex(g => g.id === goal.id);
            setViewGoals(prevViewGoals => [...prevViewGoals.slice(0, index), defaultGoal, ...prevViewGoals.slice(index + 1)]);
            return;
        }
        
        hasBeenDeleted(goal.id) ? setDeletedGoals(deletedGoals.filter(deletedGoal => deletedGoal.id !== goal.id)) : setDeletedGoals([...deletedGoals, goal]);
    }
    // This function resets all components to an empty state and refreshes the view with default values, which are retrieved from the database.
    function handleCancelChanges() {
        setAddedGoals([])
        setUpdatedGoals([])
        setDeletedGoals([])
        setViewGoals([...defaultGoals])
    }

    // This function sets the IDs of all newly added goals to -1 to indicate they need to be created,
    // while keeping the IDs of updated goals unchanged. It then sends a request to update the database,
    // followed by a synchronization request to refresh all components with the latest database values.
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
            // Sends a new GET request to synchronize all components with the latest values from the database.
            // Updates all necessary components based on the response.
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
    // This function sends a request to the FinanceWise API to delete goals, then updates and refreshes the components.
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
            let remainingGoals = defaultGoals.filter(element => !deletedGoals.includes(element));
            setDefaultGoals(remainingGoals)
            setViewGoals(remainingGoals)
            setDeletedGoals([])
        }).catch((error) => {
            console.log(error.message)
        });
    }

    // This function patches the date to match the user's current time zone.
    function formatDate(goal) {
        const deadlineDate = updatedGoals.find(g => g.id === goal.id)?.deadline || goal.deadline;
        return new Date(new Date(deadlineDate).getTime() - new Date(deadlineDate).getTimezoneOffset() * 60000);
    }

    return <section>
        <div className="is-flex flex-direction-row is-justify-content-end is-align-items-center"> 
            <h2 id="id-edition" className={`text-end marginR1 ${editMode ? "text-orange" : ""}`} onClick={handleEditionMode}>Mode édition</h2>
            <img id="id-edition-icon" src="./src/icon/edition.png" className="marginR5" onClick={handleEditionMode}></img>
        </div>
        <div id="container-table">
        <table className="margin-5">
                    <thead>
                    <tr>
                        <th>Nom</th>
                        {editMode ? <th>Objectif financier</th> : <th>Avancement</th>}
                        <th>Date limite</th>
                        <th>Devise</th>
                        <th id="action-column" className={`text-center ${editMode ? "" : "width2 hidden"}`}><img src="./src/icon/plus.png" onClick={handleAddGoals}/></th>
                    </tr>
                    </thead>
                    <tbody>
                        {viewGoals.map((goal, index) => (
                            <tr key={index} className={`${hasBeenDeleted(goal.id) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(goal.id) ? " border-bottom-green" : ""} ${hasBeenUpdated(goal.id) ? " border-bottom-blue" : ""}`}>
                                <td> 
                                    {editMode && !hasBeenDeleted(goal.id) ? (<input type="text" value={updatedGoals.find(g => g.id === goal.id)?.name || goal.name} onChange={(e) => handleInputChange(e, goal, 'name')}/>) : (goal.name)}
                                </td>
                                <td>
                                    {editMode && !hasBeenDeleted(goal.id) ? (<input type="number" min={0} value={updatedGoals.find(g => g.id === goal.id)?.montant || goal.montant} onChange={(e) => handleInputChange(e, goal, 'montant')}/>)
                                        : (
                                            depenses.filter(d => d.objectif !== null).filter(d => d.objectif.id === goal.id).length > 0 ?
                                            depenses.filter(d => d.objectif !== null).filter(d => d.objectif.id === goal.id).reduce((total, depense) => total + depense.montant, 0).toFixed(2) + " / " + goal.montant + " (" + ((depenses.filter(d => d.objectif !== null).filter(d => d.objectif.id === goal.id).reduce((total, depense) => total + depense.montant, 0)/goal.montant)*100).toFixed(2) + "%)"
                                            : 0 + " / " + goal.montant + " (0%)")
                                    }
                                </td>
                                <td>
                                    {editMode && !hasBeenDeleted(goal.id) ? (<input type="date" value={formatDate(goal).toISOString().substr(0, 10)} onChange={(e) => handleInputChange(e, goal, 'deadline')}/>) : (new Date(goal.deadline).toLocaleDateString() )}
                                </td>
                                <td>
                                    {editMode && !hasBeenDeleted(goal.id) ? 
                                    ( 
                                        <select value={updatedGoals.find(g => g.id === goal.id)?.devise || goal.devise} onChange={(e) => handleInputChange(e, goal, 'devise')}>
                                            {devises.map((devise, index) => (<option key={index} value={devise.name}> {devise.name} </option>))}
                                        </select>
                                    ) : (goal.devise)}
                                </td>
                                <td key={goal.id} className={`width2 text-center ${editMode ? "" : "hidden"}`} onClick={() => handleCancelOrDelete(goal)}>
                                    <img src={`./src/icon/${hasBeenDeleted(goal.id) || hasBeenUpdated(goal.id) || hasBeenAdded(goal.id) ? "cancel.png" : "delete.png"}`}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </table>
            </div>
            <div id="edit-confirm" className={`is-flex is-flex-direction-row is-justify-content-space-around width85 margin-5 ${editMode ? "" : "hidden"}`} >
                <div>
                    <h2 onClick={handleCancelChanges}>Annuler les changements</h2>
                    <img src="./src/icon/cancel.png"/>
                </div>
                <div>
                    <h2 onClick={handleDeleteConfirm}>{`Supprimer ${deletedGoals.length} objectifs `}</h2>
                    <img src="./src/icon/delete.png"/>
                </div>
                <div>
                    <h2 onClick={handelChangeConfirm}>{`Valider ${addedGoals.length + updatedGoals.length} changements`}</h2>
                    <img src="./src/icon/verifier.png"/>
                </div>
            </div>
    </section>
}

export default Goals
