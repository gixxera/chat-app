const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#msg-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = e.target.elements.message.value;
  socket.emit('sendMessage', inputValue);
});

// socket.on('countUpdated', (count) => {
//   console.log('The count has been updated!', count);
// });

// document.querySelector('#increment').addEventListener('click', () => {
//   socket.emit('increment');
// });
