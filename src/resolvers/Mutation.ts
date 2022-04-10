import { Post, Prisma } from '@prisma/client';
import { Context } from '../index';

interface PostArgs {
	post: {
		title?: string;
		content?: string;
	};
}

interface PostPayloadType {
	userErrors: {
		message: string;
	}[];
	post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const Mutation = {
	postCreate: async (
		_: any,
		{ post }: PostArgs,
		{ prisma }: Context
	): Promise<PostPayloadType> => {
		const { title, content } = post;

		if (!title || !content) {
			return {
				userErrors: [
					{
						message: 'You must provide title and content to create a post'
					}
				],
				post: null
			};
		}

		return {
			userErrors: [],
			post: prisma.post.create({
				data: {
					title,
					content,
					authorId: 1
				}
			})
		};
	},
	postUpdate: async (
		_: any,
		{ post, postId }: { postId: String; post: PostArgs['post'] },
		{ prisma }: Context
	): Promise<PostPayloadType> => {
		const { title, content } = post;

		if (!title && !content) {
			return {
				userErrors: [
					{
						message: 'Need to have at least on field to update'
					}
				],
				post: null
			};
		}

		const existingPost = await prisma.post.findUnique({
			where: {
				id: Number(postId)
			}
		});

		if (!existingPost) {
			return {
				userErrors: [
					{
						message: 'Post does not exist'
					}
				],
				post: null
			};
		}

		let payloadToUpdate = {
			title,
			content
		};

		if (!title) delete payloadToUpdate.title;
		if (!content) delete payloadToUpdate.content;

		return {
			userErrors: [],
			post: prisma.post.update({
				data: {
					...payloadToUpdate
				},
				where: {
					id: Number(postId)
				}
			})
		};
	},
	postDelete: async (
		_: any,
		{ postId }: { postId: String },
		{ prisma }: Context
	): Promise<PostPayloadType> => {
		const post = await prisma.post.findUnique({
			where: {
				id: Number(postId)
			}
		});

		if (!post) {
			return {
				userErrors: [
					{
						message: 'Post does not exist'
					}
				],
				post: null
			};
		}

		await prisma.post.delete({
			where: {
				id: Number(postId)
			}
		});

		return {
			userErrors: [],
			post
		};
	}
};