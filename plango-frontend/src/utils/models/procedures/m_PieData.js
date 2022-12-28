import Model from "../model"

class m_PieData {
    constructor() {
        this.m_PieData_Data = []
        this.m_apiEndpoint = process.env.REACT_APP_PIEDATA_ENDPOINT
        this.m_PieData = new Model(
            this, 
            this.m_apiEndpoint,
            "m_PieData_Data",
        )
    }

    async m_PieData_runProcedure(id_acc) {
        return this.m_PieData.runProcedure(id_acc)
    }

}

export default m_PieData