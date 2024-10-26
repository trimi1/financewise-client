import React, { useState } from "react";
import { Link } from 'react-router-dom';

function Aside() {
    const [isHidden, setIsHidden] = useState(false);

    return  <aside className="is-flex is-justify-content-center is-align-items-center colorBlue">
         <h2 className="text-White border-bottom-white text-center" onClick={() => setIsHidden(!isHidden)}>Menu principal</h2>
    <ul className="is-flex padding-0" style={{ display: isHidden ? "none" : "" }} >
        <li className="is-flex is-justify-content-center button-link-aside">
            <Link to="/depenses" className="text-White">Mes dépenses</Link>
        </li>
        <li className="is-flex is-justify-content-center button-link-aside">
            <a href="/category" className="text-White">Mes catégories</a>
        </li>
        <li className="is-flex is-justify-content-center button-link-aside">
            <Link to="/goals" className="text-White">Mes objectifs</Link>
        </li>
        <li className="is-flex is-justify-content-center button-link-aside">
            <Link to="/advice" className="text-White">Conseils - chat</Link>
        </li>
        <li className="is-flex is-justify-content-center button-link-aside">
            <Link to="/investments" className="text-White">Investissements</Link>
        </li>
        <li className="is-flex is-justify-content-center button-link-aside">
            <Link to="/quizz" className="text-White">Quizz</Link>
        </li>
        <li className="is-flex is-justify-content-center button-link-aside">
            <Link to="/information" className="text-White">Informations</Link>
        </li>
    </ul>
</aside>
}

export default Aside