// ======== builder.js ========

// Array to store replies dynamically
let replies = [];

// Store accounts loaded from accounts.js
let accounts = window.ACCOUNTS || [];

// ====== Initialize account dropdown ======
const accountSelect = document.getElementById('accountSelect');

function populateAccounts() {
  if (!accountSelect || accounts.length === 0) return;

  accounts.forEach(acc => {
    const option = document.createElement('option');
    option.value = acc.id;
    option.textContent = acc.name + ' (' + acc.handle + ')';
    accountSelect.appendChild(option);
  });

  accountSelect.addEventListener('change', () => {
    const selected = accounts.find(acc => acc.id == accountSelect.value);
    if (selected) fillAccount(selected);
  });
}

// Fill editor inputs with selected account info
function fillAccount(account) {
  document.getElementById('name').value = account.name || '';
  document.getElementById('handle').value = account.handle || '';
  document.getElementById('icon').value = account.icon || '';
  update(); // refresh preview
}

// ====== Replies ======
function addReply() {
  const id = Date.now();
  replies.push({ id, name: '', handle: '', icon: '', content: '' });
  renderReplies();
}

function renderReplies() {
  const container = document.getElementById('replies');
  if (!container) return;

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

function updateReply(id, field, value) {
  const r = replies.find(x => x.id === id);
  if (r) {
    r[field] = value;
    update();
  }
}

function deleteReply(id) {
  replies = replies.filter(r => r.id !== id);
  renderReplies();
  update();
}

// ====== Generate AO3 Tweet HTML ======
function formatHashtags(text) {
  if (!text) return '';
  return text
    .split(' ')
    .filter(t => t)
    .map(tag => `<span class="twt-hl">${tag}</span>`)
    .join(' ');
}

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

// ====== Update preview and output ======
function update() {
  const html = generateHTML();
  const output = document.getElementById('output');
  const preview = document.getElementById('preview');

  if (output) output.value = html;
  if (preview) preview.innerHTML = html;
}

// ====== Copy HTML to clipboard ======
function copyHTML() {
  const textarea = document.getElementById('output');
  if (textarea) {
    textarea.select();
    document.execCommand('copy');
  }
}

// ====== Initialize editor inputs ======
const inputIds = ['name','handle','icon','content','hashtags','timestamp','retweets','quotes','likes'];
inputIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', update);
});

// ====== Run on load ======
window.addEventListener('DOMContentLoaded', () => {
  populateAccounts();
  update(); // render empty preview initially
});