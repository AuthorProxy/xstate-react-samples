import {
  Todo,
  sharedStateTodoMachine,
} from "@/machines/sharedStateTodoMachine";
import styles from "@/styles/Home.module.css";
import { createActorContext, shallowEqual, useMachine } from "@xstate/react";
import { FC, useEffect, useRef } from "react";
import { assign, createMachine } from "xstate";

const SharedStateTodoContext = createActorContext(sharedStateTodoMachine);

const NewTodo = () => {
  const sharedStateTodoActor = SharedStateTodoContext.useActorRef();

  const inputRef = useRef<HTMLInputElement>(null);
  const [state, send] = useMachine(
    createMachine({
      context: { message: "" },
      on: {
        change: {
          actions: assign({
            message: (_, ev) => (ev as unknown as { message: string }).message,
          }),
        },
        create: {
          actions: [
            "addTodo",
            assign({ message: "" }),
            () => inputRef.current?.focus(),
          ],
        },
      },
      predictableActionArguments: true,
    }),
    {
      actions: {
        addTodo: (ctx) => {
          sharedStateTodoActor.send({
            type: "todo.create",
            todo: { message: ctx.message, status: "incomplete" },
          });
        },
      },
    }
  );

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        send("create");
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

      <button onClick={() => {}} type="submit">
        Create new todo
      </button>

      <br />
      <br />
    </form>
  );
};

const TodoItem: FC<{ todo: Todo }> = ({ todo }) => {
  const sharedStateTodoActor = SharedStateTodoContext.useActorRef();

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
      }}
    >
      <input
        type="checkbox"
        checked={todo.status === "complete"}
        onChange={(ev) => {
          sharedStateTodoActor.send({
            type: "todo.setStatus",
            id: todo.id || 0,
            status: ev.target.checked ? "complete" : "incomplete",
          });
        }}
      />

      <input
        defaultValue={todo.message}
        onBlur={(ev) => {
          sharedStateTodoActor.send({
            type: "todo.update",
            todo: { ...todo, message: ev.target.value },
          });
        }}
        style={
          todo.status === "complete"
            ? {
                textDecoration: "line-through",
                opacity: "0.5",
                marginLeft: "7px",
              }
            : { marginLeft: "7px" }
        }
      />

      <button
        type="button"
        onClick={(ev) => {
          sharedStateTodoActor.send({ type: "todo.delete", id: todo.id || 0 });
        }}
        style={{ marginLeft: "7px" }}
      >
        X
      </button>
    </form>
  );
};

const Todos = () => {
  const sharedStateTodoActor = SharedStateTodoContext.useActorRef();
  const todos = SharedStateTodoContext.useSelector(
    (state) => state.context.todos,
    shallowEqual
  );

  useEffect(
    () =>
      sharedStateTodoActor.subscribe((state) => {
        console.log("[sharedStateTodo] --- ", state.event);
      }).unsubscribe,
    [sharedStateTodoActor]
  );

  return (
    <>
      <NewTodo />
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </>
  );
};

const persistedMachine = sharedStateTodoMachine.withContext({
  todos: [
    {
      id: 12345,
      message: "from persisted storage",
      status: "complete",
    },
  ],
});

export const SharedStateTodo: FC<{ title: string }> = ({ title }) => (
  <SharedStateTodoContext.Provider machine={persistedMachine}>
    <div className={styles.card}>
      <h5 className={styles.h5}>{title}</h5>
      <br />
      <Todos />
    </div>
  </SharedStateTodoContext.Provider>
);
