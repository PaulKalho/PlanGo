import Model from "../model"

class m_Budget {
    constructor() {
        this.m_Budget_Data = []
        this.m_apiEndpoint = process.env.REACT_APP_BUDGET_ENDPOINT
        this.m_Budget = new Model(
            this, 
            this.m_apiEndpoint,
            "m_Budget_Data",
        )
    }

    async m_FixOutcome_runProcedure(id_acc) {
        return this.m_Budget.runProcedure()
    }

}

export default m_Budget