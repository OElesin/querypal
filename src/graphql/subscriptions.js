/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSqlQuery = /* GraphQL */ `
  subscription OnCreateSqlQuery {
    onCreateSQLQuery {
      id
      name
      queryString
      ownerEmail
      ownerId
      owner
      description
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSqlQuery = /* GraphQL */ `
  subscription OnUpdateSqlQuery {
    onUpdateSQLQuery {
      id
      name
      queryString
      ownerEmail
      ownerId
      owner
      description
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSqlQuery = /* GraphQL */ `
  subscription OnDeleteSqlQuery {
    onDeleteSQLQuery {
      id
      name
      queryString
      ownerEmail
      ownerId
      owner
      description
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSessionQuery = /* GraphQL */ `
  subscription OnCreateSessionQuery($owner: String!) {
    onCreateSessionQuery(owner: $owner) {
      id
      queryString
      ownerEmail
      queryExecutionId
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateSessionQuery = /* GraphQL */ `
  subscription OnUpdateSessionQuery($owner: String!) {
    onUpdateSessionQuery(owner: $owner) {
      id
      queryString
      ownerEmail
      queryExecutionId
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteSessionQuery = /* GraphQL */ `
  subscription OnDeleteSessionQuery($owner: String!) {
    onDeleteSessionQuery(owner: $owner) {
      id
      queryString
      ownerEmail
      queryExecutionId
      createdAt
      updatedAt
      owner
    }
  }
`;
