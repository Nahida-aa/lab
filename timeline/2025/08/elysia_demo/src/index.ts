import {swagger} from '@elysiajs/swagger';
import { Elysia } from 'elysia'

const app = new Elysia()
  .use(swagger()) 
  .get('/', ({ path }) => path) 
  .post('/hello', 'Do you miss me?')
  .listen(3000)

console.log(
  `Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
