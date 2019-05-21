export const setupWebsocket = ({ ws_url}) =>
    new Promise((resolve) => {
        const webSocket = new WebSocket(ws_url);

        const receive = (onMessageCb) => {
            console.log("GOT WEBSOCKET MESSAGE::");
            webSocket.onmessage = (event) => onMessageCb(JSON.parse( event.data));
        };

        const send = (type, payload) =>
            webSocket.send(JSON.stringify({ type, payload }));

        webSocket.onopen = () => resolve({ send, receive });
    });