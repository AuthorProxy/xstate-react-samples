import { assign, createMachine } from "xstate";

export const todosFinishMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBkB7dCAqAAgBcKILYBiFwkggNwoGswJNFjyFSlarUbNWCXhUzoGuCvgDaABgC6W7YlAAHVrhVqDIAB6IAbCQCcAFgBMARgAcAdns2bmx66aAMxBADQgAJ6IAc4kNp4erkGOAKz2zp7OQTYAvjnhIjgExORUNPj0TCzsnEIKgsIYReKlUhUy1fL4fEpmGjrqrvpIIMawpqr4FtYIQVkkLppLKSnOKf6eKY7hUQgxJM6ONvaBNo6eQa5HeQVNYiWS5ZWy7GAATm8UbySGADbKADMvqhGqJihIytIqnIFL1Jno9BYxhNzCMZm5Yu4Tu4Uq5DilkppnDtEB4giQggTju4PM4fFtPDcQIV7qQACovOi-MqQNgAYTeYGUYDohAA7oiRsi+tNEG5HAtPPEUu5NO5jic1iSEGkFe5UiEgurNMcPEyWeCSBzqlyeRA2AARMC-MAMEXQyVGEwytGIAC09hSJC8RpSNgJqxVjm2kUQuuDBqCSwy8RsQXNd0tAqFKna4o6FBIAGVsBQxdIgW9UHQCIYAK4MNgAMWBNfw9YYdBw6AqkE9o29k1le1cnmD+qNqvcQUyJxs2ppQccOJOizmQScGbBLWzymk+ehxdL5falertYbbCLdYARqhTP3pUPfQg03rKfYfMF7AkN9qVUujgmtG5yBBcjhbs0JS7rm9AHrIxboDwUKyBwah1N0AhCBaO6CnueZgGKBaIch7TQl0PR7moCI6Eig6oqAMybPYFJXHihLTu4NLaq4HgkOsSxXH4zhnD49iQayJAwfuhHEUWSEoSwbDvJ83x-ICwKglBpDSQRRGHvJpHPCwFGKFR-S6LRUr0VML5+GOniZJ4QFZFcjjJNqzl2EqrgpL+o6ZAEEmWk6LqwQWaFcPU2GZi0oWuopFCmXC1EDFZXrjD6jH+iJrgUvYSZYqaaqUvOsazMkJBKn5y5KuGSoXMFcXOglZGoSpXw-P8DBnlpknxeF5GwuZNHDBlKK2dlCB+iJmhVc4GRYiGKrxJ5-jjqsrjpNklLLk1JQDYldAdYK9pFoYYCQHQdaGI+NnDn6Qa8Yc3j2EVNhXE4KSeVccRHCEziaFc-ghPtpCHW1LDHR8Xy8pYsAMMKJDoACbpvMgaxLEQbA4QdLWDbI0OqX26UDplz5TZsBwmiJvjMZSQOeTS1MRiayzuCJeT5CA+DMHAFi40QdHkwxVj+nMY4BB4BKaDLAQ4tqdhAZcG64gEb2+eJ3OC60TwFvA1ki5NYt7MS5UFQsPhcVx6Q0j+7hg1anLctQkDCxNw4ffxWKaBcYkc4J-5OHEG6aAVYf2EsCSO48iWwETsMQO7WUm4DQarI5prnNOJras4+oOLLWwFeuHgO9rsXQXh4XwSwycUyb2QsVx7lcSVs6uGVuyOG9FJHFi6zpKko6O7pcGyQZx4Vq2F4MPXoszO5S6h3VAXCYrNjuFVM6rGq7khFio-VzJ+kIYZiXz8bTFbAcBXeO9NiLYrqQLEBZzRgkvvJI7EPGRQl8PQyE9DwYcEiBDDmkIOCo0yR2coGC4Xkf74yOidN2hsPYvhmt4BYvEcRJjltLTyFwqpgROEaJUPdXBcxyEAA */

    tsTypes: {} as import("./todosFinishMachine.typegen").Typegen0,
    schema: {
      context: {} as {
        todos: string[];
        errorMessage: string | undefined;
        newTodo: string;
      },
      services: {} as {
        loadTodos: {
          data: string[];
        };
        saveTodo: {
          data: void;
        };
        deleteTodo: {
          data: string;
        };
      },
      events: {} as
        | { type: "Create new" }
        | { type: "Form input changed"; value: string }
        | { type: "Submit" }
        | { type: "Delete todo"; todoToDelete: string }
        | { type: "Speed up" },
    },

    context: {
      todos: [],
      errorMessage: undefined,
      newTodo: "",
    },

    states: {
      "Loading todos": {
        invoke: {
          src: "loadTodos",
          onDone: [
            {
              target: "Todos loaded",
              actions: "assignTodosToContext",
              cond: "Has todos",
            },
            "Creating new todo",
          ],
          onError: {
            target: "Loading todos errored",
            actions: "assignErrorToContext",
          },
        },
      },

      "Todos loaded": {
        on: {
          "Create new": "Creating new todo",
          "Delete todo": "Deleting todo",
        },
      },

      "Loading todos errored": {},

      "Creating new todo": {
        states: {
          "Showing form input": {
            on: {
              "Form input changed": {
                actions: "assignFormInputToContext",
              },

              Submit: "Saving todo",
            },
          },

          "Saving todo": {
            invoke: {
              src: "saveTodo",
              onError: "Showing form input",
              onDone: "#(machine).Loading todos",
            },
          },
        },

        initial: "Showing form input",
      },

      "Deleting todo": {
        invoke: {
          src: "deleteTodo",
          onError: {
            target: "Deleting todo errored",
            actions: "assignErrorToContext",
          },
          onDone: {
            target: "Loading todos",
            actions: "removeTodoFromContext",
          },
        },
      },

      "Deleting todo errored": {
        after: {
          "2500": "Todos loaded",
        },

        on: {
          "Speed up": "Todos loaded",
        },
      },
    },

    initial: "Loading todos",
    id: "(machine)",
  },
  {
    guards: {
      "Has todos": (_context, event) => {
        return event.data.length > 0;
      },
    },
    actions: {
      assignTodosToContext: assign((_context, event) => {
        return { todos: event.data };
      }),
      removeTodoFromContext: assign((context, event) => {
        return {
          todos: context.todos.filter((todo) => todo !== event.data),
        };
      }),
      assignErrorToContext: assign((_context, event) => {
        return { errorMessage: (event.data as Error).message };
      }),
      assignFormInputToContext: assign((_context, event) => {
        return { newTodo: event.value };
      }),
    },
  }
);
