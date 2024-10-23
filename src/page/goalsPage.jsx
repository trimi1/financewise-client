import Header from "../component/header.jsx";
import Aside from "../component/aside.jsx";
import Goals from "../component/goals.jsx";

function GoalsPage() {
    return (<>
     <Header />
     <main className="is-flex is-flex-direction-row">
        <Aside />
        <Goals />
     </main>
    </>  
    );
}

export default GoalsPage;