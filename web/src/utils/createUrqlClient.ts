import { cacheExchange } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { dedupExchange, Exchange, fetchExchange, subscriptionExchange } from "urql";
import { pipe, tap } from "wonka";
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";
import { fixedUpdateQuery } from "./fixedUpdateQuery";
import { SubscriptionClient } from 'subscriptions-transport-ws'


const errorExchange: Exchange = ({ forward }) => ops$ => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error?.message.includes("not authenticated")) {
                Router.replace("/login");
            }
        })
    );
};

export type MergeMode = 'before' | 'after';

export interface PaginationParams {
    offsetArgument?: string;
    limitArgument?: string;
    mergeMode?: MergeMode;
}
export const subscriptionClient = process.browser? new SubscriptionClient(
    process.env.NEXT_PUBLIC_SOCKET_URL as string,
    {
      reconnect: true,
    },
  ) : null; 

export const createUrqlClient = (ssrExchange: any) => ({
    url: process.env.NEXT_PUBLIC_API_URL + "graphql",
    fetchOptions: {
        credentials: "include" as const,
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
            resolvers: {
                keys: {
                    PaginatedRooms: () => null,
                    UserRoom: () => null,
                },
                Query: {

                }
            },
            updates: {
                Mutation: {   
                    setLocation: (_result, _args, cache, _info) => {
                        const allFields = cache.inspectFields("Query");
                        const fieldInfos = allFields.filter(
                            (info) => info.fieldName === "room"
                        );
                        fieldInfos.forEach((fi) => {
                            cache.invalidate('Query', 'room', fi.arguments || {});
                        });

                    },    
                    updateTrack: (_result, _args, cache, _info) => {
                        const allFields = cache.inspectFields("Query");
                        const fieldInfos = allFields.filter(
                            (info) => info.fieldName === "room"
                        );
                        fieldInfos.forEach((fi) => {
                            cache.invalidate('Query', 'room', fi.arguments || {});
                        });

                    },                 
                    addUser: (_result, _args, cache, _info) => {
                        const allFields = cache.inspectFields("Query");
                        const fieldInfos = allFields.filter(
                            (info) => info.fieldName === "room"
                        );
                        fieldInfos.forEach((fi) => {
                            cache.invalidate('Query', 'room', fi.arguments || {});
                        });

                    },
                    createRoom: (_result, _args, cache, _info) => {
                        const allFields = cache.inspectFields("Query");
                        const fieldInfos = allFields.filter(
                            (info) => info.fieldName === "rooms"
                        );
                        fieldInfos.forEach((fi) => {
                            cache.invalidate('Query', 'rooms', fi.arguments || {});
                        });
                    },
                    logout: (_result, _args, cache, _info) => {
                        fixedUpdateQuery<LogoutMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            () => ({ me: null })
                        )
                    },
                    login: (_result, _args, cache, _info) => {
                        fixedUpdateQuery<LoginMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.login.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.login.user,
                                    };
                                }
                            }
                        );
                    },
                    register: (_result, _args, cache, _info) => {
                        fixedUpdateQuery<RegisterMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.register.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.register.user,
                                    };
                                }
                            }
                        );
                    },
                }
            }
        }),
        errorExchange,
        ssrExchange,
        fetchExchange,
        subscriptionExchange({
            forwardSubscription: operation => subscriptionClient!.request(operation)
        })
    ],
});