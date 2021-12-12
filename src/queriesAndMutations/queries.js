import gql from "graphql-tag";

export const listGames = gql`
  query listGames($status: [Status]!) {
    listGames(status: $status) {
      id
      title
      company
      description
      category
      data
      timesPlayed
      rotationMode
      status
      type
      canUseCash
      isLike
      likeCount
      totalCompleted
      countMoments
      hasBattle
      hasSolo
      hasTournament
    }
  }
`;

export const listMomentsV2 = gql`
  query ListMomentsV2($appId: String!, $status: Status) {
    listMomentsV2(appId: $appId, status: $status) {
      id
      appId
      snapshotId
      title
      unlockXp
      timesPlayed
      momentType
      isCompleted
      zoneId
    }
  }
`;
