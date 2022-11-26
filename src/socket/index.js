const {Server} = require("socket.io")

const createSocketServer = (server) => {
    const io = new Server(server, {
        transports: ["websocket"],
    });

    const departmentRooms = {}

    const leaveRoom = ({socket}) => {

        const user = socket.data.user
        const room = departmentRooms[user.department]

        if (room && departmentRooms[room.name].users.filter((item) => item.id === user.id).length > 0) {

            const roomName = room.name
            departmentRooms[roomName].users = departmentRooms[roomName].users.filter((item) => item.id !== user.id)
            socket.leave(roomName)
        }
    }

    io.on('connection', (socket) => {
        socket.data.user = { id: socket.id }

        socket.on('joinRoom', (user) => {

            const { department_id, id, name} = user

            socket.join(department_id)
            socket.data.user = {
                department: department_id,
                name,
                user_id: id
            }

            const socketUser = { name, user_id: id, id: socket.id }

            if(departmentRooms[department_id]) {
                departmentRooms[department_id] = {
                    name: department_id,
                    users: departmentRooms[department_id].users.concat([socketUser]),
                    notifications: departmentRooms[department_id].notifications || []
                }
            } else {
                departmentRooms[department_id] = { name: department_id, notifications: [], users: [socketUser]}
            }
            io.to(department_id).emit('joinRoom', {room: departmentRooms[department_id]})
        })

        socket.on('sendNotification', ({user, topic}) => {
            const { department_id, name} = user

            if(departmentRooms[department_id]) {
                const notification = { name, value: topic }
                departmentRooms[department_id].notifications.push(notification)
                io.to(department_id).emit('sendNotification', {room: departmentRooms[department_id]})
            }
        })

        socket.on('leaveRoom', () => {
            leaveRoom({socket})
        })

        socket.on('disconnect', () => {
            leaveRoom({socket})
        });
    })
}

module.exports = createSocketServer