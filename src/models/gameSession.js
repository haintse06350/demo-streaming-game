import apollo from "../clients/apollo";
import gql from "graphql-tag";

export class GameSessions {
  static playSoloMoment = async (params) => {
    const apolloClient = apollo.getInstance();
    const playSoloMoment = gql`
      mutation playSoloMoment($playSoloMomentInput: PlayMomentInput) {
        playSoloMoment(playSoloMomentInput: $playSoloMomentInput) {
          gameSessionId
          edgeNodeId
        }
      }
    `;
    const response = await apolloClient.mutate({
      mutation: playSoloMoment,
      variables: { playSoloMomentInput: params },
    });
    return response.data.playSoloMoment;
  };
}
