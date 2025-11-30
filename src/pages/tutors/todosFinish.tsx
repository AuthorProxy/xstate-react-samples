import { todosFinishMachine } from "@/machines/todosFinishMachine";
import styles from "@/styles/Home.module.css";
import { useMachine } from "@xstate/react";
import { FC } from "react";

const todos = new Set<string>(["Take bins out", "Do laundry"]);

export const TodosFinish: FC<{ title: string }> = ({ title }) => {
  const [state, send] = useMachine(todosFinishMachine, {
    services: {
      loadTodos: async (_context, _event) => {
        // throw new Error("Oh no! [loadTodos event]");
        return Array.from(todos);
      },
      saveTodo: async (context, _event) => {
        todos.add(context.newTodo);
      },
      deleteTodo: async (_context, event) => {
        // throw new Error("Oh no! [deleteTodo event]");
        todos.delete(event.todoToDelete);
        return event.todoToDelete;
      },
    },
  });

  return (
    <div className={styles.card}>
      <h5 className={styles.h5}>{title}</h5>
      <br />
      <pre className={styles.dumpJs}>{JSON.stringify(state.value)}</pre>
      <pre className={styles.dumpJs}>{JSON.stringify(state.context)}</pre>

      <br />

      <div>
        {state.matches("Todos loaded") && (
          <>
            {state.context.todos.map((todo) => (
              <div
                key={todo}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p style={{ marginRight: "5px" }}>{todo}</p>
                <button
                  onClick={() => {
                    send({ type: "Delete todo", todoToDelete: todo });
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}

        <br />
        <br />

        {state.matches("Todos loaded") && (
          <button onClick={() => send({ type: "Create new" })}>
            Create new
          </button>
        )}

        {state.matches("Deleting todo errored") && (
          <>
            <p>Something went wrong: {state.context.errorMessage}</p>
            <button
              onClick={() => {
                send({ type: "Speed up" });
              }}
            >
              Go back to list
            </button>
          </>
        )}

        {state.matches("Creating new todo.Showing form input") && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send({ type: "Submit" });
            }}
          >
            <input
              onChange={(e) => {
                send({
                  type: "Form input changed",
                  value: e.target.value,
                });
              }}
            ></input>
          </form>
        )}
      </div>
    </div>
  );
};
