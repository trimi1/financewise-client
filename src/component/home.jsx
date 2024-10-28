import React, { useEffect, useState } from 'react';
import DepenseDTO from "../dto/depenseDTO.js";
import GoalsDTO from "../dto/goalsDTO.js";

function Home() {
    const [fullname, setFullname] = useState("");
    const [depenses, setDepenses] = useState([]);
    const [allDepenses, setAllDepenses] = useState([]);
    const [selectedDevise, setSelectedDevise] = useState("");
    const [selectedDeviseInvestissement, setSelectedDeviseInvestissement] = useState("");
    const [selectedDeviseEconomie, setSelectedDeviseEconomie] = useState("");
    const [devises, setDevises] = useState([]);
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/financewise/users/${localStorage.getItem("IDUSER")}?fields=firstName,lastName`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("TOKEN")}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur HTTP POST : ' + response.status + ' Message : ' + response.message);
                }
                return response.json();
            })
            .then(data => {
                setFullname(data.lastName);
            })
            .catch(error => {
                console.log(error.message);
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
                setAllDepenses(array.map(depense => new DepenseDTO(depense)));
                const depensesThisMonth = array.map(depense => new DepenseDTO(depense))
                    .filter(depense => {
                        const depenseDate = new Date(depense.date).toLocaleDateString("fr-CA", { year: "numeric", month: "2-digit" });
                        return (
                            depenseDate.includes(new Date().toLocaleDateString("fr-CA", { year: "numeric" })) &&
                            depenseDate.includes(new Date().toLocaleDateString("fr-CA", { month: "2-digit" }))
                        );
                    });
                setDepenses(depensesThisMonth);
                setDevises([...new Set(depensesThisMonth.map(depense => depense.devise))]);

                if (depensesThisMonth.length > 0) {
                    setSelectedDevise(depensesThisMonth[0].devise);
                }
            });
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
            .then(array => array.map(goal => new GoalsDTO(goal)))
            .then(array => setGoals(array));
    }, []);

    const validatedGoalsCount = goals.filter(goal => {
        const depensesForGoal = depenses.filter(depense => depense.objectif?.id === goal.id);
        const totalDepenseGoal = depensesForGoal.reduce((total, depense) => total + depense.montant, 0);
        const lastDepenseDate = depensesForGoal.length > 0
            ? new Date(Math.max(...depensesForGoal.map(depense => new Date(depense.date))))
            : null;
        const currentMonth = new Date().toLocaleDateString("fr-CA", { year: "numeric", month: "2-digit" });
        const isLastDepenseThisMonth = lastDepenseDate
            ? lastDepenseDate.toLocaleDateString("fr-CA", { year: "numeric", month: "2-digit" }) === currentMonth
            : false;

        return totalDepenseGoal >= goal.montant && isLastDepenseThisMonth;
    }).length;


    const depenseParDevise = depenses
        .filter(depense => depense.devise === selectedDevise)
        .reduce((total, depense) => total + depense.montant, 0);

    const depensesInvestissement = depenses
        .filter(depense => depense.categorie?.name === "Investissement");

    const depensesEconomie = depenses
        .filter(depense => depense.categorie?.name === "Economie");

    useEffect(() => {
        if (depensesInvestissement.length > 0) {
            setSelectedDeviseInvestissement(depensesInvestissement[0].devise);
        }
        if (depensesEconomie.length > 0) {
            setSelectedDeviseEconomie(depensesEconomie[0].devise);
        }
    }, [depensesInvestissement, depensesEconomie]);

    const totalInvestissement = depensesInvestissement.reduce((total, depense) => total + depense.montant, 0);
    const totalEconomie = depensesEconomie.reduce((total, depense) => total + depense.montant, 0);

    const devisesInvestissement = [...new Set(depensesInvestissement.map(depense => depense.devise))];
    const devisesEconomie = [...new Set(depensesEconomie.map(depense => depense.devise))];

    return (
        <section>
            <h1 className="marginL5">Bienvenue {fullname},</h1>
            <div id="container-grid-2E-2L">
                <article className="colorBlue text-White">
                    <h2>Ce mois-ci :</h2>
                    <h3>- Vous avez fait {depenses.length} dépense(s)</h3>
                    {depenses.length > 0 && (
                        <h3>- Vous avez dépensé {depenseParDevise.toFixed(2)}
                            <select value={selectedDevise} onChange={(e) => setSelectedDevise(e.target.value)}>
                                {devises.map(devise => (
                                    <option key={devise} value={devise}>{devise}</option>
                                ))}
                            </select>
                        </h3>
                    )}
                </article>
                <article className="colorBlue text-White">
                    <h2>Ce mois-ci</h2>
                    <h3>- Vous avez réalisé {depensesInvestissement.length} investissements</h3>
                    {depensesInvestissement.length > 0 && (
                        <h3>
                            - Vous avez investi {totalInvestissement.toFixed(2)}
                            <select value={selectedDeviseInvestissement}
                                    onChange={(e) => setSelectedDeviseInvestissement(e.target.value)}>
                                {devisesInvestissement.map(devise => (
                                    <option key={devise} value={devise}>{devise}</option>
                                ))}
                            </select>,
                            ce qui
                            représente {((totalInvestissement / depenses.reduce((total, depense) => total + depense.montant, 0)) * 100).toFixed(2)}%
                            de vos dépenses
                        </h3>
                    )}
                </article>
                <article className="colorBlue text-White">
                    <h2>Ce mois-ci</h2>
                    {totalEconomie > 0 ? (
                        <h3>- Vous avez économisé {totalEconomie.toFixed(2)}
                            <select value={selectedDeviseEconomie}
                                    onChange={(e) => setSelectedDeviseEconomie(e.target.value)}>
                                {devisesEconomie.map(devise => (
                                    <option key={devise} value={devise}>{devise}</option>
                                ))}
                            </select>,
                            ce qui
                            représente {((totalEconomie / depenses.reduce((total, depense) => total + depense.montant, 0)) * 100).toFixed(2)}%
                            de vos dépenses
                        </h3>
                    ) : (
                        <h3>- Vous n'avez pas économisé ce mois-ci</h3>
                    )}
                </article>
                <article className="colorBlue text-White">
                    <h2>Ce mois-ci</h2>
                    {validatedGoalsCount > 0 ? (
                        <>
                            <h3>- Vous avez réalisé {validatedGoalsCount} objectif(s)</h3>
                            <h3>- Vos objectifs ont avancé
                                de {((validatedGoalsCount / goals.length) * 100).toFixed(2)}%</h3>
                        </>
                    ) : (
                        <h3>Vous n'avez pas validé d'objectif ce mois-ci</h3>
                    )}
                </article>

            </div>
        </section>
    );
}

export default Home;
