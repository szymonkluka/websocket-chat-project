const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");
const socket = io();
let userName = "";

function login(event) {
  event.preventDefault();
  if (userNameInput.value === "") {
    alert("Please enter a username");
  } else {
    userName = userNameInput.value;
    socket.emit('join', userName);
    loginForm.classList.remove("show");
    messagesSection.classList.add("show");
  }
}

function addMessage(author, content, isBot = false) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) {
    message.classList.add('message--self');
  }
  if (isBot) {
    message.classList.add('message--bot');
    author = 'Chat Bot';
  }
  message.innerHTML = ` <h3 class="message__author">${author === userName ? 'You' : author
    }</h3>
    <div class="message__content">${content}</div>`

  messagesList.appendChild(message);
};

function sendMessage(e) {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if (!messageContent.length) {
    alert('You have to type something!');
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
  }

}

socket.on('message', ({ author, content }) => addMessage(author, content))
socket.on('newUser', ({ author }) => {
  if (author !== userName) {
    addMessage("Chat Bot", `<i>${author} has joined the conversation!</i>`, true);
  }
});

socket.on('removeUser', ({ author, userName }) => {
  if (userName === userNameInput.value) {
    alert('You have been disconnected from the chat');
    loginForm.classList.add("show");
    messagesSection.classList.remove("show");
    return;
  }

  const message = `${author} has left the conversation... :(`;
  addMessage('Chat Bot', message, true);
});

loginForm.addEventListener("submit", login);
addMessageForm.addEventListener("submit", sendMessage);