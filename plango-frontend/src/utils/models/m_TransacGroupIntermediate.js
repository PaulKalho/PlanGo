import Model from "./model"

class m_TransactionGroupIntermediate {
    constructor() {
        this.m_TransactionGroupIntermediate_List = []
        this.TransactionGroupIntermediateObj = {}
        this.m_apiEndpoint = process.env.REACT_APP_TRANSCINTERMEDIATE_ENDPOINT
        this.m_TransactionGroupIntermediateTable = new Model(
            this, 
            this.m_apiEndpoint,
            "m_TransactionGroupIntermediate_List",
            "m_TransactionGroupIntermediateObj"
        )
    }

    async m_TransactionGroupIntermediate_FindAll() {
        return this.m_TransactionGroupIntermediateTable.findAll()
    }

    async m_TransactionGroupIntermediate_FindBy(id, options) {
        return this.m_TransactionGroupIntermediateTable.findBy()
    }

    async m_TransactionGroupIntermediate_insert(payload) {
        return this.m_TransactionGroupIntermediateTable.insert(payload)
    }

    async m_TransactionGroupIntermediate_deleteBy(payload) {
        return this.m_TransactionGroupIntermediateTable.deleteBy(payload)
    }

}

export default m_TransactionGroupIntermediate