const socket = io();

const messageForm = document.querySelector('#msg-form');
const messageInput = messageForm.querySelector('input');
const messageButton = messageForm.querySelector('button');
const locationButton = document.querySelector('#send-location');

socket.on('message', (message) => {
  console.log(message);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  messageButton.setAttribute('disabled', 'disabled'); //disable the send button after send message

  const inputValue = e.target.elements.message.value;

  socket.emit('sendMessage', inputValue, (error) => {
    messageButton.removeAttribute('disabled'); // enable the send button after aknowledgement

    if (error) {
      return console.log(error);
    }

    console.log('Message delivered!');
  });
  messageInput.value = ''
  messageInput.focus();
});

locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser!');
  }
  locationButton.setAttribute('disabled', 'disabled'); //disable the send location button after send message
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      console.log('Location shared!');
      locationButton.removeAttribute('disabled'); // enable the send location button after aknowledgement
    });
  });
});