import Header from "./header";
import Aside from "./aside";
import Goals from "./goals";

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