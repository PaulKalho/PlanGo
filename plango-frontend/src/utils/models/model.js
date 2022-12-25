import axiosInstance from "../../axios"

class Model {
    constructor(table, endpoint, listName, objName,apiInstance = axiosInstance) {
        this.api = apiInstance
        this.table = table
        this.endpoint = endpoint
        this.listName = listName
        this.objName = objName
    }

    //Methods
    async findAll() {
        //Diese Funktion gettet alle Daten aus einer Datenbank
        try {
            await this.api.get(this.endpoint)
            .then(res => {     
                this.table[this.listName] = res.data;
            })
        } catch {
            
        } finally {

        }
        
       
    }

    async findBy(payload) {
        //Diese Funktion gettet spezifische Daten aus einer Datenbank
        //Payload ist WHERE abfrage ?!
        await this.api.post(this.endpoint, payload)
                .then(res => {
                    this.m_List = res.data;
                })
        
    }

    async insert(url) {

    }





}

export default Model;