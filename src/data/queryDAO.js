import API, { graphqlOperation } from '@aws-amplify/api';
import {createSessionQuery, createSqlQuery} from '@/graphql/mutations'
import { onCreateSessionQuery, onCreateSqlQuery } from '@/graphql/subscriptions'
import { listSessionQuerys, listSqlQuerys } from '@/graphql/queries'

const queryDao = {

    async saveQuery(savedQueryObject){
        await API.graphql(graphqlOperation(createSqlQuery, { input: {
            name: savedQueryObject['name'],
            queryString: savedQueryObject['queryString'],
            ownerEmail: savedQueryObject['ownerEmail'],
            description: savedQueryObject['description']
        }}))
    },

    async getRecentQueries() {
        let filter = {
            ownerEmail: {
                ne: ''
            }
        }
        return API.graphql({
            query: listSqlQuerys, variables: {
                filter: filter,
                limit: 10
            },
        });
    },

    async saveSessionQuery(sessionQueryObject) {
        let response = await API.graphql(graphqlOperation(createSessionQuery, { input: {
                queryString: sessionQueryObject['queryString'],
                queryExecutionId: sessionQueryObject['queryExecutionId'],
                ownerEmail: sessionQueryObject['ownerEmail'],
            }}))
        console.log(response)
    },

    async getSessionQueries(username) {
        return API.graphql({
            query: listSessionQuerys, variables: {
                owner: username,
                limit: 10
            },
        });

    },

    sessionQuerySubscription (owner) {
        return API.graphql(graphqlOperation(onCreateSessionQuery, { owner: owner}))
    },

    allQueriesSubscription() {
        return API.graphql(graphqlOperation(onCreateSqlQuery))
    }
}

export default queryDao
