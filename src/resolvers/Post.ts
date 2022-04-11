import { Context } from '../index';
import { userLoader } from '../loaders/userLoader';

interface PostParentType {
	authorId: number;
}

export const Post = {
	user: async (parent: PostParentType, __: any, { prisma }: Context) => {
		return userLoader.load(parent.authorId);
	}
};
