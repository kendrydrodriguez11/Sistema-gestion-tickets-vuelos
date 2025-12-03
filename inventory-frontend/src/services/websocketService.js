import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscribers = [];
  }

  connect(onConnected, onError) {
    const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8081/ws';
    
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket Connected');
      this.connected = true;
      if (onConnected) onConnected();
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      if (onError) onError(frame);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      console.log('WebSocket Disconnected');
    }
  }

  subscribeToNotifications(callback) {
    if (!this.connected) {
      console.error('WebSocket not connected');
      return null;
    }

    const subscription = this.client.subscribe('/topic/notifications', (message) => {
      const notification = JSON.parse(message.body);
      callback(notification);
    });

    this.subscribers.push(subscription);
    return subscription;
  }

  subscribeToActivity(callback) {
    if (!this.connected) {
      console.error('WebSocket not connected');
      return null;
    }

    const subscription = this.client.subscribe('/topic/activity', (message) => {
      const activity = JSON.parse(message.body);
      callback(activity);
    });

    this.subscribers.push(subscription);
    return subscription;
  }

  unsubscribe(subscription) {
    if (subscription) {
      subscription.unsubscribe();
      this.subscribers = this.subscribers.filter(sub => sub !== subscription);
    }
  }

  sendMessage(destination, body) {
    if (this.connected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(body),
      });
    }
  }
}

export default new WebSocketService();