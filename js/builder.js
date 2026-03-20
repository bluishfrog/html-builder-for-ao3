// js/builder.js

let replies = [];

// Add a new reply
function addReply() {
    const id = Date.now();
    replies.push({ id, name: '', handle: '', icon: '', content: '' });
    renderReplies();
}

// Render all replies in the editor
function renderReplies() {
    const container = document.getElementById('replies');
    container.innerHTML = '';

    replies.forEach(r => {
        const div = document.createElement('div');
        div.className = 'reply';
        div.innerHTML = `
            <input placeholder="Name" oninput="updateReply(${r.id}, 'name', this.value)">
            <input placeholder="Handle" oninput="updateReply(${r.id}, 'handle', this.value)">
            <input placeholder="Icon URL" oninput="updateReply(${r.id}, 'icon', this.value)">
            <textarea placeholder="Reply" oninput="updateReply(${r.id}, 'content', this.value)"></textarea>
            <button onclick="deleteReply(${r.id})">Delete</button>
        `;
        container.appendChild(div);
    });
}

// Update a reply object
function updateReply(id, field, value) {
    const r = replies.find(x => x.id === id);
    r[field] = value;
    update();
}

// Delete a reply
function deleteReply(id) {
    replies = replies.filter(r => r.id !== id);
    renderReplies();
    update();
}

// Format hashtags
function formatHashtags(text) {
    if (!text) return '';
    return text.split(' ').map(tag => `<span class="twt-hl">${tag}</span>`).join(' ');
}

// Generate the full HTML for preview
function generateHTML() {
    const name = document.getElementById('name').value;
    const handle = document.getElementById('handle').value;
    const icon = document.getElementById('icon').value;
    const content = document.getElementById('content').value;
    const hashtags = formatHashtags(document.getElementById('hashtags').value);
    const timestamp = document.getElementById('timestamp').value;
    const retweets = document.getElementById('retweets').value;
    const quotes = document.getElementById('quotes').value;
    const likes = document.getElementById('likes').value;

    let html = `<div class="twt">

<div class="twt-header">
  <div class="twt-icon-container">
    <p><img class="twt-icon" src="${icon}"></p>
  </div>
  <div class="twt-id">
    <p><span class="twt-name">${name}</span><br>
    <span class="twt-handle">${handle}</span></p>
  </div>
</div>

<div class="twt-content">
  <p>${content}</p>
</div>

<p>${hashtags}</p>

<div class="twt-timestamp">
  <p>${timestamp}</p>
</div>

<hr class="twt-sep">

<div class="twt-stat1">
  <p><strong>${retweets}</strong> Retweets <strong>${quotes}</strong> Quote Tweets <strong>${likes}</strong> Likes</p>
</div>
`;

    replies.forEach(r => {
        html += `
<hr class="twt-sep-reply">

<div class="twt-replybox">
  <div class="twt-icon-replycontainer">
    <p><img class="twt-icon" src="${r.icon}"></p>
  </div>
  <div class="twt-replycontainer">
    <p><span class="twt-name">${r.name}</span> <span class="twt-handle">${r.handle}</span></p>
    <div class="twt-replycontent">
      <p>${r.content}</p>
    </div>
  </div>
</div>`;
    });

    html += '\n</div>';
    return html;
}

// Update preview and output
function update() {
    const html = generateHTML();
    document.getElementById('output').value = html;
    document.getElementById('preview').innerHTML = html;
}

// Copy HTML
function copyHTML() {
    const textarea = document.getElementById('output');
    textarea.select();
    document.execCommand('copy');
}

// Update preview on input
['name','handle','icon','content','hashtags','timestamp','retweets','quotes','likes'].forEach(id => {
    document.getElementById(id).addEventListener('input', update);
});

// Account selection logic
document.getElementById("accountSelect").addEventListener("change", function () {
    const selectedId = this.value;
    const nameInput = document.getElementById("name");
    const handleInput = document.getElementById("handle");
    const iconInput = document.getElementById("icon");

    if (selectedId) {
        const acc = getAccountById(selectedId);
        nameInput.value = acc.name;
        handleInput.value = acc.handle;
        iconInput.value = acc.icon;

        nameInput.disabled = true;
        handleInput.disabled = true;
        iconInput.disabled = true;
    } else {
        nameInput.value = "";
        handleInput.value = "";
        iconInput.value = "";
        nameInput.disabled = false;
        handleInput.disabled = false;
        iconInput.disabled = false;
    }

    update();
});