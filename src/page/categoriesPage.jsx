import Header from "../component/header.jsx";
import Aside from "../component/aside.jsx";
import Categories from "../component/categories.jsx";

function CategoriesPage() {
    return (<>
     <Header />
     <main className="is-flex is-flex-direction-row">
        <Aside />
        <Categories />
     </main>
    </>
    );
}

export { CategoriesPage };