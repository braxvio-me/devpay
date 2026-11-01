/** Lets screens wait for the launch splash to finish before playing their own entrance animations. */
let done = false;
const waiting = new Set<() => void>();

export function markIntroDone() {
  done = true;
  waiting.forEach((cb) => cb());
  waiting.clear();
}

/** Calls `cb` once the splash is gone (right away if it already is). Returns an unsubscribe. */
export function afterIntro(cb: () => void) {
  if (done) {
    cb();
    return () => {};
  }
  waiting.add(cb);
  return () => waiting.delete(cb);
}
