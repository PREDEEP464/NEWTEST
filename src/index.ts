import { Hono } from 'hono'


type Todo = {
  id: string; // 1
  task: string; // 'Buy milk'
  description: string; // buy 2l milk
  is_completed: boolean; // false
}

type Bindings = {
  TODOKV: KVNamespace;
}

const app = new Hono<{Bindings: Bindings}>();

app.post('/todos/new', async (c) =>{
  const {id,task,description,is_completed} = await c.req.json();

  const newTodo: Todo = {
    id: id, 
    task: task,
    description: description,
    is_completed: is_completed
  }
await c.env.TODOKV.put(`todo:${newTodo.id}`, JSON.stringify(newTodo))
 
return c.text('New todo created');
 
})



app.post('/random', async (c) => {
  const random = Math.random();
  await c.env.TODOKV.put('random', random.toString());

});

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/todos',async(c)=>{

})

// update a todo

app.put('/todos/:id',async(c)=>{

})

// delete a todo

app.delete('/todos/:id',async(c)=>{

})

//get todo by id

app.get('/todos/:id',async(c)=>{

})

app.get('/get-all-todos', async (c) => {
 
  const all_todos = await c.env.TODOKV.list({prefix: 'todo:'});
  const todos = [];

  return c.json({all_todos});

})

app.delete('/delete', async (c) => {
  await c.env.TODOKV.delete('todo:wiormx');
  return c.text('Deleted');
})

app.get('/all-todos-faster', async (c) => {
  const all_todos = await c.env.TODOKV.list({prefix: 'todo:'});
  const todoPromises = all_todos.keys.map(key=>c.env.TODOKV.get(key.name));
  const todos = await Promise.all(todoPromises);
  return c.json({todos});
})

export default app