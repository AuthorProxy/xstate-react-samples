import { createMachine } from "xstate";

export const todosBeginMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUAICyBDAxgBYCWAdmAHQAyquEZUmaGsAxDXQ5gC7qqyZYAV3z4wkSAG0ADAF1EoAA79i3YqlIKQAD0QBaaRQBMAFgDMAdgCsADhM2zNowDYAnK5MBGCwBoQAT30jGwpXb09XC2krM1cY1yMLAF8kv2YsPCIySg56UkZ0tlyuXhZMADNcYgAbKTktZVhVdU0kHUQIihtpE2duoyMzWOjnIz9AhE8bCworIymLCyNpT2jpZ08U1JBSdDgtdJwCEnIGlTUNLV0EPXtjc2s7Byc3D3H9T09nY3CbDaNXBt7CYUmk+EcsuRqLQ8gU+PA2o1mpc2tcTGMAohpl1pGZPHjnFYrNJpNYzKCQIdMidKIVMLlIGcmhdWqBrmYTIZSTZPMtIhZzBiJnoARReRyzM5rNJ3GYBhSqcdstDOPkmPDMABRABO2tQ2sZiPOLSuiDxhjivUWDj6fOc70m2LxVlGFkBSz65K2QA */
    states: {
      "Loading Todos": {
        on: {
          "Loading todos succeeded": {
            target: "Todos Loaded",
            actions: "consoleLogTodos",
          },
          "Loading todos failed": {
            target: "Loading Todos Errored",
          },
        },
      },

      "Todos Loaded": {},
      "Loading Todos Errored": {},
    },

    tsTypes: {} as import("./todosBeginMachine.typegen").Typegen0,
    schema: {
      context: {} as {},
      events: {} as
        | { type: "Loading todos succeeded"; todos: string[] }
        | { type: "Loading todos failed"; errorMessage: string },
    },

    initial: "Loading Todos",
    id: "Todo Machine",
  },
  {
    actions: {
      consoleLogTodos: (_context, event) => {
        window.alert(JSON.stringify(event.todos));
      },
    },
  }
);
