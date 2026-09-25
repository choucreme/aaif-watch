const featured=document.querySelector('#featured');
const list=document.querySelector('#articles');
const filters=document.querySelector('#filters');
const count=document.querySelector('#result-count');
const dialog=document.querySelector('#article-dialog');
const dialogContent=document.querySelector('#dialog-content');
const tagNames=['All','A2A','MCP','Operations','Security'];
let active='All';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prettyDate=s=>new Intl.DateTimeFormat('ja-JP',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(`${s}T00:00:00Z`));
const tags=a=>a.map(t=>`<span class="tag">${esc(t)}</span>`).join('');
const first=ARTICLES[0];
featured.innerHTML=`<article class="featured-card"><div class="featured-top"><span class="status">${esc(first.level)} SIGNAL</span><span>DAILY WATCH / NO. ${String(ARTICLES.length).padStart(3,'0')}</span><time datetime="${first.date}">${first.date}</time></div><div class="featured-body"><h3>${esc(first.title)}</h3><p>${esc(first.summary)}</p></div><div class="featured-foot"><div class="tags">${tags(first.tags)}</div><button type="button" class="read-button" data-date="${first.date}">記事を読む ↗</button></div></article>`;
function renderFilters(){filters.innerHTML=tagNames.map(t=>`<button type="button" data-filter="${t}" aria-pressed="${t===active}">${t}</button>`).join('')}
function renderList(){const selected=ARTICLES.filter(a=>active==='All'||a.tags.includes(active));count.textContent=`${String(selected.length).padStart(2,'0')} NOTES`;list.innerHTML=selected.length?selected.map(a=>`<button type="button" class="article-row" data-date="${a.date}" aria-label="${esc(a.date+' '+a.title)} を読む"><time datetime="${a.date}">${a.date}</time><div><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p><span class="row-meta"><b>${esc(a.level)}</b> / ${a.tags.map(esc).join(' · ')}</span></div><span class="row-arrow" aria-hidden="true">↗</span></button>`).join(''):'<p class="empty-state">この分野の記事はまだありません。</p>'}
renderFilters();renderList();
filters.addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;active=b.dataset.filter;renderFilters();renderList()});
function openArticle(date,push=true){const a=ARTICLES.find(a=>a.date===date);if(!a)return;dialogContent.innerHTML=`<div class="dialog-kicker">${esc(a.level)} SIGNAL &nbsp; / &nbsp; <time datetime="${a.date}">${prettyDate(a.date)}</time></div><h2 id="dialog-title">${esc(a.title)}</h2><p class="dialog-summary">${esc(a.summary)}</p>${a.sections.map(s=>`<section><h3>${esc(s.heading)}</h3>${s.html}</section>`).join('')}<div class="sources"><h3>Primary sources</h3>${a.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">↗ ${esc(name)}</a>`).join('')}</div>`;dialog.showModal();if(push)history.replaceState(null,'',`#article-${date}`);document.title=`${a.title} — AAIF Watch`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-date]');if(b)openArticle(b.dataset.date)});
document.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>{if(location.hash.startsWith('#article-'))history.replaceState(null,'','#archive');document.title='AAIF Watch — Choucreme'});
function route(){const m=location.hash.match(/^#article-(\d{4}-\d{2}-\d{2})$/);if(m)openArticle(m[1],false)}window.addEventListener('hashchange',route);route();
