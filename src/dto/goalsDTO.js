class GoalsDTO {
    constructor({id = -1, name = "", montant = 0.0, devise = "", deadline = new Date(), recommendation = ""} = {}) {
        this.id = id;
        this.name = name;
        this.montant = montant;
        this.devise = devise;
        this.deadline = deadline;
        this.recommendation = recommendation;
    }

    setProperty(property, value) {
        switch (property) {
            case 'name':
                this[property] = value;
                break;
            case 'montant':
                this[property] = Number(value);
                break;
            case 'devise':
                this[property] = value;
                break;
            case 'recommendation':
                this[property] = value;
                break;
                break;
            case 'deadline':
                this[property] = new Date(value);
                break;
            default:
                console.error(`Propriété non reconnue : ${property}`);
        }
    }
}

export default GoalsDTO