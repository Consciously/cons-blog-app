import { authResolvers } from './auth';
import { postResolvers } from './Post';

export const Mutation = {
	...postResolvers,
	...authResolvers
};
