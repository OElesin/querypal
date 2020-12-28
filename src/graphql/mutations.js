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
export const createSessionQuery = /* GraphQL */ `
  mutation CreateSessionQuery(
    $input: CreateSessionQueryInput!
    $condition: ModelSessionQueryConditionInput
  ) {
    createSessionQuery(input: $input, condition: $condition) {
      id
      queryString
      queryExecutionId
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateSessionQuery = /* GraphQL */ `
  mutation UpdateSessionQuery(
    $input: UpdateSessionQueryInput!
    $condition: ModelSessionQueryConditionInput
  ) {
    updateSessionQuery(input: $input, condition: $condition) {
      id
      queryString
      queryExecutionId
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteSessionQuery = /* GraphQL */ `
  mutation DeleteSessionQuery(
    $input: DeleteSessionQueryInput!
    $condition: ModelSessionQueryConditionInput
  ) {
    deleteSessionQuery(input: $input, condition: $condition) {
      id
      queryString
      queryExecutionId
      createdAt
      updatedAt
      owner
    }
  }
`;
