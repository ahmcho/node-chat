const messageInput = document.querySelector("#messageInput");
$(document).on("click", '[id$="-btn"]', function(event) {
    const username = this.id.replace("-btn","");
    messageInput.value += ` @${username} `;
    messageInput.focus();
});