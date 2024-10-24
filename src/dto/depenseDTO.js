import CategoryDTO from './categoryDTO.js';
import {GoalsDTO} from "./goalsDTO.js";

class DepenseDTO {
    constructor(id, name, montant, devise, date, categorie, objectif) {
        this.id = id;
        this.name = name;
        this.montant = montant;
        this.date = date;
        this.devise = devise;
        this.categorie = new CategoryDTO(categorie.id, categorie.name, categorie.montantMax, categorie.devise);
        this.objectif = new GoalsDTO(objectif);
    }
}

export default DepenseDTO;
