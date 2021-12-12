import gql from "graphql-tag";

export const playSoloMoment = gql`
  mutation playSoloMoment($playSoloMomentInput: PlayMomentInput) {
    playSoloMoment(playSoloMomentInput: $playSoloMomentInput) {
      gameSessionId
      edgeNodeId
    }
  }
`;
