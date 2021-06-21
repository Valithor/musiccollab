import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useEffect, useState } from 'react';
import EditingRoom from '../../components/EditingRoom';
import { InputField } from '../../components/InputField';
import { Layout } from '../../components/Layout';
import MusicItem from '../../components/musicItem/MusicItem';
import { NavBar } from '../../components/NavBar';
import { Wrapper } from '../../components/Wrapper';
import { useAddUserMutation, useConcatMutation, useMeQuery, useSoundsQuery, useRoomChangesSubscription, useUserChangesSubscription } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetRoomFromUrl } from '../../utils/useGetRoomFromUrl';

interface roomProps {
}

export const Room: React.FC<roomProps> = ({ }) => {
    const [{ data: meData }] = useMeQuery(),
        [, concat] = useConcatMutation(),
        [, addUser] = useAddUserMutation(),
        [{ data: soundsData, fetching: soundsFetching }] = useSoundsQuery(),
        [{ data, error, fetching }] = useGetRoomFromUrl(),
        [concatFile, setConcatFile] = useState(false),
        [{ data: subData }] = useRoomChangesSubscription(),
        [{data: userSubData}] = useUserChangesSubscription();
    let link;
    console.log(userSubData)

    const createdItem = (id: number) => {
        link = process.env.NEXT_PUBLIC_API_URL + `outputs/${id}.mp3?${Date.now().toString()}`;
        const isCreated = new Request(link);
        fetch(isCreated).then((response) => {
            if (response.status === 200) {
                setConcatFile(true);
            }
        });
    }
    useEffect(() => {
        if (subData) {
            setConcatFile(true);
            createdItem(subData.roomChanges.id)
        }
    }, [subData])


    if (fetching || soundsFetching) {
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!data?.room || !data?.room.userRooms.some(uR => uR.userId === meData?.me?.id)) {
        return (
            <Layout>
                <Box>Could not find room</Box>
            </Layout>
        );
    }
    if (!soundsData?.sounds.sounds) {
        return (
            <Layout>
                <Box>Could not find sounds</Box>
            </Layout>)
    }

    createdItem(data!.room!.id);
    return (
        <div>
            <NavBar />
            <Flex>
                <Wrapper>
                    <Flex paddingBottom={8}>
                        <Heading mb={4}>{data.room.name} </Heading>
                        <Box ml={"auto"} key={Date.now().toString()}>
                            {concatFile && link ? <MusicItem song={link} name={data.room.name} /> : null}
                        </Box>
                    </Flex>
                    <EditingRoom soundsData={soundsData} id={data.room.id} preloadSounds={subData ? subData.roomChanges.roomSounds : data.room.roomSounds} />
                    <Button
                        mt={4}
                        type="submit"
                        onClick={() => {
                            const obj = {
                                roomId: data.room!.id
                            }
                            concat(obj)
                        }}
                        colorScheme="teal">
                        Concat sounds
            </Button>
                </Wrapper>
                <Stack mr={0} mt={100}>
                    {data.room.userRooms.map(({ user }) =>
                        !user ? null : (
                            <Flex key={user.id} p={5} shadow="md" borderWidth="1px">
                                <Box flex={1}>
                                    <Flex align="center">
                                        <Text flex={1} mt={4}>
                                            {user.username}<br />
                                            {user.location}
                                        </Text>
                                    </Flex>
                                </Box>
                            </Flex>
                        )
                    )}
                    <Formik initialValues={{ usernameOrEmail: "", roomId: data.room.id }}
                        onSubmit={async (values) => {
                            await addUser(values);
                        }
                        }
                    >
                        <Form>
                            <InputField
                                name="usernameOrEmail"
                                placeholder="username or email"
                                label="Username or Email"
                            />
                            <Button
                                mt={4}
                                type="submit"
                                colorScheme="teal">
                                Add
                        </Button>
                        </Form>
                    </Formik>
                </Stack>
            </Flex>
        </div>
    );
}
export default withUrqlClient(createUrqlClient, { ssr: false })(Room as any);
