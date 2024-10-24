export {GoalsDTO}

class GoalsDTO {

    id = -1;
    name = "";
    montant = 0.0;
    devise = "";
    deadline = new Date();
    recommendation = ""
    
    constructor({id, name, montant, devise, deadline, recommendation} = {}) {
        this.id = id;
        this.name = name;
        this.montant = montant;
        this.devise = devise;
        this.deadline = deadline;
        this.recommendation = recommendation;
    }
}
