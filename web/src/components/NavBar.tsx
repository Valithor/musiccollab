import { Box, Flex, Heading } from '@chakra-ui/layout';
import { Button, Link } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery, useSetLocationMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const router = useRouter();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    });
    const [, setLocation] = useSetLocationMutation();

    useEffect(()=>{
        setLocation({location: "Online"});
    }, [])
    
    if (process.browser) {
        window.onbeforeunload = () => {
            setLocation({ location: "Offline" })
        }
      }

    let body = null;

    //data is loading
    if (fetching) {
        //user not logged in
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link color="black" mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="black">Register</Link>
                </NextLink>
            </>
        );
        //user logged in
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button onClick={() => {
                    logout();
                    setLocation({ location: "Offline" })
                    router.push("/");
                }}
                    isLoading={logoutFetching}
                    variant="link">Logout</Button>
            </Flex>
        )
    }
    return (
        <Flex zIndex={1} position="sticky" top={0} bg="pink" p={4}>
            <Flex flex={1} m="auto" align="center" maxW={800}>
                <NextLink href="/">
                    <Link>
                        <Heading>MusicCollab</Heading>
                    </Link>
                </NextLink>
                <Box ml={"auto"}>{body}</Box>
            </Flex>
        </Flex>
    );
}