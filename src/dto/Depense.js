import Category from './Category.js';
import Goal from './Goal.js';

class Depense {
    constructor(id, name, montant, devise, date, categorie, objectif) {
        this.id = id;
        this.name = name;
        this.montant = montant;
        this.date = date;
        this.devise = devise;
        this.categorie = new Category(categorie.id, categorie.name, categorie.montantMax, categorie.devise);
        this.objectif = new Goal(objectif.id, objectif.name, objectif.devise, objectif.montant, objectif.deadline, objectif.recommendation);
    }
}

export default Depense;
