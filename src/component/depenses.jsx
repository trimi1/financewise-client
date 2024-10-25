import React, { useEffect, useState } from 'react';
import CategoryDTO from "../dto/categoryDTO.js";
import DepenseDTO from "../dto/depenseDTO.js";
import DepenseChart from './depensesChart.jsx';
import DepenseTable from './depenseTable.jsx';
import GoalsDTO from "../dto/goalsDTO.js";

function Depenses() {
    const [depenses, setDepenses] = useState([]);
    const [copyDepenses, setCopyDepenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showChart, setShowChart] = useState(false);
    const [chartImage, setChartImage] = useState("./src/icon/graphic.png");

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
            id: handleAddedGoals.length + copyDepenses.length + 1,
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
                setCopyDepenses([...depensesArray, ...handleAddedGoals]);
            });
    }, []);

    const handleImageClick = () => {
        setEditMode(false)
        setShowChart(!showChart);
        setChartImage(showChart ? "./src/icon/graphic.png" : "./src/icon/liste.png");
    };

    const filteredDepenses = selectedCategory
        ? depenses.filter(depense => depense.categorie.name === selectedCategory)
        : depenses;



    return (
        <section>
            <div className="is-flex flex-direction-row is-justify-content-end is-align-items-center">
                <h2 id="id-edition" className={`text-end marginR1 ${editMode ? "text-orange" : ""}`}
                    onClick={handleEditionMode}>Mode édition</h2>
                <img id="id-edition-icon" src="./src/icon/edition.png" className="marginR5"
                     onClick={handleEditionMode}></img>
            </div>
            <div className="is-flex is-flex-direction-row is-justify-content-start marginL5">
                <label htmlFor="categorySelect">Filtrer par catégorie :</label>
                <select
                    id="categorySelect"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="marginL1"
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map(category => (
                        <option key={category.name} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <img
                    id="img-graph-dep"
                    src={chartImage}
                    alt="Mode graphique"
                    onClick={handleImageClick}
                    className="marginL1"
                />
            </div>
            {!showChart ? (
                <table className="margin-5">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Nom</th>
                        <th>Montant</th>
                        <th>Catégorie</th>
                        <th>Objectif</th>
                        <th id="action-column" className={`text-center ${editMode ? "" : "width2 hidden"}`}><img
                            className="img-action" src="./src/icon/plus.png" onClick={handleAddGoals}/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredDepenses.map(depense => (
                        <tr key={depense.id}>
                            <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === depense.id) ? "border-bottom-red text-red" : ""}`}>{depense.date}</td>
                            <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === depense.id) ? "border-bottom-red text-red" : ""}`}>{depense.name}</td>
                            <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === depense.id) ? "border-bottom-red text-red" : ""}`}>{depense.montant} {depense.devise}</td>
                            <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === depense.id) ? "border-bottom-red text-red" : ""}`}>{depense.categorie.name}</td>
                            <td className={`${handleDeletedGoals.some(deletedGoal => deletedGoal.id === depense.id) ? "border-bottom-red text-red" : ""}`}>{depense.objectif.name}</td>
                            <td key={depense.id}
                                className={`width2 text-center ${editMode ? "" : "hidden"} ${handleDeletedGoals.some(deletedGoal => deletedGoal.id === depense.id) ? " border-bottom-red" : ""}`}
                                onClick={() => handleDeletion(depense)}>
                                <img
                                    src={`./src/icon/${handleDeletedGoals.some(deletedGoal => deletedGoal.id === depense.id) ? "cancel.png" : "delete.png"}`}
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
                    {`Supprimer ${handleDeletedGoals.length} catégories ❌`}
                </h2>
                <h2>
                    {`Valider ${handleAddedGoals.length + handleUpdatedGoals.length} changemnts ✅`}
                </h2>
            </div>
        </section>
    );
}

export default Depenses;
