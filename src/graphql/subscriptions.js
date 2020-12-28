/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSqlQuery = /* GraphQL */ `
  subscription OnCreateSqlQuery($owner: String!) {
    onCreateSQLQuery(owner: $owner) {
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
export const onUpdateSqlQuery = /* GraphQL */ `
  subscription OnUpdateSqlQuery($owner: String!) {
    onUpdateSQLQuery(owner: $owner) {
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
export const onDeleteSqlQuery = /* GraphQL */ `
  subscription OnDeleteSqlQuery($owner: String!) {
    onDeleteSQLQuery(owner: $owner) {
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
export const onCreateSessionQuery = /* GraphQL */ `
  subscription OnCreateSessionQuery($owner: String!) {
    onCreateSessionQuery(owner: $owner) {
      id
      queryString
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
      queryExecutionId
      createdAt
      updatedAt
      owner
    }
  }
`;
