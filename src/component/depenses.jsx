import React, {useEffect, useState} from 'react';
import CategoryDTO from "../dto/categoryDTO.js";
import DepenseDTO from "../dto/depenseDTO.js";
import DepenseChart from './depensesChart.jsx';
import GoalsDTO from "../dto/goalsDTO.js";

function Depenses() {
    const [depenses, setDepenses] = useState([]);
    const [filtredView, setFiltredView] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showChart, setShowChart] = useState(false);
    const [chartImage, setChartImage] = useState("./src/icon/graphic.png");

    const [idCreation, setIdCreation] = useState(-1);
    const [editMode, setEditMode] = useState(false);
    const [addedDepense, setAddedDepense] = useState([]);
    const [updatedDepense, setUpdatedDepense] = useState([]);
    const [deletedDepense, setDeletedDepense] = useState([]);
    const [devises, setDevises] = useState([]);
    const [goals, setGoals] = useState([]);

    function hasBeenAdded(id) {
        return addedDepense.some(addedDepense => addedDepense.id === id);
    }

    function hasBeenUpdated(id) {
        return updatedDepense.some(updatedDepense => updatedDepense.id === id);
    }

    function hasBeenDeleted(id) {
        return deletedDepense.some(deletedDepense => deletedDepense.id === id);
    }

    function changeCategory(event) {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        let filtredAdded = newCategory === "" ? addedDepense : addedDepense.filter(depense => depense.categorie.name === newCategory);
        let filtedUpdated = newCategory === "" ? updatedDepense : updatedDepense.filter(depense => depense.categorie.name === newCategory);
        let filtredDeleted = newCategory === "" ? deletedDepense : deletedDepense.filter(depense => depense.categorie.name === newCategory);
        let depensesFiltred = newCategory === "" ? depenses : depenses.filter(depense => depense.categorie.name === newCategory);
        depensesFiltred = depensesFiltred.filter(depense => !filtedUpdated.some(depenseFiltred => depenseFiltred.id === depense.id))
        depensesFiltred = depensesFiltred.filter(depense => !filtredDeleted.some(depenseFiltred => depenseFiltred.id === depense.id))
        setFiltredView([...depensesFiltred, ...filtredAdded, ...filtedUpdated, ...filtredDeleted]);
    }

    function handleInputChanges(event, depense, field) {
        let depenseCompare = hasBeenUpdated(depense.id) ? new DepenseDTO(updatedDepense.find(d => d.id === depense.id)) : new DepenseDTO(depense)
        if(field === "objectif") {
            event.target.value === "null" ?  depenseCompare.setProperty(field, null) : depenseCompare.setProperty(field, goals.find(g => g.id === Number(event.target.value)));
        } else if(field === "categorie") {
            event.target.value === "null" ?  depenseCompare.setProperty(field, null) : depenseCompare.setProperty(field, categories.find(c => c.idCategory === Number(event.target.value)));
        } else {
            depenseCompare.setProperty(field, event.target.value)
        }

        let isEqual = depenses.some(d => JSON.stringify(d) === JSON.stringify(depenseCompare));
        if(isEqual) {
            if(hasBeenUpdated(depense.id)) {
                let index = updatedDepense.findIndex(d => d.id === depense.id);
                setUpdatedDepense(updatedDepense.filter((_, i) => i !== index));
                index = filtredView.findIndex(d => d.id === depense.id);
                let defaultDepense = depenses.find(d => d.id === depense.id);
                setFiltredView([...filtredView.slice(0, index), defaultDepense, ...filtredView.slice(index+1)])
            }
        } else {
            if(hasBeenAdded(depense.id)) {
                let index = addedDepense.findIndex(d => d.id === depense.id);
                let updateDepense = addedDepense[index];
                if(field === "objectif") {
                    event.target.value === "null" ?  updateDepense.setProperty(field, null) : updateDepense.setProperty(field, goals.find(g => g.id === Number(event.target.value)));
                } else if(field === "categorie") {
                    event.target.value === "null" ?  updateDepense.setProperty(field, null) : updateDepense.setProperty(field, categories.find(c => c.idCategory === Number(event.target.value)));
                } else {
                    updateDepense.setProperty(field, event.target.value)
                }

                setAddedDepense([...addedDepense.slice(0, index), updateDepense, ...addedDepense.slice(index+1)]);
                index = filtredView.findIndex(d => d.id === updateDepense.id)
                setFiltredView([...filtredView.slice(0, index), updateDepense, ...filtredView.slice(index+1)]);
            } else {
                let index = updatedDepense.findIndex(d => d.id === depense.id);
                let updateDepense = hasBeenUpdated(depense.id) ? updatedDepense[index] : new DepenseDTO(depense);
                if(field === "objectif") {
                    event.target.value === "null" ?  updateDepense.setProperty(field, null) : updateDepense.setProperty(field, goals.find(g => g.id === Number(event.target.value)));
                } else if(field === "categorie") {
                    event.target.value === "null" ?  updateDepense.setProperty(field, null) : updateDepense.setProperty(field, categories.find(c => c.idCategory === Number(event.target.value)));
                } else {
                    updateDepense.setProperty(field, event.target.value)
                }

                hasBeenUpdated(depense.id) ? setUpdatedDepense([...updatedDepense.slice(0, index), updateDepense, ...updatedDepense.slice(index+1)])
                    : setUpdatedDepense(prevUpdate => {
                        return [...prevUpdate, updateDepense]
                    });
                let indexDepense = filtredView.findIndex(d => d.id === updateDepense.id);
                setFiltredView([...filtredView.slice(0, indexDepense), updateDepense, ...filtredView.slice(indexDepense+1)]);
            }
        }
    }


    function handleEditionMode(event) {
        event.preventDefault();
        setEditMode(!editMode)
        setAddedDepense([])
        setUpdatedDepense([])
        setDeletedDepense([])
        setFiltredView(depenses)
    }

    function handleAddDepense() {
        const newDepense = new DepenseDTO({
            id: idCreation,
            name: "Dépense #" + (addedDepense.length + 1),
            montant: 0.0,
            devise: "Euro",
            date: new Date()
        });

        setAddedDepense((prevAddDepense) => {
            const newAddedDepense = [...prevAddDepense, newDepense];
            setFiltredView((prevAddDepense) => [...prevAddDepense, newDepense]);
            return newAddedDepense;
        });

        setIdCreation(idCreation - 1);
    }

    function handleCancelOrDelete(depense) {
        if(hasBeenAdded(depense.id)) {
            let index = addedDepense.findIndex(d => d.id === depense.id);
            const updateAddedDepense = addedDepense.filter((_, i) => i !== index);
            setAddedDepense(updateAddedDepense);
            setFiltredView([...depenses, ...updateAddedDepense]);
            return;
        }

        if(hasBeenUpdated(depense.id)) {
            let index = updatedDepense.findIndex(d => d.id === depense.id);
            setUpdatedDepense(updatedDepense.filter((_, i) => i !== index));
            let defaultDepense = depenses.find(d => d.id === depense.id);
            index = filtredView.findIndex(d => d.id === depense.id);
            setFiltredView([...filtredView.slice(0, index), defaultDepense, ...filtredView.slice(index+1)])
            return;
        }

        hasBeenDeleted(depense.id) ? setDeletedDepense(deletedDepense.filter(deletedDepense => deletedDepense.id !== depense.id)) : setDeletedDepense([...deletedDepense, depense]);
    }

    function handleCancelChanges() {
        setAddedDepense([])
        setUpdatedDepense([])
        setDeletedDepense([])
        setFiltredView([...depenses])
    }



    useEffect(() => {
        fetch(`http://localhost:8080/financewise/categories/users/${localStorage.getItem("IDUSER")}`, {
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
                const categoriesArray = array.map(category => new CategoryDTO(category));
                setCategories(categoriesArray);
            });
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8080/financewise/devises`, {
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
            .then(reponse => {
                setDevises(reponse)
            })
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8080/financewise/goals/users/${localStorage.getItem("IDUSER")}`, {
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
                const goals = array.map(goal => new GoalsDTO(goal))
                setGoals(goals)
            })
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
                setFiltredView(depensesArray)
            });
    }, []);

    const handleImageClick = () => {
        setEditMode(false)
        setShowChart(!showChart);
        setChartImage(showChart ? "./src/icon/graphic.png" : "./src/icon/liste.png");
    };

    function formatDate(depense) {
        const date = updatedDepense.find(g => g.id === depense.id)?.date || depense.date
        return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000)
    }

    function handleChangeConfirm() {
        let addDepenseConfirm = [...addedDepense];
        addDepenseConfirm.forEach(d => d.id = -1);
        addDepenseConfirm.push(...updatedDepense);
        console.log(localStorage.getItem("IDUSER"))
        console.log(addDepenseConfirm)
        fetch(`http://localhost:8080/financewise/depenses/users/${localStorage.getItem("IDUSER")}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            },
            body: JSON.stringify(addDepenseConfirm)
        })
            .then((reponse) => {
                if(!reponse.ok) {
                    if(reponse.status === 403) {
                        throw new Error("Erreur : 403")
                    }
                    throw new Error(`Erreur HTTP POST : ${reponse.status} Message : ${reponse.message}`)
                }
                console.log("Ajout confirmé")
                setAddedDepense([])
                setUpdatedDepense([])
                return fetch(`http://localhost:8080/financewise/depenses/users/${localStorage.getItem("IDUSER")}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
                    }

                })
            })
            .then((reponse) => {
                if(!reponse.ok) {
                    throw new Error('Erreur lors de la récupération des dépenses')
                }
                return reponse.json();
            }).then(array => {
                const depensesArray = array.map(depense => new DepenseDTO(depense));
                setDepenses(depensesArray);
                setFiltredView(depensesArray)
            });
    }

    function handleDeleteConfirm() {
        let deletedDepenseConfirm = [...deletedDepense]
        fetch(`http://localhost:8080/financewise/depenses/users/${localStorage.getItem("IDUSER")}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            },
            body: JSON.stringify(deletedDepenseConfirm)
        }).then(reponse => {
            if(!reponse.ok) {
                if(reponse.status === 403) {
                    throw new Error("Erreur 403");
                }
                throw new Error(`Erreur HTTP POST : ${reponse.status} Message : ${reponse.message}`)
            }
            console.log("Dépenses supprimées")
            let remainDepense = depenses.filter(d => !deletedDepenseConfirm.includes(d))
            setDepenses(remainDepense)
            setFiltredView(remainDepense)
            setDeletedDepense([])
        })
    }

    useEffect(() => {
        if (updatedDepense) {
            console.log("Updated depenses have changed:", updatedDepense);
        }
        if (addedDepense) {
            console.log("Added depenses have changed:", addedDepense);
        }
        if (deletedDepense) {
            console.log("Deleted depenses have changed:", deletedDepense);
        }
        if (filtredView) {
            console.log("FiltredView depenses have changed:", filtredView);
        }
    }, [updatedDepense, addedDepense, deletedDepense, filtredView]);
    
    return (
        <section>
            <div className="is-flex flex-direction-row is-justify-content-end is-align-items-center">
                <h2 id="id-edition" className={`text-end marginR1 ${editMode ? "text-orange" : ""}`}
                    onClick={handleEditionMode}>Mode édition</h2>
                <img id="id-edition-icon" src="./src/icon/edition.png" className="marginR5"
                     onClick={handleEditionMode}></img>
            </div>
            <div className="is-flex is-flex-direction-row is-justify-content-start is-align-items-center marginL5">
                <label htmlFor="categorySelect">Filtrer par catégorie :</label>
                <select
                    id="categorySelect"
                    value={selectedCategory}
                    onChange={(e) => changeCategory(e)}
                    className="marginL1"
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map(category => (
                        <option key={category.name} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <img id="img-graph-dep" src={chartImage} alt="Mode graphique" onClick={handleImageClick} className="marginL1"/>
            </div>
            {!showChart ? (
            <div id="container-table">
                <table className="margin-5">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Nom</th>
                        <th>Montant</th>
                        <th>Devise</th>
                        <th>Catégorie</th>
                        <th>Objectif</th>
                        <th id="action-column" className={`text-center ${editMode ? "" : "width2 hidden"}`}>
                            <img className="img-action" src="./src/icon/plus.png" onClick={handleAddDepense}/>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtredView.map((depense, index) => (
                        <tr key={index} className={`${hasBeenDeleted(depense.id) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(depense.id) ? "border-bottom-green" : ""} ${hasBeenUpdated(depense.id) ? "border-bottom-blue" : ""}`}>
                            <td>
                                {editMode && !hasBeenDeleted(depense.id) ?
                                (<input type="date" value={formatDate(depense).toISOString().substr(0, 10)} onChange={(e) => handleInputChanges(e, depense, 'date')}/>)
                                : new Date(depense.date).toLocaleDateString()}
                            </td>
                            <td>
                                {editMode && !hasBeenDeleted(depense.id) ?
                                (<input type="text" value={updatedDepense.find(d => d.id === depense.id)?.name || depense.name} onChange={(e) => handleInputChanges(e, depense, 'name')}/>)
                                : (depense.name)}
                            </td>
                            <td>
                                {editMode && !hasBeenDeleted(depense.id) ?
                                (<input type="number" min={0} value={updatedDepense.find(d => d.id === depense.id)?.montant || depense.montant} onChange={(e) => handleInputChanges(e, depense, 'montant')}/>)
                                : (depense.montant)}
                            </td>
                            <td>
                                {editMode && !hasBeenDeleted(depense.id) ?
                                    (
                                        <select
                                            value={updatedDepense.find(g => g.id === depense.id)?.devise || depense.devise}
                                            onChange={(e) => handleInputChanges(e, depense, 'devise')}>
                                            {devises.map((devise, index) => (
                                                <option key={index} value={devise.name}> {devise.name} </option>))}
                                        </select>
                                    ) : (depense.devise)}
                            </td>

                            <td className={`${hasBeenDeleted(depense.id) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(depense.id) ? " border-bottom-green" : ""} ${hasBeenUpdated(depense.id) ? " border-bottom-blue" : ""}`}>
                                {editMode && !hasBeenDeleted(depense.id) ? (
                                    <select value={depense.getCategoryId} onChange={(e) => handleInputChanges(e, depense, 'categorie')}>
                                        <option value="null">Catégorie non défini</option>
                                        {categories
                                            .filter(category => category.devise === depense.devise)
                                            .map((categorie, index) => (
                                                <option key={index} value={categorie.idCategory}>{categorie.name}</option>
                                            ))}
                                    </select>
                                ) : (
                                    depense.getCategoryName
                                )}
                            </td>

                            <td className={`${hasBeenDeleted(depense.id) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(depense.id) ? " border-bottom-green" : ""} ${hasBeenUpdated(depense.id) ? " border-bottom-blue" : ""}`}>
                                {editMode && !hasBeenDeleted(depense.id) ? (
                                    <select value={depense.getGoalsId} onChange={(e) => handleInputChanges(e, depense, 'objectif')}>
                                        <option value="null">Objectif non défini</option>
                                        {goals
                                            .filter(goal => goal.devise === depense.devise)
                                            .map((goal, index) => (
                                                <option key={index} value={goal.id}>{goal.name}</option>
                                            ))}
                                    </select>
                                ) : (
                                    depense.getGoalsName
                                )}
                            </td>
                            <td key={depense.id}
                                className={`width2 text-center ${editMode ? "" : "hidden"}`}
                                onClick={() => handleCancelOrDelete(depense)}>
                                <img
                                    src={`./src/icon/${hasBeenDeleted(depense.id) || hasBeenUpdated(depense.id) || hasBeenAdded(depense.id) ? "cancel.png" : "delete.png"}`}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            ) : (
                <DepenseChart categories={categories} depenses={filtredView}/>
            )}
            <div id="edit-confirm"
                 className={`is-flex is-flex-direction-row is-justify-content-space-around width85 margin-5 ${editMode ? "" : "hidden"}`}>
                <div onClick={handleCancelChanges}>
                    <h2>Annuler les changements</h2>
                    <img src="./src/icon/cancel.png"/>
                </div>
                <div onClick={handleDeleteConfirm}>
                    <h2>{`Supprimer ${deletedDepense.length} dépenses`}</h2>
                    <img src="./src/icon/delete.png"/>
                </div>
                <div onClick={handleChangeConfirm}>
                    <h2>{`Valider ${addedDepense.length + updatedDepense.length} changements`}</h2>
                    <img src="./src/icon/verifier.png"/>
                </div>
            </div>
        </section>
    );
}

export default Depenses;
