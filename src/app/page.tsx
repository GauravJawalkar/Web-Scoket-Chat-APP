"use client"
import Form from "@/components/Form";
import MessageBox from "@/components/MessageBox";
import React, { useState, useEffect } from "react";
import { socket } from '@/lib/SocketClient'

export default function Home() {
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [messages, setMessages]: any = useState([]);

  const handelRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (room && username) {
      socket.emit("join-room", { room, username: username });
    }
    setJoined(true);
  }

  const handelSendMessage = (message: string) => {
    console.log(message);
    const data = { room, message, sender: username }
    setMessages((prev: any) => [...prev, { sender: username, message }]);
    socket.emit('message', data)
  }

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev: any) => [...prev, data])
    });

    socket.on('user_joined', (message) => {
      setMessages((prev: any) => [...prev, { sender: "system", message }])
    });

    return () => {
      socket.off("user_joined");
      socket.off("message")
    }
  }, [])

  return (
    <section className="flex items-center justify-center min-h-screen">
      {!joined ? (
        <div>
          <form onSubmit={handelRoomSubmit} className="mx-auto w-[450px]">
            <h1 className="text-3xl text-center font-semibold">Join Room</h1>
            <div className="my-5">
              <input type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} className="outline outline-1 outline-gray-400 focus:outline-gray-700 w-full px-3 py-2 rounded" placeholder="Enter UserName" />
            </div>
            <div className="my-5">
              <input type="text" value={room} onChange={(e) => { setRoom(e.target.value) }} className="outline outline-1 outline-gray-400 focus:outline-gray-700 w-full px-3 py-2 rounded" placeholder="Enter Room Id" />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-all ease-in-out duration-200 text-white rounded uppercase">Join now</button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-5 justify-center">
          <h1 className="text-3xl text-start font-semibold">ROOM : {room}</h1>
          <div className="h-[500px] overflow-y-auto p-4 bg-gray-200 border-2 rounded-lg w-[800px]">
            {
              messages.map(({ message, sender }: any) => {
                return (
                  <div key={Math.floor(Math.random() * 1000 + 1)}>
                    <MessageBox
                      message={message}
                      sender={sender}
                      isOwnMessage={sender === username}
                    />
                  </div>
                )
              })
            }
          </div>
          <Form onSendMessage={handelSendMessage} />
        </div >
      )
      }

    </section >
  );
}
