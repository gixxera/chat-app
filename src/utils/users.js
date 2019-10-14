const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: 'Username and room are required'
    }
  }

  const existingUser = users.find((user) => user.room === room && user.username === username);

  if (existingUser) {
    return {
      error: 'Username is in use!'
    }
  }

  const user = { id, username, room }
  users.push(user);
  return { user }
}

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    return users.splice(userIndex, 1)[0];
  }
}

addUser({
  id: 100,
  username: 'milen',
  room: 'sofia'
});

console.log(users);

const removedUser = removeUser(100);
console.log(removedUser);
console.log(users);