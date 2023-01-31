import { gql, useMutation } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation register(
    $first_name: String!
    $last_name: String!
    $email: String!
    $password: String!
  ) {
    register(
      first_name: $first_name
      last_name: $last_name
      email: $email
      password: $password
    ) {
      token
      user {
        _id
        first_name
        last_name
        email
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        first_name
        last_name
        email
      }
    }
  }
`;


const LOGOUT_MUTATION = gql`
	mutation LogoutMutation {
		logout
	}
`;

export function useLogoutMutation() {
	const [logout, { data, loading, error }] = useMutation(LOGOUT_MUTATION);

	return { logout, data, loading, error };
}

// uploading photo mutation
mutation($formData: FormData!) {
  uploadProfilePicture(formData: $formData) {
    success
  }
}


const response = await fetch("/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: mutation,
    variables: {
      formData,
    },
  }),
});