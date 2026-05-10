import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect() {
    if (!this.socket) {
      this.socket = io(window.location.origin, {
        transports: ['websocket'], // Faster, lower overhead for 10k+ users
        upgrade: false
      });
      
      this.socket.on('connect', () => {
        console.log('Connected to real-time backend');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from real-time backend');
      });
    }
    return this.socket;
  }

  public getSocket() {
    return this.socket;
  }

  public subscribeToShibirs(callback: (shibirs: any[]) => void) {
    this.socket?.on('shibirs:sync', callback);
  }

  public subscribeToShibirAdded(callback: (shibir: any) => void) {
    // Handle both single and batched updates
    this.socket?.on('shibir:added', callback);
    this.socket?.on('shibirs:batch_add', (items: any[]) => {
      items.forEach(item => callback(item));
    });
  }

  public subscribeToShibirRemoved(callback: (id: string) => void) {
    // Handle both single and batched removals
    this.socket?.on('shibir:removed', callback);
    this.socket?.on('shibirs:batch_remove', (ids: string[]) => {
      ids.forEach(id => callback(id));
    });
  }

  public subscribeToShibirUpdated(callback: (shibir: any) => void) {
    this.socket?.on('shibir:updated', callback);
  }

  public addShibir(shibir: any) {
    this.socket?.emit('shibir:add', shibir);
  }

  public updateShibir(shibir: any) {
    this.socket?.emit('shibir:update', shibir);
  }

  public removeShibir(id: string) {
    this.socket?.emit('shibir:remove', id);
  }
}

export const socketService = SocketService.getInstance();
