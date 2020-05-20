export function toEmit(emitter: NodeJS.EventEmitter, event: string, errorEvent = 'error'): Promise<any> {
  const { resolve, reject, promise } = deferred();

  emitter.on(event, resolve);
  emitter.on(errorEvent, reject);

  return promise;
}

export function to(promise: Promise<any>) {
  return promise.then((data) => {
    return [null, data];
  })
    .catch((err) => [err]);
}

export function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}