import { Server, Socket } from "socket.io";

let shibirs = [
  {
    id: "1",
    title: "Summer Meditation Retreat",
    description: "A 5-day deep dive into inner silence and mindfulness.",
    startDate: "2026-06-15",
    endDate: "2026-06-20",
    location: "Shimla, HP",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800"
  }
];

// High-concurrency broadcast buffer
let updateQueue: any[] = [];
let deleteQueue: string[] = [];

export function setupSocketHandlers(io: Server) {
  // Batch broadcast every 500ms to prevent O(N^2) message explosion
  setInterval(() => {
    if (updateQueue.length > 0) {
      io.emit("shibirs:batch_add", updateQueue);
      updateQueue = [];
    }
    if (deleteQueue.length > 0) {
      io.emit("shibirs:batch_remove", deleteQueue);
      deleteQueue = [];
    }
  }, 500);

  io.on("connection", (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.emit("shibirs:sync", shibirs);

    socket.on("shibir:add", (data) => {
      const newShibir = {
        ...data,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date().toISOString()
      };
      shibirs.unshift(newShibir);
      updateQueue.push(newShibir);
      
      // Limit memory usage for demo purposes
      if (shibirs.length > 5000) shibirs = shibirs.slice(0, 5000);
    });

    socket.on("shibir:remove", (id: string) => {
      shibirs = shibirs.filter(s => s.id !== id);
      deleteQueue.push(id);
    });

    socket.on("shibir:update", (updatedShibir) => {
      shibirs = shibirs.map(s => s.id === updatedShibir.id ? updatedShibir : s);
      io.emit("shibir:updated", updatedShibir);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
}
