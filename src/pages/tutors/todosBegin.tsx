import { todosBeginMachine } from "@/machines/todosBeginMachine";
import styles from "@/styles/Home.module.css";
import { useMachine } from "@xstate/react";
import { FC } from "react";

const todos = new Set<string>(["Take bins out", "Do laundry"]);

export const TodosBegin: FC<{ title: string }> = ({ title }) => {
  const [state, send] = useMachine(todosBeginMachine);
  return (
    <div className={styles.card}>
      <h5 className={styles.h5}>{title}</h5>
      <br />
      <pre className={styles.dumpJs}>{JSON.stringify(state.value)}</pre>
      <br />
      <br />
      <button
        onClick={() =>
          send({ type: "Loading todos succeeded", todos: ["Take bins out"] })
        }
      >
        Loading todos succeeded
      </button>
      <br />
      <br />
      <button
        onClick={() =>
          send({ type: "Loading todos failed", errorMessage: "Oh no!" })
        }
      >
        Loading todos failed
      </button>
      <br />
      <br />
    </div>
  );
};
