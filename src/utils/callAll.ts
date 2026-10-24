export function callAll<Args extends unknown[]>(...fns: Array<((...args: Args) => void) | undefined>) {
  return (...args: Args) => {
    fns.forEach(fn => {
      if (typeof fn === 'function') {
        fn(...args)
      }
    })
  }
}
