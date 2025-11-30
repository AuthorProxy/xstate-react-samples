import { actions, assign, createMachine, raise } from 'xstate';

export type Todo = {
  message: string;
  status: string;
  id?: number;
};

export const sharedStateTodoMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBUB7CC2AYgBcqKTMAnMdesAbQAYBdRKAAONXPVwV8QkAA9EAVgDMJABwAmAGwLNAFk29eq3bwCMqzQBoQAT0RLNAdhKbVj3QE5lXhbtPKAXwDrNCw8QlJKajpGahIIMAAbMC4+QSQQUVhxSWkM+QRfEn9DMyUldUcFD1UlazsESvVinXV9R3UKpV0LIJCMHAJiciYYphIAV2EITh4BGSycqRkChVMSXSVqpQ9NJVVa1VMHesRTR00XNo8a3gVeD3UNXT6QUMGIkeiGcdgUgGV6JwJrA0gsxBJlvlELp1KcEEcSA8lO4PCiLOpTJp1EFgiB8FQ4DJ3uFiODspC8qACgBaKy2RB014koaRUbkpZUuSIKokJ6mdTKJ4KRy8Ax1BkIfSqPnmdwmJzGI4KXEBIA */
  context: {
    todos: [
      {
        message: 'Update @xstate/react',
        status: 'incomplete',
        id: Math.random(),
      },
    ],
  },
  states: {
    Todos: {
      on: {
        'todo.create': {
          target: 'Todos',
          internal: true,
          actions: assign({
            todos: (ctx, ev) => {
              return ctx.todos.concat({ ...ev.todo, id: Math.random() });
            },
          }),
          cond: (_ctx, ev) => ev.todo.message.length > 0,
        },

        'todo.delete': {
          target: 'Todos',
          internal: true,
          actions: assign({
            todos: (ctx, ev) => ctx.todos.filter((todo) => todo.id !== ev.id),
          }),
        },

        'todo.update': {
          target: 'Todos',
          internal: true,
          actions: actions.pure((ctx, ev) => {
            if (!ev.todo.message.trim().length) {
              return [raise({ type: 'todo.delete', id: ev.todo.id || 0 })];
            }

            return [
              assign({
                todos: (ctx, ev) => {
                  const todos = [...ctx.todos];
                  const indexToUpdate = todos.findIndex((todo) => todo.id === ev.todo.id);

                  todos[indexToUpdate] = {
                    ...todos[indexToUpdate],
                    ...ev.todo,
                  };

                  return todos;
                },
              }),
            ];
          }),
        },

        'todo.setStatus': {
          target: 'Todos',
          internal: true,
          actions: assign({
            todos: (ctx, ev) => {
              const todos = [...ctx.todos];
              const indexToUpdate = todos.findIndex((todo) => todo.id === ev.id);

              todos[indexToUpdate] = {
                ...todos[indexToUpdate],
                status: ev.status,
              };

              return todos;
            },
          }),
        },
      },
    },
  },

  tsTypes: {} as import('./sharedStateTodoMachine.typegen').Typegen0,
  schema: {
    context: {} as {
      todos: Todo[];
    },
    events: {} as
      | { type: 'todo.create'; todo: Todo }
      | { type: 'todo.delete'; id: number }
      | { type: 'todo.update'; todo: Todo }
      | { type: 'todo.setStatus'; id: number; status: string },
  },

  initial: 'Todos',
  predictableActionArguments: true,
  preserveActionOrder: true,
  devTools: true,
});
