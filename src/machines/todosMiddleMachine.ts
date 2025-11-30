import { assign, createMachine } from "xstate";

export const todosMiddleMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAICyBDAxgBYCWAdmAHQAyquEZUmaGsAxBuRWQG6oDWlZljxEylGnQZN0qWAh6p8uAC7FUpANoAGALradiUAAdZxVesMgAHogCMFACwAmW1oAcAVgcB2Wx6daAVoOYAC0tg4ANCAAnoihAMzeFE4eAGxODoH+Hl5pWh4AvoXRQjgEJJwS9KSMQmxgAE6NqI0URgA2KgBmrQC2FGUileK0NXUycgpK5pq6+pYmsGZqpJY2CAkpAQlaaQkO-gCcR1ru0XEImVoUR2lu3t4e3mm5R0-exSUgpOhwlkMKmJFqZZut4j5bidoTDoW40hd4rZMhQDic3HcErZbC8nAliqUZOVRFUxlJ6iDlmCkNZEB5UacMg4jhEsW4EklEQhsU4KLY3E52Vp3ocOUd8d9ASTBJNMNVIJSVhYaRsDjctN43MjhY8HAknFzwmkUklmbY0c83AUCSApSNqGTatIWJgAKLNVoKmlLJVrFWIXZHFKwjz8hJHBxuLlONL2I4PfwONL3Z4OWxfQpAA */
    states: {
      "Loading Todos": {
        invoke: {
          src: "loadTodos",
          onDone: { target: "Todos Loaded", actions: "assignTodosToContext" },
          onError: {
            target: "Loading Todos Errored",
            actions: "assignErrorToContext",
          },
        },
      },

      "Todos Loaded": {},
      "Loading Todos Errored": {},
    },

    context: {
      todos: [],
      errorMessage: undefined,
    },

    tsTypes: {} as import("./todosMiddleMachine.typegen").Typegen0,
    schema: {
      context: {} as { todos: string[]; errorMessage: string | undefined },
      services: {} as {
        loadTodos: {
          data: string[];
        };
      },
    },

    initial: "Loading Todos",
    id: "Todo Machine",
  },
  {
    actions: {
      assignTodosToContext: assign((_context, event) => {
        return { todos: event.data };
      }),
      assignErrorToContext: assign((_context, event) => {
        return { errorMessage: (event.data as Error).message };
      }),
    },
  }
);
