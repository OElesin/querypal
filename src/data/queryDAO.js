import {DataStore} from '@aws-amplify/datastore';
import { SQLQuery } from '@/models'


const queryDao = {
    async addNewQueryToLocalStorage(image){
        console.log("Added images to local storage")
        const result = await localStorage.getItem('userQueryList')
        const payload = JSON.parse(result) || [];
        payload.push(image)
        let userContentList = JSON.stringify(payload)
        localStorage.setItem('userQueryList', userContentList)
    },

    async saveQuery(savedQueryObject){
        await DataStore.save(
            new SQLQuery({
                name: savedQueryObject['name'],
                queryString: savedQueryObject['queryString'],
                ownerEmail: savedQueryObject['ownerEmail'],
                description: savedQueryObject['description']
            })
        );
    },

    async getRecentQueries(ownerEmail) {
        return await DataStore.query(SQLQuery, query =>
            query.ownerEmail("eq", ownerEmail), {
            page: 0, limit: 20
        })
    }
}

export default queryDao
