import React, { useEffect, useState } from "react";
import CategoryDTO from "../dto/categoryDTO.js";

function Categories() {
    const [idCreation, setIdCreation] = useState(-1)
    const [editMode, setEditMode] = useState(false)
    const [defaultCategories, setDefaultCategories] = useState([])
    const [viewCategories, setViewCategories] = useState([])
    const [addedCategories, setAddedCategories] = useState([])
    const [updatedCategories, setUpdatedCategories] = useState([])
    const [deletedCategories, setDeletedCategories] = useState([])
    const [devises, setDevises] = useState([])

    // Return true or false if the category (id) is in addedCategories
    function hasBeenAdded(id) {
        return addedCategories.some(addedCategory => addedCategory.idCategory === id)
    }

    // Return true or false if the category (id) is in updatedCategories
    function hasBeenUpdated(id) {
        return updatedCategories.some(updatedCategory => updatedCategory.idCategory === id)
    }

    // Return true or false if the category (id) is in deletedCategories
    function hasBeenDeleted(id) {
        return deletedCategories.some(deletedCategory => deletedCategory.idCategory === id)
    }

    // Load all currencies and update the state of currencies at the first load of the component
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
    // Load all categories and update the state of default categories and view at the first load of the component.
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`http://localhost:8080/financewise/categories/users/${localStorage.getItem("IDUSER")}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Pas de réponse serveur');
                }
                const data = await response.json()
                setDefaultCategories(data)
                setViewCategories(data)
            } catch (error) {
                console.error('Erreur :', error);
            }
        }

        fetchCategories();
    }, []);

    // Handle all processes of changing inputs in edit mode.
    function handleInputChange(event, category, field) {
        let categoryCompare = hasBeenUpdated(category.idCategory)
            ? new CategoryDTO(updatedCategories.find(c => c.idCategory === category.idCategory))
            : new CategoryDTO(category);

        categoryCompare.setProperty(field, event.target.value);

        let isEqual = defaultCategories.some(c => JSON.stringify(c) === JSON.stringify(categoryCompare));
        if (isEqual) {
            if (hasBeenUpdated(category.idCategory)) {
                let index = updatedCategories.findIndex(c => c.idCategory === category.idCategory);
                setUpdatedCategories(updatedCategories.filter((_, i) => i !== index));
                index = viewCategories.findIndex(c => c.idCategory === category.idCategory);
                let defaultCategory = defaultCategories.find(c => c.idCategory === category.idCategory);
                setViewCategories([...viewCategories.slice(0, index), defaultCategory, ...viewCategories.slice(index + 1)]);
            }
        } else {
            if (hasBeenAdded(category.idCategory)) {
                let index = addedCategories.findIndex(c => c.idCategory === category.idCategory);
                let updatedCategory = addedCategories[index];
                updatedCategory.setProperty(field, event.target.value);
                setAddedCategories([...addedCategories.slice(0, index), updatedCategory, ...addedCategories.slice(index + 1)]);
                index = viewCategories.findIndex(c => c.idCategory === updatedCategory.idCategory);
                setViewCategories([...viewCategories.slice(0, index), updatedCategory, ...viewCategories.slice(index + 1)]);
            } else {
                let index = updatedCategories.findIndex(c => c.idCategory === category.idCategory);
                let updatedCategory = hasBeenUpdated(category.idCategory) ? updatedCategories[index] : new CategoryDTO(category);
                updatedCategory.setProperty(field, event.target.value);
                hasBeenUpdated(category.idCategory)
                    ? setUpdatedCategories([...updatedCategories.slice(0, index), updatedCategory, ...updatedCategories.slice(index + 1)])
                    : setUpdatedCategories(prevUpdatedCategories => [...prevUpdatedCategories, updatedCategory]);
                let indexCategory = viewCategories.findIndex(c => c.idCategory === updatedCategory.idCategory);
                setViewCategories([...viewCategories.slice(0, indexCategory), updatedCategory, ...viewCategories.slice(indexCategory + 1)]);
            }
        }
    }

    function handleEditionMode(event) {
        event.preventDefault();
        setEditMode(!editMode);
        setAddedCategories([]);
        setUpdatedCategories([]);
        setDeletedCategories([]);
        setViewCategories(defaultCategories);
    }

    function handleAddCategory() {
        const newCategory = new CategoryDTO({
            id: idCreation,
            name: "Nouvelle Catégorie",
            montantMax: 0,
            devise: "Euro",
        });

        setAddedCategories(prevAddedCategories => {
            const newAddedCategories = [...prevAddedCategories, newCategory];
            setViewCategories(prevViewCategories => [...prevViewCategories, newCategory]);
            return newAddedCategories;
        });

        setIdCreation(idCreation - 1);
    }

    function handleCancelOrDelete(category) {
        if (hasBeenAdded(category.idCategory)) {
            let index = addedCategories.findIndex(c => c.idCategory === category.idCategory);
            const updatedAddedCategories = addedCategories.filter((_, i) => i !== index);
            setAddedCategories(updatedAddedCategories);
            setViewCategories([...defaultCategories, ...updatedAddedCategories]);
            return;
        }

        if (hasBeenUpdated(category.idCategory)) {
            let index = updatedCategories.findIndex(c => c.idCategory === category.idCategory);
            setUpdatedCategories(updatedCategories.filter((_, i) => i !== index));
            let defaultCategory = defaultCategories.find(c => c.idCategory === category.idCategory);
            setViewCategories([...viewCategories.slice(0, index), defaultCategory, ...viewCategories.slice(index + 1)]);
            return;
        }

        hasBeenDeleted(category.idCategory)
            ? setDeletedCategories(deletedCategories.filter(deletedCategory => deletedCategory.idCategory !== category.idCategory))
            : setDeletedCategories([...deletedCategories, category]);
    }

    function handleCancelChanges() {
        setAddedCategories([]);
        setUpdatedCategories([]);
        setDeletedCategories([]);
        setViewCategories([...defaultCategories]);
    }

    function handleChangeConfirm() {
        let addCategoriesConfirm = [...addedCategories];
        addCategoriesConfirm.forEach(c => c.idCategory = -1);
        addCategoriesConfirm.push(...updatedCategories);
        fetch(`http://localhost:8080/financewise/categories/users/${localStorage.getItem("IDUSER")}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            },
            body: JSON.stringify(addCategoriesConfirm),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Erreur lors de la confirmation des ajouts');
                console.log("Ajout confirmé !");
                setAddedCategories([]);
                setUpdatedCategories([]);
                return fetch(`http://localhost:8080/financewise/categories/users/${localStorage.getItem("IDUSER")}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
                    }
                });
            })
            .then((response) => {
                if (!response.ok) throw new Error('Erreur lors de la récupération des catégories');
                return response.json();
            })
            .then((data) => {
                setDefaultCategories(data);
                setViewCategories(data);
            })
            .catch((error) => {
                console.error('Erreur :', error.message);
            });
    }

    function handleDeleteConfirm() {
        let deletedCategoriesConfirm = [...deletedCategories];
        fetch(`http://localhost:8080/financewise/categories/users/${localStorage.getItem("IDUSER")}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            },
            body: JSON.stringify(deletedCategoriesConfirm),
        }).then((response) => {
                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error("Erreur : 403");
                    }
                    throw new Error('Erreur HTTP POST : ' + response.status + ' Message : ' + response.message);
                }
                console.log("Catégories supprimées !");
                setDeletedCategories([]);
                let remainingCategories = defaultCategories.filter(element => !deletedCategoriesConfirm.includes(element));
                setDefaultCategories(remainingCategories);
                setViewCategories(remainingCategories);
                setDeletedCategories([]);
            }).catch((error) => {
                console.log(error.message)
            });
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
                    <th>Montant Max</th>
                    <th>Devise</th>
                    <th id="action-column" className={`text-center ${editMode ? "" : "width2 hidden"}`}><img className="img-action" src="./src/icon/plus.png" onClick={handleAddCategory}/></th>
                </tr>
                </thead>
                <tbody>
                {viewCategories.map((category, index) => (
                    <tr key={index}>
                        <td className={`${hasBeenDeleted(category.idCategory) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(category.idCategory) ? " border-bottom-green" : ""} ${hasBeenUpdated(category.idCategory) ? " border-bottom-blue" : ""}`}>
                            {editMode && !hasBeenDeleted(category.idCategory) ? (
                                <input type="text" value={updatedCategories.find(c => c.idCategory === category.idCategory)?.name || category.name} onChange={(e) => handleInputChange(e, category, 'name')}/>
                            ) : (category.name)}
                        </td>
                        <td className={`${hasBeenDeleted(category.idCategory) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(category.idCategory) ? " border-bottom-green" : ""} ${hasBeenUpdated(category.idCategory) ? " border-bottom-blue" : ""}`}>
                            {editMode && !hasBeenDeleted(category.idCategory) ? (
                                <input type="number" value={updatedCategories.find(c => c.idCategory === category.idCategory)?.montantMax || category.montantMax} onChange={(e) => handleInputChange(e, category, 'montantMax')}/>
                            ) : (category.montantMax)}
                        </td>
                        <td className={`${hasBeenDeleted(category.idCategory) ? "border-bottom-red text-red" : ""} ${hasBeenAdded(category.idCategory) ? " border-bottom-green" : ""} ${hasBeenUpdated(category.idCategory) ? " border-bottom-blue" : ""}`}>
                            {editMode && !hasBeenDeleted(category.idCategory) ? (
                                <select value={updatedCategories.find(c => c.idCategory === category.idCategory)?.devise || category.devise} onChange={(e) => handleInputChange(e, category, 'devise')}>
                                    {devises.map((devise, index) => (
                                        <option key={index} value={devise.name}> {devise.name} </option>
                                    ))}
                                </select>
                            ) : (category.devise)}
                        </td>
                        <td key={category.idCategory} className={`width2 text-center ${editMode ? "" : "hidden"} ${hasBeenDeleted(category.idCategory) ? " border-bottom-red" : ""} ${hasBeenAdded(category.idCategory) ? " border-bottom-green" : ""} ${hasBeenUpdated(category.idCategory) ? " border-bottom-blue" : ""}`} onClick={() => handleCancelOrDelete(category)}>
                            <img src={`./src/icon/${hasBeenDeleted(category.idCategory) || hasBeenUpdated(category.idCategory) || hasBeenAdded(category.idCategory) ? "cancel.png" : "delete.png"}`} className="img-action"/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        <div id="edit-confirm" className={`is-flex is-flex-direction-row is-justify-content-space-around width85 margin-5 ${editMode ? "" : "hidden"}`}>
            <h2 onClick={handleCancelChanges}>
                Annuler les changements 🔄️
            </h2>
            <h2 onClick={handleDeleteConfirm}>
                {`Supprimer ${deletedCategories.length} catégories ❌`}
            </h2>
            <h2 onClick={handleChangeConfirm}>
                {`Valider ${addedCategories.length + updatedCategories.length} changements ✅`}
            </h2>
        </div>
    </section>
}

export default Categories;