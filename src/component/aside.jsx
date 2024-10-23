import React from "react";
import { Link } from 'react-router-dom';

function Aside() {
    return  <aside className="is-flex is-justify-content-center is-align-items-center width12 colorBlue">
    <ul className="is-flex is-flex-direction-column padding-0">
        <h2 className="text-size-1-5 text-White border-bottom-white padding-B10">Menu principal</h2>
        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
            <Link to="/depenses" className="text-size-1-3 text-center text-White">Mes dépenses</Link>
        </li>
        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
            <a href="/public" className="text-size-1-3 text-center text-White">Mes catégories</a>
        </li>
        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
            <Link to="/goals" className="text-size-1-3 text-center text-White">Mes objectifs</Link>
        </li>
        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
            <Link to="/advice" className="text-size-1-3 text-center text-White">Conseils - chat</Link>
        </li>
        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
            <Link to="Investments" className="text-size-1-3 text-center text-White">Investissements</Link>
        </li>
        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
            <Link to="/quizz" className="text-size-1-3 text-center text-White">Quizz</Link>
        </li>
        <li className="is-flex is-justify-content-center marginB10 button-link-aside">
            <Link to="/information" className="text-size-1-3 text-center text-White">Informations</Link>
        </li>
    </ul>
</aside>
}

export default Aside