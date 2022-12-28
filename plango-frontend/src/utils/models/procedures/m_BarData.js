import Model from "../model"

class m_BarData {
    constructor() {
        this.m_BarData_Data = []
        this.m_apiEndpoint = process.env.REACT_APP_BARDATA_ENDPOINT
        this.m_BarData = new Model(
            this, 
            this.m_apiEndpoint,
            "m_BarData_Data",
        )
    }

    async m_BarData_runProcedure(id_acc) {
        return this.m_BarData.runProcedure(id_acc)
    }

}

export default m_BarData