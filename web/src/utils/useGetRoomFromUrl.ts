import { useRoomQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetRoomFromUrl = () => {
  const intId = useGetIntId();
  return useRoomQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};