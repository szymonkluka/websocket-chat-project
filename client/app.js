const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

let userName = "";

function login(event) {
  event.preventDefault();
  if (userNameInput.value === "") {
    alert("Please enter a username");
  } else {
    userName = userNameInput.value;
    loginForm.classList.remove("show");
    messagesSection.classList.add("show");
  }
}
function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) {
    message.classList.add('message--self');
  }
  message.innerHTML = ` <h3 class="message__author">${author === userName ? 'You' : author
    }</h3>
    <div class="message__content">${content}</div>`;
  messagesList.appendChild(message);
};

function sendMessage(event) {
  event.preventDefault();
  const messageContent = messageContentInput.value;
  if (!messageContent) {
    alert("Please enter a message");
    return;
  }
  addMessage(userName, messageContent);
  messageContentInput.value = '';
}

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);