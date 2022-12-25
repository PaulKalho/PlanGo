import Model from "./model"

class m_FixIncome {
    constructor() {
        this.m_FixIncome_List = []
        this.m_FixIncomeObj = {}
        this.m_apiEndpoint = process.env.REACT_APP_INCOME_ENDPOINT
        this.m_FixIncomeTable = new Model(
            this, 
            this.m_apiEndpoint,
            "m_FixIncome_List",
            "m_FixIncomeObj"
        )
    }

    async m_FixIncome_FindAll() {
        return this.m_FixIncomeTable.findAll()
    }

    async m_FixIncome_FindBy(id, options) {
        return this.m_FixIncomeTable.findBy()
    }

    async m_FixIncome_insert(payload) {
        return this.m_FixIncomeTable.insert(payload)
    }

    async m_FixIncome_deleteBy(payload) {
        return this.m_FixIncomeTable.deleteBy(payload)
    }

    m_FixIncome_Sum() {
        var sum = 0.0
        this.m_FixIncome_List.map((el) => (
            sum += parseFloat(el.amount)
        ))

        return sum;
    }

}

export default m_FixIncome