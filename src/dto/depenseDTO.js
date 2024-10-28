import CategoryDTO from './categoryDTO.js';
import GoalsDTO from "./goalsDTO.js";
import categoryDTO from "./categoryDTO.js";

class DepenseDTO {
    constructor({id = -1, name = "---", montant = 0.0, devise = "---", date = new Date(), categorie = null, objectif = null} = {}) {
        this.id = id;
        this.name = name;
        this.montant = montant;
        this.date = date;
        this.devise = devise;
        this.categorie = categorie === null ? null : new CategoryDTO(categorie);
        this.objectif = objectif === null ? null : new GoalsDTO(objectif);
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
                this[property] = new CategoryDTO(value);
                break;
            case 'objectif':
                this[property] = value;
                break;
        }
    }
}

export default DepenseDTO;
