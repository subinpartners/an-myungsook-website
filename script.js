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

// 공통 스크립트 위치를 기준으로 하위 폴더에서도 같은 연락처로 연결합니다.
const siteBase = new URL('./', document.currentScript.src);
const contactMenu = navigation.querySelector('.nav-contact');
if (contactMenu) {
  contactMenu.href = new URL('contact.html', siteBase).href;
  contactMenu.textContent = '연락하기';
}
const footer = document.querySelector('footer.footer');
if (footer) {
  const links = document.createElement('nav');
  links.className = 'footer-links';
  links.setAttribute('aria-label', '이메일 및 SNS');
  [
    ['이메일 realams@gmail.com', 'mailto:realams@gmail.com'],
    ['스레드', 'https://www.threads.net/@anmyungsook'],
    ['인스타그램', 'https://www.instagram.com/anmyungsook/'],
    ['유튜브', 'https://www.youtube.com/@RealestateBroadcastingSystem']
  ].forEach(([label, href]) => {
    const link = document.createElement('a');
    link.textContent = label;
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    links.append(link);
  });
  footer.append(links);
}

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
            : (["market-four-signals-20261111","first-story-20260829","behind-package-20260829"].includes(post.id) ? 'story/' + encodeURIComponent(post.id) + '.html' : 'story/post.html?id=' + encodeURIComponent(post.id || ''));
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
