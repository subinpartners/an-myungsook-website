const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia('(min-width: 601px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();

// 홈의 최신 글은 게시 데이터 한 곳에서 관리합니다.
const latestPosts = document.querySelector('#latest-posts');
if (latestPosts) {
  const textElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  };
  fetch('story/posts.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error('Posts unavailable');
      return response.json();
    })
    .then(posts => {
      if (!Array.isArray(posts)) throw new Error('Invalid posts');
      latestPosts.replaceChildren();
      posts.slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
        .slice(0, 3).forEach(post => {
          const card = document.createElement('a');
          card.className = 'story-card latest-card';
          card.href = post.url ? new URL(String(post.url), new URL('story/', location.href)).href
            : 'story/post.html?id=' + encodeURIComponent(post.id || '');
          const date = textElement('time', 'category', String(post.date || ''));
          date.dateTime = String(post.date || '');
          card.append(date, textElement('h3', '', post.title || '(제목 없음)'),
            textElement('p', '', post.summary || ''), textElement('span', 'read', '이야기 읽기 ↗'));
          latestPosts.append(card);
        });
      if (!posts.length) latestPosts.append(textElement('p', 'muted', '첫 번째 이야기를 준비하고 있습니다.'));
    })
    .catch(() => {
      latestPosts.replaceChildren(textElement('p', 'muted', '이야기를 불러오지 못했습니다. 잠시 후 다시 방문해주세요.'));
    });
}
