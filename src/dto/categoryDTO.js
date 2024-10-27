class CategoryDTO {
    constructor({idCategory = -1, name = "---", montantMax = 0, devise = "---"} = {}) {
        this.idCategory = idCategory;
        this.name = name;
        this.montantMax = montantMax;
        this.devise = devise;
    }

    setProperty(property, value) {
        switch (property) {
            case 'name':
                this[property] = value;
                break;
            case 'montantMax':
                this[property] = Number(value);
                break;
            case 'devise':
                this[property] = value;
                break;
            default:
                console.error(`Propriété non reconnue : ${property}`);
        }
    }
}

export default CategoryDTO;