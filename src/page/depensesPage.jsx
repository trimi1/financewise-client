import React from 'react';
import Header from "../component/header.jsx";
import Aside from "../component/aside.jsx";
import Depenses from "../component/depenses.jsx";

function DepensesPage() {

    return (<>
        <Header />
        <main className="is-flex is-flex-direction-row">
            <Aside />
            <Depenses />
        </main>
        </>
    )
}

export { DepensesPage };