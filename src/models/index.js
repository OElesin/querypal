// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { SQLQuery, SessionQuery } = initSchema(schema);

export {
  SQLQuery,
  SessionQuery
};