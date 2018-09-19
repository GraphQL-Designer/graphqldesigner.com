import { gql } from 'apollo-boost';

const addAuhtorMutation = gql`
	mutation($name: String!, $age: String!) {
		addBook(name: $name, age: $age) {
			id
			name
			age
		}
	}
`

const addBookMutation = gql`
	mutation($title: String!, $genre: String!, $authorId: String!) {
		addBook(title: $title, genre: $genre, authorId: $authorId) {
			id
			title
			genre
			authorId
		}
	}
`

export { addAuhtorMutation, addBookMutation };