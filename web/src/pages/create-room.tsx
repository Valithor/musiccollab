import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { useCreateRoomMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';



const CreateRoom: React.FC<{}> = ({ }) => {
    const router = useRouter();
    useIsAuth();    
    const [, createRoom] = useCreateRoomMutation();
    return (
        <Layout variant='small'>
            <Formik initialValues={{ name: "" }}
                onSubmit={async (values) => {
                    const { error } = await createRoom({ input: values.name });
                    if (!error) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="name"
                            placeholder="name"
                            label="Name"
                        />
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            colorScheme="teal">
                            Create Room
                        </Button>
                    </Form>
                )}
            </Formik >
        </Layout>
    );
}
export default withUrqlClient(createUrqlClient)(CreateRoom);