let subscribers = []
let activeRequests = 0;

export function subscribeToGlobalLoading(listener) {
    subscribers.push(listener);

    // this function "removes" that listener later
    return function unsubscribe() {
        subscribers = subscribers.filter((lis) => lis !== listener);
    };
}

export function updateGlobalLoading(delta) {
    activeRequests += delta;

    const isLoading = activeRequests > 0;

    subscribers.forEach((listener) => listener(isLoading));
}