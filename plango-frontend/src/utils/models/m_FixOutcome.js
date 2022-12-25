import Model from "./model"

class m_FixOutcome {
    constructor() {
        this.m_FixOutcome_List = []
        this.m_FixOutcomeObj = {}
        this.m_apiEndpoint = process.env.REACT_APP_OUTCOME_ENDPOINT
        this.m_FixOutcomeTable = new Model(
            this, 
            this.m_apiEndpoint,
            "m_FixOutcome_List",
            "m_FixOutcomeObj"
        )
    }

    async m_FixOutcome_FindAll() {
        return this.m_FixOutcomeTable.findAll()
    }

    async m_FixOutcome_FindBy(id, options) {
        return this.m_FixOutcomeTable.findBy()
    }

    async m_FixOutcome_insert(payload) {
        return this.m_FixOutcomeTable.insert(payload)
    }

    async m_FixOutcome_deleteBy(payload) {
        return this.m_FixOutcomeTable.deleteBy(payload)
    }

    m_FixOutcome_Sum() {
        var sum = 0.0
        this.m_FixOutcome_List.map((el) => (
            sum += parseFloat(el.amount)
        ))

        return sum;
    }
}

export default m_FixOutcome