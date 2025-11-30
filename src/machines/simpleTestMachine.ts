import { createMachine } from "xstate";

export const simpleTestMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOnwHsAXACXIDcwAnSAYgFkB5AVQGUBRAPocAanwBKAbQAMAXUSgADuVi5KucvnkgAHogC0ARgDMANhIAmABwAWU1JPmTAdktOjAGhABPRAYCsAJwkUjZGTlIB1n5+tuZOAL7xnmhYeISk2PRMrJy8gtwAKtJySCBKKmoaWroIhkbmJP4BdiYB5kZ+5tbWnj61Jn7Btm6WVn5SUn6miUkgFBBwWik4BMRa5arqmqU1eo6DAQEmls6W-uEdvfr+DcZO1q4mJqaOAZaJyRgr6WRUtAzMCDrZSbKo7fTmAxOEiHY6nc5SDrmK4IQIkerjKS2KTmRxGAzvWbLNLEEiZAGQYEVLbVXzWGEBewGLqBIz41woqYkcIuCJ+SwTazmN4zeJAA */
  initial: "notHovered",

  states: {
    notHovered: { on: { MOUSE_OVER: { target: "hovered" } } },
    hovered: { on: { MOUSE_OUT: { target: "notHovered" } } },
  },
});
