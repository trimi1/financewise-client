import Header from "../component/header.jsx";
import Home from "../component/home.jsx";
import Aside from "../component/aside.jsx";

function HomePage() {
    return (<>
     <Header />
     <main className="is-flex is-flex-direction-row">
        <Aside />
        <Home />
     </main>
    </>  
    );
}

export default HomePage;