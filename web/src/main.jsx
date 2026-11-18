import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapPin, CalendarDays, Users, ShoppingBag, Search, Leaf, ArrowRight, Minus, Plus, X, CheckCircle2, Menu, LogIn, UserPlus, Waves, TreePine, Compass } from 'lucide-react';
import './styles.css';

const money = n => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const API = '/api';
function App() {
  const [tours, setTours] = useState([]);
  const [city, setCity] = useState('Todos');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('viva-cart') || '[]'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('viva-user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('viva-token') || '');
  const [modal, setModal] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { fetch(`${API}/tours`).then(r => r.json()).then(setTours).catch(() => setNotice('Não foi possível conectar à API.')); }, []);
  useEffect(() => { localStorage.setItem('viva-cart', JSON.stringify(cart)); }, [cart]);
  const count = cart.reduce((s, x) => s + x.quantity, 0);
  const total = cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const filtered = useMemo(() => tours.filter(t => (city === 'Todos' || t.city === city) && `${t.name} ${t.description} ${t.category}`.toLowerCase().includes(query.toLowerCase())), [tours, city, query]);

  const add = tour => {
    if (!tour.availableSpots) return setNotice('Este passeio está sem vagas.');
    setCart(old => {
      const found = old.find(x => x.id === tour._id);
      if (found) return old.map(x => x.id === tour._id ? { ...x, quantity: Math.min(x.quantity + 1, tour.availableSpots) } : x);
      return [...old, { id: tour._id, name: tour.name, city: tour.city, date: tour.date, price: tour.price, quantity: 1, availableSpots: tour.availableSpots, image: tour.image }];
    });
    setNotice('Passeio adicionado ao carrinho.');
  };
  const changeQty = (id, delta) => setCart(old => old.map(x => x.id === id ? { ...x, quantity: Math.max(1, Math.min(x.availableSpots, x.quantity + delta)) } : x));
  const remove = id => setCart(old => old.filter(x => x.id !== id));
  const auth = async e => {
    e.preventDefault(); setBusy(true);
    try {
      const res = await fetch(`${API}/auth/${modal === 'register' ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message);
      setToken(data.token); setUser(data.user); localStorage.setItem('viva-token', data.token); localStorage.setItem('viva-user', JSON.stringify(data.user)); setModal(''); setNotice(`Bem-vinda(o), ${data.user.name}!`);
    } catch (err) { setNotice(err.message); } finally { setBusy(false); }
  };
  const checkout = async () => {
    if (!token) { setModal('login'); return; }
    if (!cart.length) return;
    setBusy(true);
    try {
      const res = await fetch(`${API}/bookings/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ items: cart.map(x => ({ tourId: x.id, quantity: x.quantity })) }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message);
      setCart([]); setModal('success'); setTours(await fetch(`${API}/tours`).then(r => r.json()));
    } catch (err) { setNotice(err.message); } finally { setBusy(false); }
  };
  const logout = () => { setToken(''); setUser(null); localStorage.removeItem('viva-token'); localStorage.removeItem('viva-user'); setNotice('Você saiu da sua conta.'); };

  return <div className="app">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark"><Leaf size={21}/></span><span>viva<span className="brand-light">amazônia</span></span></a>
      <nav className={menuOpen ? 'nav open' : 'nav'}><a href="#passeios" onClick={() => setMenuOpen(false)}>Explorar passeios</a><a href="#destinos" onClick={() => setMenuOpen(false)}>Destinos</a><a href="/api-docs" target="_blank">API</a></nav>
      <div className="header-actions"><button className="cart-button" onClick={() => setModal('cart')}><ShoppingBag size={18}/><span>Carrinho</span>{count > 0 && <b>{count}</b>}</button>{user ? <button className="user-pill" onClick={logout}>{user.name.split(' ')[0]} · Sair</button> : <button className="login-link" onClick={() => setModal('login')}>Entrar</button>}<button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><Menu/></button></div>
    </header>

    <main>
      <section className="hero"><div className="hero-overlay"></div><div className="hero-content"><div className="eyebrow"><span></span> DESCUBRA O AMAZONAS</div><h1>O extraordinário<br/>está <em>mais perto.</em></h1><p>Encontre experiências únicas, explore paisagens incríveis e viva a Amazônia do seu jeito.</p><a className="primary-cta" href="#passeios">Encontrar meu passeio <ArrowRight size={18}/></a><div className="hero-foot"><span><Waves size={16}/> Rios e águas</span><span><TreePine size={16}/> Floresta viva</span><span><Compass size={16}/> Cultura local</span></div></div><div className="hero-note">AMAZONAS, BRASIL <span>·</span> 03°S 60°W</div></section>

      <section className="intro" id="destinos"><div><div className="section-kicker">SUA PRÓXIMA HISTÓRIA COMEÇA AQUI</div><h2>Mais que um destino.<br/><em>Uma experiência.</em></h2></div><p>Dos rios que se encontram às cachoeiras escondidas na floresta, reunimos experiências autênticas para você descobrir o melhor do Amazonas.</p></section>

      <section className="catalog" id="passeios"><div className="catalog-heading"><div><div className="section-kicker">ESCOLHA SUA AVENTURA</div><h2>Passeios em destaque<span>.</span></h2></div><div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="O que você quer conhecer?"/></div></div>
        <div className="filters"><button className={city === 'Todos' ? 'filter active' : 'filter'} onClick={() => setCity('Todos')}>Todos os destinos</button><button className={city === 'Manaus' ? 'filter active' : 'filter'} onClick={() => setCity('Manaus')}>Manaus</button><button className={city === 'Presidente Figueiredo' ? 'filter active' : 'filter'} onClick={() => setCity('Presidente Figueiredo')}>Presidente Figueiredo</button></div>
        <div className="tour-grid">{filtered.map(t => <article className="tour-card" key={t._id}><div className="tour-image" style={{backgroundImage:`url(${t.image})`}}>{t.originalPrice > t.price && <span className="discount">OFERTA ESPECIAL</span>}<span className="city-tag">{t.city}</span></div><div className="tour-info"><div className="tour-category">{t.category}</div><h3>{t.name}</h3><p>{t.description}</p><div className="tour-meta"><span><MapPin size={14}/>{t.location}</span><span><CalendarDays size={14}/>{new Date(t.date).toLocaleDateString('pt-BR')}</span><span><Users size={14}/>{t.availableSpots} vagas</span></div><div className="tour-bottom"><div className="price">{t.originalPrice > t.price && <del>{money(t.originalPrice)}</del>}<strong>{money(t.price)}</strong><small>/ pessoa</small></div><button className="add-button" disabled={!t.availableSpots} onClick={() => add(t)}>{t.availableSpots ? 'Reservar' : 'Esgotado'} <ArrowRight size={16}/></button></div></div></article>)}</div>
        {!filtered.length && <div className="empty">Nenhum passeio encontrado com esses filtros.</div>}
      </section>
      <section className="bottom-banner"><div><div className="section-kicker">A AMAZÔNIA TE ESPERA</div><h2>Seu próximo capítulo<br/><em>é por aqui.</em></h2></div><a href="#passeios" className="banner-link">Explorar experiências <ArrowRight size={18}/></a></section>
    </main>
    <footer><a className="brand" href="#"><span className="brand-mark"><Leaf size={18}/></span><span>viva<span className="brand-light">amazônia</span></span></a><span>Feito para descobrir. Feito no Amazonas. © 2026</span><a href="/api-docs" target="_blank">Documentação da API</a></footer>

    {notice && <div className="toast" onClick={() => setNotice('')}>{notice}<X size={15}/></div>}
    {modal && <div className="modal-backdrop" onClick={() => setModal('')}><div className={`modal ${modal === 'cart' ? 'cart-modal' : ''}`} onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setModal('')}><X/></button>
      {modal === 'cart' && <><div className="section-kicker">SUA PRÓXIMA AVENTURA</div><h2>Seu carrinho<span>.</span></h2>{!cart.length ? <div className="empty cart-empty">Seu carrinho está vazio. Que tal explorar os passeios?</div> : <><div className="cart-list">{cart.map(x => <div className="cart-item" key={x.id}><div className="cart-thumb" style={{backgroundImage:`url(${x.image})`}}/><div className="cart-detail"><strong>{x.name}</strong><small>{x.city} · {money(x.price)} por pessoa</small><div className="qty"><button onClick={() => changeQty(x.id,-1)}><Minus size={13}/></button><b>{x.quantity}</b><button onClick={() => changeQty(x.id,1)} disabled={x.quantity >= x.availableSpots}><Plus size={13}/></button><button className="remove" onClick={() => remove(x.id)}>Remover</button></div></div><b className="line-total">{money(x.price*x.quantity)}</b></div>)}</div><div className="cart-total"><span>Total estimado</span><strong>{money(total)}</strong></div><button className="checkout-button" disabled={busy} onClick={checkout}>{busy ? 'Processando...' : 'Finalizar reserva'} <ArrowRight size={18}/></button><small className="fine-print">Disponibilidade será validada novamente na confirmação.</small></>}</>}
      {(modal === 'login' || modal === 'register') && <><div className="section-kicker">{modal === 'login' ? 'BEM-VINDA(O) DE VOLTA' : 'COMECE SUA JORNADA'}</div><h2>{modal === 'login' ? 'Entrar na conta' : 'Criar conta'}<span>.</span></h2><form className="auth-form" onSubmit={auth}>{modal === 'register' && <label>Nome completo<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Seu nome"/></label>}<label>E-mail<input required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="voce@email.com"/></label><label>Senha<input required minLength="6" type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="Mínimo 6 caracteres"/></label><button className="checkout-button" disabled={busy}>{busy ? 'Aguarde...' : modal === 'login' ? 'Entrar' : 'Criar minha conta'} <ArrowRight size={18}/></button></form><p className="switch-auth">{modal === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'} <button onClick={() => setModal(modal === 'login' ? 'register' : 'login')}>{modal === 'login' ? 'Cadastre-se' : 'Entrar'}</button></p></>}
      {modal === 'success' && <div className="success-state"><CheckCircle2 size={48}/><div className="section-kicker">TUDO CERTO!</div><h2>Reserva confirmada<span>.</span></h2><p>Sua aventura amazônica está mais perto. Você pode consultar suas reservas com seu usuário.</p><button className="checkout-button" onClick={() => setModal('')}>Continuar explorando</button></div>}
    </div></div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);