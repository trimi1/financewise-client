import React from 'react';
import Header from "../component/header.jsx";
import Aside from "../component/aside.jsx";
import Investments from "../component/investments.jsx";

function InvestmentsPage() {

        return (<>
            <Header />
            <main className="is-flex is-flex-direction-row">
                <Aside />
                <Investments />
            </main>
            </>
        )
}

export { InvestmentsPage };