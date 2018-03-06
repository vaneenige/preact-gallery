function message(message, successCallback, errorCallback) {
  try {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = event => {
      if (event.data.error) {
        errorCallback && errorCallback(event.data.error);
        return;
      }
      successCallback && successCallback(event.data);
    };
    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
  } catch (err) {
    errorCallback && errorCallback(err);
  }
}

export default { message };
