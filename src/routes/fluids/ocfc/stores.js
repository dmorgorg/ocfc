import { writable } from "svelte/store";

const digs = {
  sdigs: 3,
  extraDig: true,
  wdigs: 6,
  extraWorkingDig: true,
};
// export const digs = writable(initDigs);

export const sigdigs = writable(digs);
