/* Visit Hornelen - Admin Panel JavaScript */

// Default data (same as used in front-end pages)
const defaultArticles = [
  { id:1, title:"Turguide: Hornelen fra Hunskaar", excerpt:"Den klassiske ruten til toppen av Europas hoyeste sjoklippe.", category:"vandring", date:"2026-04-12", readTime:"8 min", icon:"&#9968;", content:"<p>Hornelen er Europas hoeyeste sjoklippe og en av de mest populaere turene i Bremanger.</p>" },
  { id:2, title:"Skjulte Perler i Bremanger", excerpt:"Oppdag de hemmelige strendene og fossene.", category:"natur", date:"2026-04-08", readTime:"6 min", icon:"&#127754;", content:"<p>Bremanger er full av skjulte perler som venter paa aa bli oppdaget.</p>" },
  { id:3, title:"Vikinghistorien paa Hornelen", excerpt:"Legenden om heksenes samlingssted.", category:"kultur", date:"2026-04-03", readTime:"5 min", icon:"&#127963;", content:"<p>I norroen mytologi var Hornelen kjent som et samlingssted for hekser.</p>" }
];

const defaultEvents = [
  { id:1, title:"Hornelen Opp", date:"2026-04-20", time:"09:00", category:"hiking", location:"Hunskaar", desc:"Aarlig motbakkeloep til toppen." },
  { id:2, title:"Bremanger Matfestival", date:"2026-05-01", time:"11:00", category:"festival", location:"Kalvaag", desc:"Lokal sjomat og livemusikk." },
  { id:3, title:"Fjordkajakk Workshop", date:"2026-05-15", time:"10:00", category:"sport", location:"Kalvaag havn", desc:"Padleteknikk med erfarne guider." },
  { id:4, title:"Kystkulturkveld", date:"2026-05-22", time:"18:00", category:"culture", location:"Bremanger Kyrkje", desc:"Foredrag og musikk om kystkultur." }
];

const defaultGallery = [
  { id:1, title:"Hornelen i solnedgang", type:"image", category:"natur", color:"#2a5298", icon:"&#127749;" },
  { id:2, title:"Vandring mot toppen", type:"image", category:"vandring", color:"#2d8a6e", icon:"&#9968;" },
  { id:3, title:"Bremangerfjorden", type:"image", category:"fjord", color:"#1a365d", icon:"&#127754;" },
  { id:4, title:"Flytur over Hornelen", type:"video", category:"natur", color:"#e74c3c", icon:"&#9658;" }
];

const defaultProducts = [
  { id:1, name:"Hornelen T-skjorte", price:349, category:"klaer", icon:"&#128085;", color:"#2a5298", desc:"Myk bomullsskjorte" },
  { id:2, name:"Fjordkaffe 250g", price:149, category:"mat", icon:"&#9749;", color:"#8B4513", desc:"Lokalbrent kaffe" },
  { id:3, name:"Hornelen Noekkelhenger", price:99, category:"suvenir", icon:"&#128273;", color:"#d4a843", desc:"Haandlaget i tre" },
  { id:4, name:"Turflasken Hornelen", price:299, category:"utstyr", icon:"&#129380;", color:"#1a365d", desc:"Isolert 750ml" }
];

// Data access helpers
function getData(key, defaults) {
  var stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaults;
}
function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Section navigation
function showSection(name) {
  document.querySelectorAll('.admin-section').forEach(function(s) { s.style.display = 'none'; });
  document.getElementById('sec-' + name).style.display = 'block';
  document.querySelectorAll('.admin-sidebar a').forEach(function(a) { a.classList.remove('active'); });
  event.target.classList.add('active');
  refreshSection(name);
}

function refreshSection(name) {
  switch(name) {
    case 'dashboard': renderDashboard(); break;
    case 'articles': renderArticlesTable(); break;
    case 'gallery': renderGalleryTable(); break;
    case 'events': renderEventsTable(); break;
    case 'bookings': renderBookingsTable(); break;
    case 'products': renderProductsTable(); break;
    case 'orders': renderOrdersTable(); break;
  }
}

// Modal helpers
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });
});

// Rich text editor
function execCmd(cmd, value) {
  document.execCommand(cmd, false, value || null);
}

// ===== DASHBOARD =====
function renderDashboard() {
  var articles = getData('vh_articles', defaultArticles);
  var events = getData('vh_events', defaultEvents);
  var bookings = getData('vh_bookings', []);
  var orders = getData('vh_orders', []);
  var gallery = getData('vh_gallery', defaultGallery);

  document.getElementById('stats').innerHTML =
    statCard(articles.length, 'Artikler') +
    statCard(gallery.length, 'Medier') +
    statCard(events.length, 'Arrangementer') +
    statCard(bookings.length, 'Bestillinger') +
    statCard(orders.length, 'Ordrer');

  var tbody = document.querySelector('#recent-bookings tbody');
  tbody.innerHTML = bookings.length === 0
    ? '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">Ingen bestillinger ennaa</td></tr>'
    : bookings.slice(-5).reverse().map(function(b) {
      return '<tr><td>' + b.name + '</td><td>' + b.experienceName + '</td><td>' + b.date + '</td><td>' + statusBadge(b.status) + '</td></tr>';
    }).join('');
}

function statCard(num, label) {
  return '<div class="stat-card"><div class="stat-number">' + num + '</div><div class="stat-label">' + label + '</div></div>';
}

function statusBadge(status) {
  var colors = { pending:'#f39c12', confirmed:'#27ae60', cancelled:'#e74c3c' };
  var labels = { pending:'Venter', confirmed:'Bekreftet', cancelled:'Avlyst' };
  return '<span style="background:' + (colors[status]||'#999') + '; color:#fff; padding:3px 10px; border-radius:12px; font-size:0.8rem;">' + (labels[status]||status) + '</span>';
}

// ===== ARTICLES =====
function renderArticlesTable() {
  var articles = getData('vh_articles', defaultArticles);
  var tbody = document.querySelector('#articles-table tbody');
  tbody.innerHTML = articles.map(function(a) {
    return '<tr><td>' + a.title + '</td><td><span class="tag">' + a.category + '</span></td><td>' + a.date + '</td>' +
      '<td><button class="btn btn-small btn-secondary" onclick="editArticle(' + a.id + ')">Rediger</button> ' +
      '<button class="btn btn-small btn-danger" onclick="deleteArticle(' + a.id + ')">Slett</button></td></tr>';
  }).join('');
}

function openArticleEditor(id) {
  document.getElementById('art-title').value = '';
  document.getElementById('art-category').value = 'vandring';
  document.getElementById('art-readtime').value = '';
  document.getElementById('art-content').innerHTML = '';
  document.getElementById('art-edit-id').value = '';
  document.getElementById('article-modal-title').textContent = 'Ny Artikkel';
  openModal('article-modal');
}

function editArticle(id) {
  var articles = getData('vh_articles', defaultArticles);
  var a = articles.find(function(x) { return x.id === id; });
  if (!a) return;
  document.getElementById('art-title').value = a.title;
  document.getElementById('art-category').value = a.category;
  document.getElementById('art-readtime').value = a.readTime || '';
  document.getElementById('art-content').innerHTML = a.content || a.excerpt;
  document.getElementById('art-edit-id').value = id;
  document.getElementById('article-modal-title').textContent = 'Rediger Artikkel';
  openModal('article-modal');
}

function saveArticle() {
  var title = document.getElementById('art-title').value.trim();
  if (!title) { alert('Tittel er paakrevd'); return; }
  var articles = getData('vh_articles', defaultArticles);
  var editId = document.getElementById('art-edit-id').value;
  var content = document.getElementById('art-content').innerHTML;
  var excerpt = content.replace(/<[^>]+>/g, '').substring(0, 120) + '...';

  if (editId) {
    var idx = articles.findIndex(function(a) { return a.id === parseInt(editId); });
    if (idx !== -1) {
      articles[idx].title = title;
      articles[idx].category = document.getElementById('art-category').value;
      articles[idx].readTime = document.getElementById('art-readtime').value;
      articles[idx].content = content;
      articles[idx].excerpt = excerpt;
    }
  } else {
    articles.push({
      id: Date.now(),
      title: title,
      category: document.getElementById('art-category').value,
      date: new Date().toISOString().split('T')[0],
      readTime: document.getElementById('art-readtime').value || '5 min',
      icon: '&#128196;',
      content: content,
      excerpt: excerpt
    });
  }
  setData('vh_articles', articles);
  closeModal('article-modal');
  renderArticlesTable();
}

function deleteArticle(id) {
  if (!confirm('Er du sikker paa at du vil slette denne artikkelen?')) return;
  var articles = getData('vh_articles', defaultArticles);
  articles = articles.filter(function(a) { return a.id !== id; });
  setData('vh_articles', articles);
  renderArticlesTable();
}

// ===== GALLERY =====
function renderGalleryTable() {
  var gallery = getData('vh_gallery', defaultGallery);
  var tbody = document.querySelector('#gallery-table tbody');
  tbody.innerHTML = gallery.map(function(g) {
    return '<tr><td>' + g.title + '</td><td>' + g.type + '</td><td>' + g.category + '</td>' +
      '<td><button class="btn btn-small btn-danger" onclick="deleteMedia(' + g.id + ')">Slett</button></td></tr>';
  }).join('');
}

function openMediaUpload() {
  document.getElementById('media-title').value = '';
  document.getElementById('media-type').value = 'image';
  document.getElementById('media-category').value = 'natur';
  openModal('media-modal');
}

function saveMedia() {
  var title = document.getElementById('media-title').value.trim();
  if (!title) { alert('Tittel er paakrevd'); return; }
  var gallery = getData('vh_gallery', defaultGallery);
  var type = document.getElementById('media-type').value;
  var colors = ['#2a5298','#2d8a6e','#d4a843','#e74c3c','#8e44ad','#f39c12'];
  gallery.push({
    id: Date.now(),
    title: title,
    type: type,
    category: document.getElementById('media-category').value,
    color: colors[Math.floor(Math.random() * colors.length)],
    icon: type === 'video' ? '&#9658;' : '&#127748;'
  });
  setData('vh_gallery', gallery);
  closeModal('media-modal');
  renderGalleryTable();
}

function deleteMedia(id) {
  if (!confirm('Slette dette mediet?')) return;
  var gallery = getData('vh_gallery', defaultGallery);
  gallery = gallery.filter(function(g) { return g.id !== id; });
  setData('vh_gallery', gallery);
  renderGalleryTable();
}

function handleFileUpload(input) {
  var preview = document.getElementById('upload-preview');
  preview.innerHTML = '';
  Array.from(input.files).forEach(function(file) {
    if (file.type.startsWith('image/')) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'upload-thumb';
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    } else {
      var div = document.createElement('div');
      div.className = 'upload-thumb';
      div.style.cssText = 'display:flex; align-items:center; justify-content:center; background:var(--bg-light); font-size:0.7rem; text-align:center; padding:4px;';
      div.textContent = file.name;
      preview.appendChild(div);
    }
  });
  // Open modal to add metadata
  openMediaUpload();
}

// ===== EVENTS =====
function renderEventsTable() {
  var events = getData('vh_events', defaultEvents);
  var tbody = document.querySelector('#events-table tbody');
  tbody.innerHTML = events.map(function(e) {
    return '<tr><td>' + e.title + '</td><td>' + e.date + '</td><td><span class="event-category ' + e.category + '">' + e.category + '</span></td><td>' + e.location + '</td>' +
      '<td><button class="btn btn-small btn-secondary" onclick="editEvent(' + e.id + ')">Rediger</button> ' +
      '<button class="btn btn-small btn-danger" onclick="deleteEvent(' + e.id + ')">Slett</button></td></tr>';
  }).join('');
}

function openEventEditor() {
  document.getElementById('evt-title').value = '';
  document.getElementById('evt-date').value = '';
  document.getElementById('evt-time').value = '';
  document.getElementById('evt-category').value = 'hiking';
  document.getElementById('evt-location').value = '';
  document.getElementById('evt-desc').value = '';
  document.getElementById('evt-edit-id').value = '';
  document.getElementById('event-modal-title').textContent = 'Nytt Arrangement';
  openModal('event-modal');
}

function editEvent(id) {
  var events = getData('vh_events', defaultEvents);
  var e = events.find(function(x) { return x.id === id; });
  if (!e) return;
  document.getElementById('evt-title').value = e.title;
  document.getElementById('evt-date').value = e.date;
  document.getElementById('evt-time').value = e.time;
  document.getElementById('evt-category').value = e.category;
  document.getElementById('evt-location').value = e.location;
  document.getElementById('evt-desc').value = e.desc;
  document.getElementById('evt-edit-id').value = id;
  document.getElementById('event-modal-title').textContent = 'Rediger Arrangement';
  openModal('event-modal');
}

function saveEvent() {
  var title = document.getElementById('evt-title').value.trim();
  if (!title) { alert('Tittel er paakrevd'); return; }
  var events = getData('vh_events', defaultEvents);
  var editId = document.getElementById('evt-edit-id').value;

  if (editId) {
    var idx = events.findIndex(function(e) { return e.id === parseInt(editId); });
    if (idx !== -1) {
      events[idx].title = title;
      events[idx].date = document.getElementById('evt-date').value;
      events[idx].time = document.getElementById('evt-time').value;
      events[idx].category = document.getElementById('evt-category').value;
      events[idx].location = document.getElementById('evt-location').value;
      events[idx].desc = document.getElementById('evt-desc').value;
    }
  } else {
    events.push({
      id: Date.now(),
      title: title,
      date: document.getElementById('evt-date').value,
      time: document.getElementById('evt-time').value,
      category: document.getElementById('evt-category').value,
      location: document.getElementById('evt-location').value,
      desc: document.getElementById('evt-desc').value
    });
  }
  setData('vh_events', events);
  closeModal('event-modal');
  renderEventsTable();
}

function deleteEvent(id) {
  if (!confirm('Slette dette arrangementet?')) return;
  var events = getData('vh_events', defaultEvents);
  events = events.filter(function(e) { return e.id !== id; });
  setData('vh_events', events);
  renderEventsTable();
}

// ===== BOOKINGS =====
function renderBookingsTable() {
  var bookings = getData('vh_bookings', []);
  var tbody = document.querySelector('#bookings-table tbody');
  tbody.innerHTML = bookings.length === 0
    ? '<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">Ingen bestillinger ennaa</td></tr>'
    : bookings.reverse().map(function(b) {
      return '<tr><td>' + b.name + '</td><td>' + b.email + '</td><td>' + b.experienceName + '</td><td>' + b.date + '</td><td>' + b.guests + '</td><td>kr ' + b.total.toLocaleString('no-NO') + ',-</td><td>' + statusBadge(b.status) + '</td>' +
        '<td><select onchange="updateBookingStatus(' + b.id + ', this.value)" style="padding:4px; border-radius:4px; border:1px solid var(--border);">' +
        '<option value="pending"' + (b.status==='pending'?' selected':'') + '>Venter</option>' +
        '<option value="confirmed"' + (b.status==='confirmed'?' selected':'') + '>Bekreftet</option>' +
        '<option value="cancelled"' + (b.status==='cancelled'?' selected':'') + '>Avlyst</option></select></td></tr>';
    }).join('');
}

function updateBookingStatus(id, status) {
  var bookings = getData('vh_bookings', []);
  var booking = bookings.find(function(b) { return b.id === id; });
  if (booking) { booking.status = status; setData('vh_bookings', bookings); renderBookingsTable(); }
}

// ===== PRODUCTS =====
function renderProductsTable() {
  var products = getData('vh_products', defaultProducts);
  var tbody = document.querySelector('#products-table tbody');
  tbody.innerHTML = products.map(function(p) {
    return '<tr><td>' + p.name + '</td><td>kr ' + p.price.toLocaleString('no-NO') + ',-</td><td><span class="tag">' + p.category + '</span></td>' +
      '<td><button class="btn btn-small btn-secondary" onclick="editProduct(' + p.id + ')">Rediger</button> ' +
      '<button class="btn btn-small btn-danger" onclick="deleteProduct(' + p.id + ')">Slett</button></td></tr>';
  }).join('');
}

function openProductEditor() {
  document.getElementById('prod-name').value = '';
  document.getElementById('prod-price').value = '';
  document.getElementById('prod-category').value = 'suvenir';
  document.getElementById('prod-desc').value = '';
  document.getElementById('prod-edit-id').value = '';
  document.getElementById('product-modal-title').textContent = 'Nytt Produkt';
  openModal('product-modal');
}

function editProduct(id) {
  var products = getData('vh_products', defaultProducts);
  var p = products.find(function(x) { return x.id === id; });
  if (!p) return;
  document.getElementById('prod-name').value = p.name;
  document.getElementById('prod-price').value = p.price;
  document.getElementById('prod-category').value = p.category;
  document.getElementById('prod-desc').value = p.desc;
  document.getElementById('prod-edit-id').value = id;
  document.getElementById('product-modal-title').textContent = 'Rediger Produkt';
  openModal('product-modal');
}

function saveProduct() {
  var name = document.getElementById('prod-name').value.trim();
  var price = parseInt(document.getElementById('prod-price').value);
  if (!name || !price) { alert('Navn og pris er paakrevd'); return; }
  var products = getData('vh_products', defaultProducts);
  var editId = document.getElementById('prod-edit-id').value;
  var icons = ['&#128085;','&#9749;','&#128273;','&#129380;','&#127843;','&#127855;'];

  if (editId) {
    var idx = products.findIndex(function(p) { return p.id === parseInt(editId); });
    if (idx !== -1) {
      products[idx].name = name;
      products[idx].price = price;
      products[idx].category = document.getElementById('prod-category').value;
      products[idx].desc = document.getElementById('prod-desc').value;
    }
  } else {
    var colors = ['#2a5298','#2d8a6e','#d4a843','#e74c3c','#8e44ad'];
    products.push({
      id: Date.now(),
      name: name,
      price: price,
      category: document.getElementById('prod-category').value,
      desc: document.getElementById('prod-desc').value,
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  setData('vh_products', products);
  closeModal('product-modal');
  renderProductsTable();
}

function deleteProduct(id) {
  if (!confirm('Slette dette produktet?')) return;
  var products = getData('vh_products', defaultProducts);
  products = products.filter(function(p) { return p.id !== id; });
  setData('vh_products', products);
  renderProductsTable();
}

// ===== ORDERS =====
function renderOrdersTable() {
  var orders = getData('vh_orders', []);
  var tbody = document.querySelector('#orders-table tbody');
  tbody.innerHTML = orders.length === 0
    ? '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Ingen ordrer ennaa</td></tr>'
    : orders.reverse().map(function(o) {
      var itemNames = o.items.map(function(i) { return i.name + ' x' + i.qty; }).join(', ');
      return '<tr><td>#' + o.id + '</td><td>' + new Date(o.date).toLocaleDateString('no-NO') + '</td><td>' + itemNames + '</td><td>kr ' + o.total.toLocaleString('no-NO') + ',-</td><td>' + statusBadge(o.status) + '</td></tr>';
    }).join('');
}

// Init dashboard on load
document.addEventListener('DOMContentLoaded', function() {
  renderDashboard();
});
