import React from 'react';
import './resources/style.css';

const App = () => {
    return (
        <>
            <header className="is-flex is-flex-direction-row is-justify-content-space-between heightVM5 color-light-grey">
                <div id="name-project-link" className="is-flex is-align-items-center is-justify-content-center width12 colorBlue border-bottom-white">
                    <a href="/" className="is-flex is-justify-content-center is-align-items-center text-size-1-3 text-White">Finance Wise</a>
                </div>
                <div id="root" className="is-flex is-justify-content-center is-align-items-center marginR5"></div>
            </header>

            <main className="is-flex is-flex-direction-row">
                <aside className="is-flex is-justify-content-center is-align-items-center width12 colorBlue">
                    <ul className="is-flex is-flex-direction-column padding-0">
                        <h2 className="text-size-1-5 text-White border-bottom-white padding-B10">Menu principal</h2>
                        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
                            <a href="/" className="text-size-1-3 text-center text-White">Mes dépenses</a>
                        </li>
                        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
                            <a href="/" className="text-size-1-3 text-center text-White">Mes catégories</a>
                        </li>
                        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
                            <a href="/" className="text-size-1-3 text-center text-White">Mes objectifs</a>
                        </li>
                        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
                            <a href="/" className="text-size-1-3 text-center text-White">Conseils - chat</a>
                        </li>
                        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
                            <a href="/" className="text-size-1-3 text-center text-White">Investissements</a>
                        </li>
                        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
                            <a href="/" className="text-size-1-3 text-center text-White">Quizz</a>
                        </li>
                        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
                            <a href="/" className="text-size-1-3 text-center text-White">Informations</a>
                        </li>
                    </ul>
                </aside>

                <section>
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
            </main>
        </>
    );
};

export default App;
