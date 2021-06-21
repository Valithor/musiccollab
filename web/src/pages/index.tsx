import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { Fragment, useState } from "react";
import { Layout } from "../components/Layout";
import { useRoomsQuery, RoomsQueryVariables } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link';

type Props = {
  variables: RoomsQueryVariables;
  isLastPage: boolean;
  onLoadMore: (cursor: string) => void;
};

const Page = ({ variables, isLastPage, onLoadMore }: Props) => {
  const [{ data, fetching }] = useRoomsQuery({
    variables,
  });  

  return (
    <>
      <Stack spacing={8}>
        {data?.rooms.rooms.map((r) =>
          !r ? null : (
            <Flex key={r.id} p={5} shadow="md" borderWidth="1px">
              <Box flex={1}>
                <NextLink href="/room/[id]" as={`/room/${r.id}`}>
                  <Link>
                    <Heading fontSize="xl">{r.nameSnippet}</Heading>
                  </Link>
                </NextLink>
                <Flex align="center">
                  <Text flex={1} mt={4}>
                    Users: {r.userRooms.map((ur)=>{
                     return <Fragment key={ur.userId}> {ur.user.username},</Fragment>
                    })}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          )
        )}
      </Stack>
      {(isLastPage && fetching) || (isLastPage && data?.rooms.hasMore) ? (
        <Flex>
          <Button
            onClick={() => {
              if (data?.rooms) {
                onLoadMore(
                  data.rooms.rooms[data.rooms.rooms.length - 1].createdAt
                );
              }
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </>
  );
};

const limit = 20;

const Index = () => {
  const [pageVariables, setPageVariables] = useState([
    {
      limit,
      cursor: null as null | string,
    },
  ]);

  return (
    <Layout>
      <Flex align="center">
        <NextLink href="/create-room">
          <Link ml="auto">create room</Link>
        </NextLink>
      </Flex>
      <br />
      {pageVariables.map((variables, i) => {
        return (
          <Page
            key={"" + variables.cursor}
            variables={variables}
            isLastPage={i === pageVariables.length - 1}
            onLoadMore={(cursor) =>
              setPageVariables([...pageVariables, { cursor, limit }])
            }
          />
        );
      })}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);