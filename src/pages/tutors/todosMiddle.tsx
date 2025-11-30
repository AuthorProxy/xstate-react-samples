import { todosMiddleMachine } from "@/machines/todosMiddleMachine";
import styles from "@/styles/Home.module.css";
import { useMachine } from "@xstate/react";
import { FC } from "react";

const todos = new Set<string>(["Take bins out", "Do laundry"]);

export const TodosMiddle: FC<{ title: string }> = ({ title }) => {
  const [state, _send] = useMachine(todosMiddleMachine, {
    services: {
      loadTodos: async () => {
        // throw new Error("Oh no!");
        return ["Take bins out", "Do laundry"];
      },
    },
  });

  return (
    <div className={styles.card}>
      <h5 className={styles.h5}>{title}</h5>
      <br />
      <pre className={styles.dumpJs}>{JSON.stringify(state.value)}</pre>
      <pre className={styles.dumpJs}>{JSON.stringify(state.context)}</pre>
    </div>
  );
};
