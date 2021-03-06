import {
  Box, Button
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';

import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';

import { useLoginMutation } from '../generated/graphql';

import { toFormikError } from '../utils/convertError';
import { createUrqlClient } from '../utils/createUrqlClient';

interface IRegisterProps { }

const Login: React.FC<IRegisterProps> = ({ }) => {
  const router = useRouter();

	const [, login] = useLoginMutation();

  return (
		<Wrapper variant="small">
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={ async (values, { setErrors }) => {
				const response = await login({ options: values });

				// do something if there is an error
        if (response.data?.login.errors) {
          setErrors(toFormikError(response.data.login.errors));
        } else if (response.data?.login.user) {
          const { key } = router.query;
          if (key) {
            router.push(`/create-post?key=${key}`);
          } else {
            // user successfully login
            router.push("/");
          }
        }
      }}
    >
      {({ isSubmitting }) => (
          <Form>
						<InputField name="username" placeholder="Username" label="Username" />
						<Box marginY={4}>
						<InputField name="password" placeholder="Password" label="Password" type="password" />

						</Box>
						<Button type="submit" colorScheme="cyan" isLoading={isSubmitting} loadingText="Submitting">Login</Button>
          </Form>
      )}
    </Formik>
			</Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
