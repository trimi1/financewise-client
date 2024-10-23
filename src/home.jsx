import React from 'react';

const Home = () => {
    return (<section>
                <h1 className="marginL5">Bienvenue :</h1>
                <div className="container-grid-2E-2L height-80">
                        <article className="colorBlue text-White margin-5 height-70">
                            <h2 className="marginL5 marginR5">Ce mois-ci :</h2>
                            <h3 className="marginL5 marginR5">- Vous avez fait aucune dépense</h3>
                            <h3 className="marginL5 marginR5">- Vous avez dépensé 0 euros</h3>
                            <h3 className="marginL5 marginR5">- Votre catégorie la plus utilisée est "Famille" pour un total de 0 euros</h3>
                        </article>
                        <article className="colorBlue text-White margin-5 height-70">
                            <h2 className="marginL5">Ce mois-ci</h2>
                            <h3 className="marginL5">- Vous avez investi 0 euros, ce qui représente 0% de vos dépenses</h3>
                            <h3 className="marginL5">- Vous avez réalisé 0 investissements</h3>
                        </article>
                        <article className="colorBlue text-White margin-5 height-70">
                            <h2 className="marginL5 marginR5">Ce mois-ci</h2>
                            <h3 className="marginL5 marginR5">- Vous avez mis 0 euros de côté, ce qui représente 0% de vos dépenses</h3>
                        </article>
                        <article className="colorBlue text-White margin-5 height-70">
                            <h2 className="marginL5">Ce mois-ci</h2>
                            <h3 className="marginL5">- Vous avez réalisé 0 objectifs</h3>
                            <h3 className="marginL5">- Vos objectifs ont avancé de 0%</h3>
                        </article>
                    </div>
                </section>
    );
};

export default Home;
