import Header from "./header";
import Home from "./home";
import Aside from "./aside";

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