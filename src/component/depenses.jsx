import React, {useEffect, useState} from 'react';
import CategoryDTO from "../dto/categoryDTO.js";
import DepenseDTO from "../dto/depenseDTO.js";
import DepenseChart from './depensesChart.jsx';
import GoalsDTO from "../dto/goalsDTO.js";

function Depenses() {
    const [depenses, setDepenses] = useState([]);
    const [copyDepenses, setCopyDepenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
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
        return addedDepense.some(updatedDepense => addedDepense.id === id);
    }

    function hasBeenDeleted(id) {
        return addedDepense.some(deletedDepense => addedDepense.id === id);
    }

    function handleInputChanges(event, depense, field) {
        let depenseCompare = hasBeenUpdated(depense.id) ? new DepenseDTO(updatedDepense.find(d => d.id === depense.id)) : new DepenseDTO(depense)
        depenseCompare.setProperty(field, event.target.value)

        let isEqual = depenses.some(d => JSON.stringify(d) === JSON.stringify(depenseCompare));
        if(isEqual) {
            if(hasBeenUpdated(depense.id)) {
                let index = updatedDepense.findIndex(d => d.id === depense.id);
                setUpdatedDepense(updatedDepense.filter((_, i) => i !== index));
                setCopyDepenses([...depenses]);
            }
        } else {
            if(hasBeenAdded(depense.id)) {
                let index = addedDepense.findIndex(d => d.id === depense.id);
                let updateDepense = addedDepense[index];
                updateDepense.setProperty(field, event.target.value)
                setAddedDepense([...addedDepense.slice(0, index), updateDepense, ...addedDepense.slice(index+1)]);
                index = copyDepenses.findIndex(d => d.id === updateDepense.id)
                setCopyDepenses([...copyDepenses.slice(0, index), updateDepense, ...copyDepenses.slice(index+1)]);
            } else {
                let index = updatedDepense.findIndex(d => d.id === depense.id);
                let updateDepense = hasBeenUpdated(depense.id) ? updatedDepense[index] : new DepenseDTO(depense);
                updateDepense.setProperty(field, event.target.value)
                hasBeenUpdated(depense.id) ? setUpdatedDepense([updatedDepense.slice(0, index), updateDepense, [updatedDepense.slice(index+1)]])
                    : setUpdatedDepense(prevUpdate => {
                        return [...prevUpdate, updateDepense]
                    });
                let indexDepense = copyDepenses.findIndex(d => d.id === updateDepense.id);
                setCopyDepenses([...copyDepenses.slice(0, indexDepense), updateDepense, ...copyDepenses.slice(indexDepense+1)]);
            }
        }
    }


    function handleEditionMode(event) {
        event.preventDefault();
        setEditMode(!editMode)
        setAddedDepense([])
        setUpdatedDepense([])
        setDeletedDepense([])
        setCopyDepenses(depenses)
    }

    function handleAddDepense() {
        const newDepense = new DepenseDTO({
            id: idCreation,
            name: "Nouvelle dépense",
            montant: 0.0,
            devise: "Euro",
            date: new Date()
        })

        setAddedDepense((prevAddDepense) => {
            const newAddedDepense = [...prevAddDepense, newDepense];
            setCopyDepenses((prevAddDepense) => [...prevAddDepense, newAddedDepense]);
            return newAddedDepense;
        });

        setIdCreation(idCreation - 1);
    }

    function handleCancelOrDelete(depense) {
        if(hasBeenAdded(depense.id)) {
            let index = addedDepense.findIndex(d => d.id === depense.id);
            const updateAddedDepense = addedDepense.filter((_, i) => i !== index);
            setAddedDepense(updateAddedDepense);
            setCopyDepenses([...depenses, ...updateAddedDepense]);
            return;
        }

        if(hasBeenUpdated(depense.id)) {
            let index = updatedDepense.findIndex(d => d.id === depense.id);
            setUpdatedDepense(updatedDepense.filter((_, i) => i !== index));
            setCopyDepenses([...copyDepenses])
            return;
        }

        hasBeenDeleted(depense.id) ? setDeletedDepense(deletedDepense.filter(deletedDepense => deletedDepense.id !== depense.id)) : setDeletedDepense([...deletedDepense, depense]);
    }

    function handleCancelChanges() {
        setAddedDepense([])
        setUpdatedDepense([])
        setDeletedDepense([])
        setCopyDepenses([...depenses])
    }



    useEffect(() => {
        fetch(`http://localhost:8080/financewise/category/users/${localStorage.getItem("IDUSER")}`, {
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
                setCopyDepenses(depensesArray)
            });
    }, []);

    const handleImageClick = () => {
        setEditMode(false)
        setShowChart(!showChart);
        setChartImage(showChart ? "./src/icon/graphic.png" : "./src/icon/liste.png");
    };

    const filteredDepenses = selectedCategory
        ? copyDepenses.filter(depense => depense.categorie.name === selectedCategory)
        : copyDepenses;

    function formatDate(depense) {
        const date = updatedDepense.find(g => g.id === depense.id)?.date || depense.date
        return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000)
    }


    return (
        <section>
            <div className="is-flex is-flex-direction-row is-justify-content-end">
                <label htmlFor="categorySelect">Filtrer par catégorie :</label>
                <select
                    id="categorySelect"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="margin-left"
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map(category => (
                        <option key={category.name} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <img
                    src={chartImage}
                    alt="Mode graphique"
                    onClick={handleImageClick}
                    style={{cursor: 'pointer', marginLeft: '10px'}}
                />
            </div>
            <div className="is-flex flex-direction-row is-justify-content-end is-align-items-center">
                <h2 id="id-edition" className={`text-end marginR1 ${editMode ? "text-orange" : ""}`}
                    onClick={handleEditionMode}>Mode édition</h2>
                <img id="id-edition-icon" src="./src/icon/edition.png" className="marginR5"
                     onClick={handleEditionMode}></img>
            </div>
            {!showChart ? (
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
                    {filteredDepenses.map((depense, index) => (
                        <tr key={index}>
                            <td className={`${hasBeenDeleted(depense.id) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(depense.id) ? "border-bottom-green" : ""} ${hasBeenUpdated(depense.id) ? "border-bottom-blue" : ""}`}>
                                {editMode && !hasBeenDeleted(depense.id) ? (
                                    <input type="date" value={formatDate(depense).toISOString().substr(0, 10)}
                                           onChange={(e) => handleInputChanges(e, depense, 'date')}/>) : new Date(depense.date).toLocaleDateString()}
                            </td>
                            <td className={`${hasBeenDeleted(depense.id) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(depense.id) ? "border-bottom-green" : ""} ${hasBeenUpdated(depense.id) ? "border-bottom-blue" : ""}`}>
                                {editMode && !hasBeenDeleted(depense.id) ? (<input type="text"
                                                                                   value={updatedDepense.find(d => d.id === depense.id)?.name || depense.name}
                                                                                   onChange={(e) => handleInputChanges(e, depense, 'name')}/>) : (depense.name)}
                            </td>
                            <td className={`${hasBeenDeleted(depense.id) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(depense.id) ? "border-bottom-green" : ""} ${hasBeenUpdated(depense.id) ? "border-bottom-blue" : ""}`}>
                                {editMode && !hasBeenDeleted(depense.id) ? (<input type="number"
                                                                                   value={updatedDepense.find(d => d.id === depense.id)?.montant || depense.montant}
                                                                                   onChange={(e) => handleInputChanges(e, depense, 'montant')}/>) : (depense.montant)}
                            </td>
                            <td className={`${hasBeenDeleted(depense.id) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(depense.id) ? " border-bottom-green" : ""} ${hasBeenUpdated(depense.id) ? " border-bottom-blue" : ""}`}>
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
                                {editMode && !hasBeenDeleted(depense.id) ?
                                    (
                                        <select
                                            value={updatedDepense.find(g => g.id === depense.id)?.categorie.name || depense.categorie.name}
                                            onChange={(e) => handleInputChanges(e, depense, 'categorie')}>
                                            {categories.map((categorie, index) => (
                                                <option key={index}
                                                        value={categorie.name}> {categorie.name} </option>))}
                                        </select>
                                    ) : (depense.categorie.name)}
                            </td>

                            <td className={`${hasBeenDeleted(depense.id) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(depense.id) ? " border-bottom-green" : ""} ${hasBeenUpdated(depense.id) ? " border-bottom-blue" : ""}`}>
                                {editMode && !hasBeenDeleted(depense.id) ?
                                    (
                                        <select
                                            value={updatedDepense.find(g => g.id === depense.id)?.categorie.name || depense.categorie.name}
                                            onChange={(e) => handleInputChanges(e, depense, 'goal')}>
                                            {goals.map((goal, index) => (
                                                <option key={index}
                                                        value={goal.name}> {goal.name} </option>))}
                                        </select>
                                    ) : (depense.objectif.name)}
                            </td>
                            <td key={depense.id}
                                className={`width2 text-center ${editMode ? "" : "hidden"} ${hasBeenDeleted(depense.id) ? " border-bottom-red" : ""} ${hasBeenAdded(depense.id) ? " border-bottom-green" : ""} ${hasBeenUpdated(depense.id) ? " border-bottom-blue" : ""}`}
                                onClick={() => handleCancelOrDelete(depense)}>
                                <img
                                    src={`./src/icon/${hasBeenDeleted(depense.id) || hasBeenUpdated(depense.id) || hasBeenAdded(depense.id) ? "cancel.png" : "delete.png"}`}
                                    className="img-action"/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <DepenseChart categories={categories} depenses={copyDepenses}/>
            )}
            <div id="edit-confirm"
                 className={`is-flex is-flex-direction-row is-justify-content-space-around width85 margin-5 ${editMode ? "" : "hidden"}`}>
                <h2 onClick={handleCancelChanges}>
                    Annuler les changements 🔄️
                </h2>
                <h2>
                    {`Supprimer ${deletedDepense.length} dépenses ❌`}
                </h2>
                <h2>
                    {`Valider ${addedDepense.length + updatedDepense.length} changements ✅`}
                </h2>
            </div>
        </section>
    );
}

export default Depenses;
