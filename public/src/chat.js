const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#msg-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = e.target.elements.message.value;
  socket.emit('sendMessage', inputValue);
});
