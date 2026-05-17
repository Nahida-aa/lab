import { eq } from 'drizzle-orm';
import z from 'zod';
import { todo } from '#/db.schema';
import { db } from '#/db.server';
import { authFn, Fn } from '#/orpc.base';

export const listTodo = Fn.route({ method: 'GET' }).handler(async () => {
	const ret = await db.select().from(todo);
	return ret;
});

export const getTodo = Fn.route({ method: 'GET' })
	.input(z.object({ id: z.string() }))
	.handler(async ({ input, errors }) => {
		const [ret] = await db.select().from(todo).where(eq(todo.id, input.id));
		if (!ret) throw errors.NOT_FOUND({ message: 'Todo not found' });
		return ret;
	});

export const addTodo = Fn.input(z.object({ title: z.string() })).handler(
	async ({ input }) => {
		const newTodo = { title: input.title };
		const [ret] = await db.insert(todo).values(newTodo).returning();
		return { success: true, id: ret.id };
	},
);

export const deleteTodo = authFn
	.input(z.object({ id: z.string() }))
	.handler(async ({ input, errors }) => {
		const [ret] = await db
			.delete(todo)
			.where(eq(todo.id, input.id))
			.returning({ id: todo.id });
		if (!ret) throw errors.NOT_FOUND({ message: 'Todo not found' });
		return { success: true };
	});
