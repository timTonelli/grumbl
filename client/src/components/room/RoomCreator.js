import React, { useContext, useEffect, useState } from "react"
import { Redirect } from "react-router-dom"
import { useUser } from "../../services/UserContext"

const RoomCreator = ({ socket, ...rest }) => {
  const user = useUser()
  const [roomId, setRoomId] = useState(null)

  useEffect(() => {
    socket.on("room:create success", createdRoomId => setRoomId(createdRoomId))

    socket.on("room:create open-room-exists", (openRoomId) => setRoomId(openRoomId))
    
    socket.emit("room:create", user)

    return () => {
      socket.removeAllListeners("room:create success")
      socket.removeAllListeners("room:create open-room-exists")
    }
  }, [])

  if (roomId) {
    return (
      <Redirect to={{
        pathname: `/rooms/${roomId}`,
        socket: socket
      }} />
    )
  }

  return (
    <>
      <div>Creating your room...</div>
    </>
  )
}

export default RoomCreator