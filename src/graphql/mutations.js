/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSqlQuery = /* GraphQL */ `
  mutation CreateSqlQuery(
    $input: CreateSQLQueryInput!
    $condition: ModelSQLQueryConditionInput
  ) {
    createSQLQuery(input: $input, condition: $condition) {
      id
      name
      queryString
      ownerEmail
      ownerId
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateSqlQuery = /* GraphQL */ `
  mutation UpdateSqlQuery(
    $input: UpdateSQLQueryInput!
    $condition: ModelSQLQueryConditionInput
  ) {
    updateSQLQuery(input: $input, condition: $condition) {
      id
      name
      queryString
      ownerEmail
      ownerId
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteSqlQuery = /* GraphQL */ `
  mutation DeleteSqlQuery(
    $input: DeleteSQLQueryInput!
    $condition: ModelSQLQueryConditionInput
  ) {
    deleteSQLQuery(input: $input, condition: $condition) {
      id
      name
      queryString
      ownerEmail
      ownerId
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
