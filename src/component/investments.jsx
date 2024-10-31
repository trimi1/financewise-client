import React, {useEffect, useState} from 'react';
import CategoryDTO from "../dto/categoryDTO.js";
import DepenseDTO from "../dto/depenseDTO.js";
import DepenseChart from './depensesChart.jsx';
import GoalsDTO from "../dto/goalsDTO.js";

function Investments() {
    const [depenses, setDepenses] = useState([]);
    const [filtredView, setFiltredView] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    function changeCategory(event) {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        let investmentsFiltred = newCategory === "" ? depenses : depenses.filter(depense => depense.categorie.name === newCategory);
        setFiltredView([...investmentsFiltred]);
    }

    useEffect(() => {
        fetch(`http://localhost:8080/financewise/depenses/users/${localStorage.getItem("IDUSER")}?category=Economie&Investissement`, {
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
                const depensesArray = array.map(depense => new DepenseDTO(depense)).filter(depense => depense.objectif !== null)

                //todo: trouver pouruqoi les doublons (même des triples pour economie) sont présents et remplacer cette solution temporaire
                const uniqueDepenses = Array.from(new Map(depensesArray.map(depense => [depense.objectif.id, depense])).values());

                setDepenses(uniqueDepenses)
                setFiltredView(uniqueDepenses)
            });
    }, []);

    function sumDepensesByCategory(category) {
        return depenses
            .filter(depense => depense.categorie && depense.categorie.name === category)
            .reduce((sum, depense) => sum + depense.montant, 0);
    }

    return (
        <section>
            <div className="is-flex is-flex-direction-row is-justify-content-start is-align-items-center marginL5">
                <label htmlFor="categorySelect">Filtrer par catégorie :</label>
                <select
                    id="categorySelect"
                    value={selectedCategory}
                    onChange={(e) => changeCategory(e)}
                    className="marginL1"
                >
                    <option value="">Toutes les catégories</option>
                    <option value="Investissement">Investissement</option>
                    <option value="Economie">Economie</option>
                </select>
            </div>
            <div id="container-table">
                <table className="margin-5">
                    <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Avancement</th>
                        <th>Date limite</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtredView.map((depense, index) => {
                        const rowStyle = depense.categorie.name === "Investissement"
                            ? { backgroundColor: '#e6ddad' }
                            : depense.categorie.name === "Economie"
                                ? { backgroundColor: 'rgba(171,144,238,0.51)' }
                                : {};
                        return (
                            <tr key={index} style={rowStyle}>
                                <td>{depense.objectif.name}</td>
                                <td>{sumDepensesByCategory(depense.categorie.name)} / {depense.objectif.montant}</td>
                                <td>{new Date(depense.objectif.deadline).toLocaleDateString()}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default Investments;