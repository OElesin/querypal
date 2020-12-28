import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class SQLQuery {
  readonly id: string;
  readonly name: string;
  readonly queryString: string;
  readonly ownerEmail: string;
  readonly ownerId: string;
  readonly description?: string;
  constructor(init: ModelInit<SQLQuery>);
  static copyOf(source: SQLQuery, mutator: (draft: MutableModel<SQLQuery>) => MutableModel<SQLQuery> | void): SQLQuery;
}