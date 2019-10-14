const socket = io();

// Elements
const messageForm = document.querySelector('#msg-form');
const messageInput = messageForm.querySelector('input');
const messageButton = messageForm.querySelector('button');
const locationButton = document.querySelector('#send-location');
const messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  });
  messages.insertAdjacentHTML('beforeend', html); // Insert another HTML to messages
});

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a')
  });
  messages.insertAdjacentHTML('beforeend', html);
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
  locationButton.setAttribute('disabled', 'disabled'); // disable the send location button after send message
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

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});