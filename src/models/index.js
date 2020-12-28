// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { SQLQuery } = initSchema(schema);

export {
  SQLQuery
};