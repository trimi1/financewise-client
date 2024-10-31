import React, {useEffect, useState} from 'react';
import DepenseDTO from "../dto/depenseDTO.js";

function Investments() {
    const [filtredView, setFiltredView] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [expensesDefaultByUsers, setExpensesByUsers] = useState([])
    const [SearchedUser, setSearchedUser] = useState("")
    const [userLastName, setUserLastName] = useState("")
    const [userFirstName, setUserFirstName] = useState("")

    const urlForMainUser = `http://localhost:8080/financewise/depenses/users/${localStorage.getItem("IDUSER")}?category=Economie&category=Investissement`;
    const urlForSearchedUser = `http://localhost:8080/financewise/depenses/users/${localStorage.getItem("IDUSER")}?category=Economie&category=Investissement&lastName=${userLastName}&firstName=${userFirstName}`;
    const urlForAllUser = `http://localhost:8080/financewise/depenses/users/${localStorage.getItem("IDUSER")}?category=Economie&category=Investissement&all=true`;

    function getInvestmentAndEconomieByUrl(url) {
        return fetch(url, {
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
            let expenses = array.map(depense => new DepenseDTO(depense));
            const rowsBlue = [];
            const rowsGreen = [];
            let i = 0;
            let expensesByUsers = new Map()
            for(let expense of expenses) {
                if(!expensesByUsers.has(expense.idUser)) {
                    expensesByUsers.set(expense.idUser, [new Map(), new Map()])
                }

                let expensesI = expensesByUsers.get(expense.idUser)[0];
                let expensesE = expensesByUsers.get(expense.idUser)[1];

                let goalsName = expense.objectif.name;
                let categoryName = expense.categorie.name;
                if(categoryName === "Economie") {
                    expensesE.has(goalsName) ? expensesE.set(goalsName, [...expensesE.get(goalsName), expense]) : expensesE.set(goalsName, [expense]);
                }
    
                if(categoryName === "Investissement") {
                    expensesI.has(goalsName) ? expensesI.set(goalsName, [...expensesI.get(goalsName), expense]) : expensesI.set(goalsName, [expense]);
                }
            }

            expensesByUsers.forEach((expensesUsers, userId) => {
                expensesUsers.forEach(expenses => {
                    let orderedExpenses = Array.from(expenses.keys()).sort(([keyA], [keyB]) => {
                        return keyA.localeCompare(keyB);
                    });

                    for (let key of orderedExpenses) {
                        let value = expenses.get(key);
                        let expense = value[0];
                        i++;
                        const className = expense.categorie.name === "Investissement" ? "text-blue" : "text-green";

                        let row = (
                            <tr key={`${userId}-${key}-${i}`} className={className}>
                                <td>{key}</td>
                                <td>{sumDepensesByCategory(value)} / {expense.objectif.montant !== null ? expense.objectif.montant : "0"}</td>
                                <td>{new Date(expense.objectif.deadline).toLocaleDateString()}</td>
                                <td>{expense.categorie.name}</td>
                            </tr>
                        );

                        if (className === "text-blue") {
                            rowsBlue.push(row);
                        } else {
                            rowsGreen.push(row);
                        }
                    }
                });
            });

            rowsBlue.sort((a, b) => {
                const nameA = a.props.children[0].props.children;
                const nameB = b.props.children[0].props.children;
                return nameA.localeCompare(nameB);
            });

            rowsGreen.sort((a, b) => {
                const nameA = a.props.children[0].props.children;
                const nameB = b.props.children[0].props.children;
                return nameA.localeCompare(nameB);
            });
            setExpensesByUsers([...rowsBlue, ...rowsGreen])
            setFiltredView([...rowsBlue, ...rowsGreen]);
        });
    }

    useEffect(() => {
        getInvestmentAndEconomieByUrl(urlForMainUser)
    }, []);

    function searchForMainUserInvestments() {
        getInvestmentAndEconomieByUrl(urlForMainUser)
        setSelectedCategory("")
    }

    function searchForUserInvestments() {
        getInvestmentAndEconomieByUrl(urlForSearchedUser)
        setSelectedCategory("")
    }

    function searchAllInvestmentsAndEconomics() {
        getInvestmentAndEconomieByUrl(urlForAllUser)
        setSelectedCategory("")
    }
    

    function changeCategory(event) {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
    
        let filteredExpenses = expensesDefaultByUsers;
    
        if (newCategory === "Economie") {
            filteredExpenses = expensesDefaultByUsers.filter(row => row.props.className === "text-green");
        } else if (newCategory === "Investissement") {
            filteredExpenses = expensesDefaultByUsers.filter(row => row.props.className === "text-blue");
        }
    
        setFiltredView(filteredExpenses);
    }

    function handleSearchedUser(event) {
        setSearchedUser(event.target.value)
    }

    useEffect(() => {
        let fullName = SearchedUser.split(" ");
        console.log(fullName);
        setUserLastName(fullName[0] !== undefined ? fullName[0] : "")
        setUserFirstName(fullName[1] !== undefined ? fullName[1] : "")
    });

    function sumDepensesByCategory(depense) {
        return depense.reduce((sum, d) => sum + d.montant, 0).toFixed(2); 
    }

    return (
        <section>
            <div className="is-flex flex-direction-row is-justify-content-end is-align-items-center marginR5">
                <label className="is-flex is-flex-direction-column"> Recherche : Nom ({userLastName}) | prénom ({userFirstName})
                    <div className="is-flex is-flex-direction-row marginT2">
                        <input type="text" placeholder="Rechercher une personne" onChange={(e) => handleSearchedUser(e)}/>
                        <img src="./src/icon/loupe.png" className="marginL5 marginR5" onClick={searchForUserInvestments}></img>
                    </div>
                </label>
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
                    <option value="Investissement">Investissement</option>
                    <option value="Economie">Economie</option>
                </select>
            </div>
            <div id="id-blue-selection-investment">
                <h3 onClick={searchForMainUserInvestments}>
                   {"Mes investissements, économies"} 
                </h3>
                <h2>
                    |
                </h2>
                <h3 onClick={searchAllInvestmentsAndEconomics}>
                    {"Investissement, économies des utilisateurs"}
                </h3>
            </div>
            <div id="container-table">
                <table className="margin-5">
                    <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Avancement</th>
                        <th>Date limite</th>
                        <th>Type</th>
                    </tr>
                    </thead>
                    <tbody>
                        {filtredView}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default Investments;