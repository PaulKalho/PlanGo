import Model from "../model"

class m_Transaction {
    constructor() {
        this.m_Transaction_List = []
        this.m_TransactionObj = {}
        this.m_apiEndpoint = process.env.REACT_APP_TRANSACTION_ENDPOINT
        this.m_Transaction = new Model(
            this, 
            this.m_apiEndpoint,
            "m_Transaction_List",
            "m_TransactionObj"
        )
    }

    async m_Transaction_runProcedure(id_acc) {
        return this.m_Transaction.runProcedure(id_acc)
    }

}

export default m_Transaction