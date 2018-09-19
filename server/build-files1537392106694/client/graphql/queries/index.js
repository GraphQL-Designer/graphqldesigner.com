import { gql } from 'apollo-boost';

const queryEveryAuhtor = gql`
	{
		auhtors {
			id
			name
			age
		}
	}
`

const queryAuhtorById = gql`
	query($id: ID) {
		auhtor(id: $id) {
			id
			name
			age
		}
	}
`

const queryEveryBook = gql`
	{
		books {
			id
			title
			genre
			authorId
		}
	}
`

const queryBookById = gql`
	query($id: ID) {
		book(id: $id) {
			id
			title
			genre
			authorId
		}
	}
`

export { queryEveryAuhtor, queryAuhtorById , queryEveryBook, queryBookById  };