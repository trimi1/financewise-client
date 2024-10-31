import CategoryDTO from './categoryDTO.js';
import GoalsDTO from "./goalsDTO.js";

class DepenseDTO {
    constructor({id = -1, name = "---", montant = 0.0, devise = "---", date = new Date(), categorie = null, objectif = null, idUser = null} = {}) {
        this.id = id;
        this.name = name;
        this.montant = montant;
        this.date = date;
        this.devise = devise;
        this.categorie = categorie === null ? null : new CategoryDTO(categorie);
        this.objectif = objectif === null ? null : new GoalsDTO(objectif);
        this.idUser = idUser;
    }

    get getCategoryId() {
        return this.categorie === null ? "null" : this.categorie.idCategory;
    }

    get getCategoryName() {
        return this.categorie === null ? "Catégorie non défini" : this.categorie.name;
    }

    get getGoalsId() {
        return this.objectif === null ? "null" : this.objectif.id;
    }

    get getGoalsName() {
        return this.objectif === null ? "Objectif non défini": this.objectif.name
    }

    setProperty(property, value) {
        switch(property) {
            case 'name':
                this[property] = value
                break;
            case 'montant':
                this[property] = Number(value)
                break;
            case 'devise' :
                this[property] = value;
                break;
            case 'date' :
                this[property] = new Date(value);
                break;
            case 'categorie' :
                this[property] = value;
                break;
            case 'objectif':
                this[property] = value;
                break;
        }
    }
}

export default DepenseDTO;
