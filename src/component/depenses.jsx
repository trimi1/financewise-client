import React, { useEffect, useState } from 'react';
import CategoryDTO from "../dto/categoryDTO.js";
import DepenseDTO from "../dto/depenseDTO.js";
import DepenseChart from './depensesChart.jsx';
import DepenseTable from './depenseTable.jsx';

function Depenses() {
    const [depenses, setDepenses] = useState([]);
    const [copyDepenses, setCopyDepenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showChart, setShowChart] = useState(false);
    const [chartImage, setChartImage] = useState("./src/icon/graphic.png");

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
                setCopyDepenses(depensesArray);
            });
    }, []);

    const handleImageClick = () => {
        setShowChart(!showChart);
        setChartImage(showChart ? "./src/icon/graphic.png" : "./src/icon/liste.png");
    };

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
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                />
            </div>

            {!showChart ? (
                <DepenseTable depenses={copyDepenses} selectedCategory={selectedCategory} />
            ) : (
                <DepenseChart categories={categories} depenses={copyDepenses} />
            )}
        </section>
    );
}

export default Depenses;
