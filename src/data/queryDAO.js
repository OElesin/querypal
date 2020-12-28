import {DataStore, Predicates} from '@aws-amplify/datastore';
import { SQLQuery, SessionQuery } from '@/models'

const queryDao = {

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
    },

    async saveSessionQuery(sessionQueryObject) {
      await DataStore.save(
          new SessionQuery({
              queryString: sessionQueryObject['queryString'],
              queryExecutionId: sessionQueryObject['queryExecutionId']
          })
      )
    },

    async getSessionQueries() {
        return await DataStore.query(SessionQuery, Predicates.ALL, {
            page: 0, limit: 10
        })
    },

    sessionQuerySubscription () {
        return DataStore.observe(SessionQuery)
    }
}

export default queryDao
