class GoalsDTO {
    constructor({id = -1, name = "", montant = 0.0, devise = "", deadline = new Date(), recommendation = ""} = {}) {
        this.id = id;
        this.name = name;
        this.montant = montant;
        this.devise = devise;
        this.deadline = deadline;
        this.recommendation = recommendation;
    }
}

export default GoalsDTO