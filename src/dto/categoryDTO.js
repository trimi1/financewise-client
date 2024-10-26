class CategoryDTO {
    constructor({id = -1, name = "---", montantMax = 0, devise = "---"} = {}) {
        this.id = id;
        this.name = name;
        this.montantMax = montantMax;
        this.devise = devise;
    }
}

export default CategoryDTO;