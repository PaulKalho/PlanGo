import Model from "./model"

class m_Group {
    constructor() {
        this.m_Group_List = []
        this.m_GroupObj = {}
        this.m_apiEndpoint = process.env.REACT_APP_GROUP_ENDPOINT
        this.m_Group = new Model(
            this, 
            this.m_apiEndpoint,
            "m_Group_List",
            "m_GroupObj"
        )
    }

    async m_Group_FindAll() {
        return this.m_Group.findAll()
    }

    async m_Group_FindBy(id, options) {
        return this.m_Group.findBy()
    }

    async m_Group_insert(payload) {
        return this.m_Group.insert(payload)
    }

    async m_Group_deleteOne(id) {
        return this.m_Group.deleteOne(id);
    }

    async m_Group_deleteBy(payload) {
        return this.m_Group.deleteBy(payload)
    }

}

export default m_Group