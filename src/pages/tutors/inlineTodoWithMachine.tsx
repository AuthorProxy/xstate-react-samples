import styles from "@/styles/Home.module.css";
import { useMachine } from "@xstate/react";
import { FC, useRef } from "react";
import { assign, createMachine } from "xstate";

export const InlineTodoWithMachine: FC<{ title: string }> = ({ title }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, send] = useMachine(
    createMachine({
      context: { message: "", todos: ["test"] },
      on: {
        change: {
          actions: assign({
            message: (_, ev) => (ev as unknown as { message: string }).message,
          }),
        },
        create: {
          actions: [
            assign((ctx) => {
              return {
                todos: [...ctx.todos, ctx.message],
              };
            }),
            assign({ message: "" }),
            () => inputRef.current?.focus(),
          ],
        },
      },
      predictableActionArguments: true,
    })
  );

  return (
    <div className={styles.card}>
      <h5 className={styles.h5}>{title}</h5>
      <br />
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          send({ type: "create" });
        }}
      >
        <input
          ref={inputRef}
          onChange={(ev) => send({ type: "change", message: ev.target.value })}
          value={state.context.message}
          placeholder="What needs to be done?"
          style={{ width: "200px" }}
        />

        <br />
        <br />

        <button type="submit">Create new todo</button>

        <br />
        <br />

        {state.context.todos.map((todo, i) => (
          <div key={todo + i}>{todo}</div>
        ))}
      </form>
    </div>
  );
};
