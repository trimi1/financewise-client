import CategoryDTO from './categoryDTO.js';
import GoalsDTO from "./goalsDTO.js";

class DepenseDTO {
    constructor({id = -1, name = "---", montant = 0.0, devise = "---", date = new Date(), categorie = new CategoryDTO(), objectif = new GoalsDTO()} = {}) {
        this.id = id;
        this.name = name;
        this.montant = montant;
        this.date = date;
        this.devise = devise;
        this.categorie = new CategoryDTO(categorie);
        this.objectif = new GoalsDTO(objectif);
    }
}

export default DepenseDTO;
