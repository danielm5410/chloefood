import React from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { cuisines, foods } from './data/foods.js';
import { getOrders, useCart } from './state/CartContext.jsx';

const money = (amount) => `$${amount.toFixed(2)}`;

const fakeCards = [
  { id: 'visa-4242', label: 'Visa', last4: '4242', expiry: '04/29' },
  { id: 'mastercard-1881', label: 'Mastercard', last4: '1881', expiry: '11/30' },
  { id: 'amex-0005', label: 'Amex', last4: '0005', expiry: '08/28' },
  { id: 'discover-7777', label: 'Discover', last4: '7777', expiry: '02/31' },
];

const defaultAddress = {
  street: '123 Cozy Snack Lane',
  apartment: 'Couch suite',
  city: 'Snacktown',
  state: 'NY',
  zip: '10001',
  instructions: 'Leave at the door',
};

function Layout() {
  const { count, total } = useCart();
  const location = useLocation();
  const nav = [
    ['/', 'Home'],
    ['/menu', 'Menu'],
    ['/cart', 'Cart'],
    ['/history', 'History'],
  ];

  return (
    <div className="min-h-screen bg-[#fff8ef] pb-24 text-[#331b10] md:pb-0">
      <header className="sticky top-0 z-40 border-b border-orange-100 bg-[#fff8ef]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-black tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ff6f61] text-sm font-black text-white shadow-soft">CF</span>
            <span className="leading-tight">Chloe's<br className="sm:hidden" /> Feast</span>
          </Link>
          <div className="hidden items-center gap-2 rounded-full bg-white p-1 shadow-sm md:flex">
            {nav.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-bold tap ${isActive ? 'bg-[#331b10] text-white' : 'hover:bg-orange-50'}`}>
                {label}
              </NavLink>
            ))}
          </div>
          <Link to="/cart" className="tap rounded-full bg-[#ff6f61] px-4 py-2 text-sm font-black text-white shadow-soft">
            {count} items - {money(total)}
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-5 md:py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      {location.pathname !== '/cart' && count > 0 && (
        <Link to="/cart" className="fixed inset-x-4 bottom-4 z-50 flex items-center justify-between rounded-3xl bg-[#331b10] px-5 py-4 font-black text-white shadow-soft md:hidden">
          <span>View cart</span>
          <span>{count} - {money(total)}</span>
        </Link>
      )}
    </div>
  );
}

const artColors = [
  ['#ffcf7a', '#ff7f50'],
  ['#f7a8a8', '#d94949'],
  ['#a8e6cf', '#4ba985'],
  ['#ffd1dc', '#f1789a'],
  ['#c7d2fe', '#7c83f2'],
  ['#ffe082', '#b7791f'],
];

function FoodVisual({ food, className = '', index = 0 }) {
  const [from, to] = artColors[index % artColors.length];
  return (
    <div className={`food-art grid place-items-center overflow-hidden bg-[#ffe8d6] ${className}`} style={{ '--from': from, '--to': to }}>
      <span className="drop-shadow-md">{food.visual}</span>
    </div>
  );
}

function Home() {
  const featured = foods.find((food) => food.id === 'rose-tteokbokki');
  const popular = foods.filter((food) => food.popular).slice(0, 8);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 overflow-hidden rounded-[2rem] bg-[#ffe8d6] p-5 shadow-soft md:grid-cols-[1.05fr_.95fr] md:p-8">
        <div className="flex min-h-[340px] flex-col justify-center gap-5">
          <div className="w-fit rounded-full bg-white px-4 py-2 text-sm font-black text-[#b63f2c]">Comfort food - cozy checkout</div>
          <div>
            <h1 className="max-w-xl text-4xl font-black leading-tight md:text-6xl">Cute comfort food for every craving.</h1>
            <p className="mt-4 max-w-xl text-base font-semibold text-[#6f4a36] md:text-lg">Browse warm Korean favorites, add your cravings to the cart, and enjoy a polished checkout flow made just for Chloe.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/menu" className="tap rounded-full bg-[#ff6f61] px-6 py-3 font-black text-white shadow-soft">Browse menu</Link>
            <Link to="/history" className="tap rounded-full bg-white px-6 py-3 font-black shadow-sm">Order history</Link>
          </div>
        </div>
        <div className="grid gap-3">
          <FoodVisual food={featured} className="aspect-[4/3] rounded-[2rem] text-7xl shadow-soft md:text-8xl" />
          <div className="grid grid-cols-3 gap-3">
            {['Korean-first', 'Cozy picks', 'Fast checkout'].map((label) => <div key={label} className="rounded-3xl bg-white p-3 text-center text-sm font-black shadow-sm">{label}</div>)}
          </div>
        </div>
      </section>
      <SectionTitle title="Featured Craving" action="Rose tteokbokki spotlight" />
      <FoodFeature food={featured} />
      <SectionTitle title="Popular Foods" action="Tap anything delicious" />
      <FoodGrid foods={popular} />
      <SectionTitle title="Cuisine Tabs" action="Jump into a mood" />
      <CuisineTabs />
    </div>
  );
}

function SectionTitle({ title, action }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-sm font-black uppercase tracking-widest text-[#ff6f61]">{action}</p>
        <h2 className="text-2xl font-black md:text-3xl">{title}</h2>
      </div>
    </div>
  );
}

function FoodFeature({ food }) {
  const { addItem } = useCart();
  return (
    <article className="grid gap-4 rounded-[2rem] bg-white p-4 shadow-soft md:grid-cols-[320px_1fr] md:p-5">
      <FoodVisual food={food} className="aspect-[4/3] rounded-[2rem] text-7xl md:text-8xl" index={1} />
      <div className="flex flex-col justify-center gap-3">
        <div className="flex flex-wrap gap-2">
          <Pill>{food.cuisine}</Pill><Pill>{food.spice} spice</Pill><Pill>{food.craving}</Pill>
        </div>
        <h3 className="text-3xl font-black">{food.name}</h3>
        <p className="max-w-2xl font-semibold text-[#76533f]">{food.desc}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl font-black">{money(food.price)}</span>
          <button onClick={() => addItem(food)} className="tap rounded-full bg-[#331b10] px-5 py-3 font-black text-white">Add to Cart</button>
        </div>
      </div>
    </article>
  );
}

function CuisineTabs({ active = 'Popular', onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {cuisines.map((cuisine) => {
        const activeClass = active === cuisine ? 'bg-[#331b10] text-white' : 'bg-white hover:bg-orange-50';
        return onChange ? (
          <button key={cuisine} onClick={() => onChange(cuisine)} className={`tap shrink-0 rounded-full px-4 py-2 text-sm font-black shadow-sm ${activeClass}`}>{cuisine}</button>
        ) : (
          <Link key={cuisine} to={`/menu?cuisine=${cuisine}`} className={`tap shrink-0 rounded-full px-4 py-2 text-sm font-black shadow-sm ${activeClass}`}>{cuisine}</Link>
        );
      })}
    </div>
  );
}

function Menu() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const active = params.get('cuisine') || 'Popular';
  const visible = useMemo(() => foods.filter((food) => {
    const cuisineMatch = active === 'Popular' ? food.popular : food.cuisine === active;
    return cuisineMatch && food.name.toLowerCase().includes(search.toLowerCase());
  }), [active, search]);

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] bg-white p-4 shadow-soft md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-[#ff6f61]">Comfort picks for tonight</p>
            <h1 className="text-3xl font-black md:text-5xl">Menu</h1>
          </div>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search food names" className="w-full rounded-2xl border border-orange-100 bg-[#fff8ef] px-4 py-3 font-bold outline-none ring-[#ffb199] focus:ring-4 md:max-w-sm" />
        </div>
        <div className="mt-5">
          <CuisineTabs active={active} onChange={(cuisine) => setParams({ cuisine })} />
        </div>
      </div>
      <FoodGrid foods={visible} empty="No foods matched that search." />
    </div>
  );
}

function FoodGrid({ foods: list, empty }) {
  if (!list.length) return <div className="rounded-[2rem] bg-white p-8 text-center font-black shadow-soft">{empty}</div>;
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((food, index) => <FoodCard key={food.id} food={food} index={index} />)}</div>;
}

function FoodCard({ food, index }) {
  const { addItem } = useCart();
  return (
    <article className="tap overflow-hidden rounded-[2rem] bg-white shadow-sm hover:-translate-y-1 hover:shadow-soft">
      <FoodVisual food={food} className="h-40 text-6xl" index={index} />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black leading-tight">{food.name}</h3>
            <p className="text-sm font-bold text-[#8a6046]">{food.cuisine} - {food.spice}</p>
          </div>
          <span className="font-black">{money(food.price)}</span>
        </div>
        <p className="min-h-12 text-sm font-semibold text-[#76533f]">{food.desc}</p>
        <div className="flex items-center justify-between gap-2">
          <Pill>{food.craving}</Pill>
          <button onClick={() => addItem(food)} className="tap rounded-full bg-[#ff6f61] px-4 py-2 text-sm font-black text-white">Add</button>
        </div>
      </div>
    </article>
  );
}

function Pill({ children }) {
  return <span className="rounded-full bg-[#fff0e0] px-3 py-1 text-xs font-black text-[#9d3d2d]">{children}</span>;
}

function Cart() {
  const cart = useCart();
  const navigate = useNavigate();
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="rounded-[2rem] bg-white p-4 shadow-soft md:p-6">
        <h1 className="text-3xl font-black">Cart</h1>
        <p className="mt-1 font-semibold text-[#76533f]">Review your picks before checkout.</p>
        <div className="mt-5 space-y-3">
          {cart.items.length === 0 ? <EmptyCart /> : cart.items.map((item) => <CartRow key={item.id} item={item} />)}
        </div>
      </section>
      <Summary title="Order Summary" button="Continue to checkout" onClick={() => navigate('/checkout')} disabled={!cart.items.length} />
    </div>
  );
}

function EmptyCart() {
  return <div className="rounded-3xl bg-[#fff8ef] p-8 text-center"><p className="text-xl font-black">Your cart is beautifully empty.</p><Link to="/menu" className="mt-4 inline-block rounded-full bg-[#331b10] px-5 py-3 font-black text-white">Find food</Link></div>;
}

function CartRow({ item }) {
  const { setQuantity, removeItem } = useCart();
  return (
    <div className="grid grid-cols-[72px_1fr] gap-3 rounded-3xl bg-[#fff8ef] p-3 md:grid-cols-[84px_1fr_auto] md:items-center">
      <FoodVisual food={item} className="h-[72px] w-[72px] aspect-square rounded-2xl text-3xl md:h-20 md:w-20" />
      <div>
        <h3 className="font-black">{item.name}</h3>
        <p className="text-sm font-bold text-[#8a6046]">{money(item.price)} - {item.cuisine}</p>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-2 md:col-span-1">
        <div className="flex items-center rounded-full bg-white p-1">
          <button onClick={() => setQuantity(item.id, item.quantity - 1)} className="tap h-9 w-9 rounded-full font-black">-</button>
          <span className="w-8 text-center font-black">{item.quantity}</span>
          <button onClick={() => setQuantity(item.id, item.quantity + 1)} className="tap h-9 w-9 rounded-full font-black">+</button>
        </div>
        <button onClick={() => removeItem(item.id)} className="tap rounded-full bg-[#331b10] px-4 py-2 text-sm font-black text-white">Remove</button>
      </div>
    </div>
  );
}

function Summary({ title, button, onClick, disabled }) {
  const { subtotal, tax, delivery, total } = useCart();
  return (
    <aside className="h-fit rounded-[2rem] bg-white p-5 shadow-soft">
      <h2 className="text-2xl font-black">{title}</h2>
      <PriceLine label="Subtotal" value={subtotal} />
      <PriceLine label="Estimated tax" value={tax} />
      <PriceLine label="Delivery fee" value={delivery} />
      <div className="mt-3 border-t border-orange-100 pt-3"><PriceLine label="Total" value={total} bold /></div>
      <button disabled={disabled} onClick={onClick} className="tap mt-5 w-full rounded-full bg-[#ff6f61] px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-stone-300">{button}</button>
    </aside>
  );
}

function PriceLine({ label, value, bold }) {
  return <div className={`flex justify-between py-1 ${bold ? 'text-xl font-black' : 'font-bold text-[#76533f]'}`}><span>{label}</span><span>{money(value)}</span></div>;
}

function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState(fakeCards[0].id);
  const [cardName, setCardName] = useState('Chloe Main Character');
  const [address, setAddress] = useState(defaultAddress);
  const selectedCard = fakeCards.find((card) => card.id === selectedCardId) || fakeCards[0];
  const updateAddress = (field, value) => setAddress((current) => ({ ...current, [field]: value }));
  const placeOrder = () => {
    if (!cart.items.length) return navigate('/menu');
    const order = cart.saveOrder({
      payment: {
        brand: selectedCard.label,
        last4: selectedCard.last4,
        expiry: selectedCard.expiry,
        name: cardName.trim() || 'Guest',
        amount: cart.total,
      },
      address,
    });
    navigate('/success', { state: { order } });
  };
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4 rounded-[2rem] bg-white p-4 shadow-soft md:p-6">
        <div>
          <h1 className="text-3xl font-black">Checkout</h1>
          <p className="mt-2 rounded-2xl bg-[#331b10] px-4 py-3 font-black text-white">Personal app preview. No real payment is processed.</p>
        </div>
        <section className="rounded-3xl bg-[#fff8ef] p-4">
          <h2 className="mb-3 text-xl font-black">Payment</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {fakeCards.map((card) => {
              const active = selectedCardId === card.id;
              return (
                <button key={card.id} type="button" onClick={() => setSelectedCardId(card.id)} className={`tap rounded-2xl border p-4 text-left ${active ? 'border-[#331b10] bg-[#331b10] text-white' : 'border-orange-100 bg-white'}`}>
                  <span className="block text-sm font-black uppercase">{card.label}</span>
                  <span className="mt-2 block text-lg font-black">Ending in {card.last4}</span>
                  <span className={`mt-1 block text-sm font-bold ${active ? 'text-white/80' : 'text-[#76533f]'}`}>Exp {card.expiry}</span>
                </button>
              );
            })}
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-black text-[#76533f]">Name on card</span>
            <input value={cardName} onChange={(event) => setCardName(event.target.value)} className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 font-bold outline-none ring-[#ffb199] focus:ring-4" />
          </label>
          <div className="mt-4 rounded-2xl bg-white px-4 py-3 font-black">
            Amount due today: {money(cart.total)}
          </div>
        </section>
        <section className="rounded-3xl bg-[#fff8ef] p-4">
          <h2 className="mb-3 text-xl font-black">Delivery Address</h2>
          <div className="grid gap-3">
            <input value={address.street} onChange={(event) => updateAddress('street', event.target.value)} placeholder="Street address" className="rounded-2xl border border-orange-100 bg-white px-4 py-3 font-bold outline-none ring-[#ffb199] focus:ring-4" />
            <input value={address.apartment} onChange={(event) => updateAddress('apartment', event.target.value)} placeholder="Apartment, suite, etc." className="rounded-2xl border border-orange-100 bg-white px-4 py-3 font-bold outline-none ring-[#ffb199] focus:ring-4" />
            <div className="grid gap-3 sm:grid-cols-[1fr_96px_120px]">
              <input value={address.city} onChange={(event) => updateAddress('city', event.target.value)} placeholder="City" className="rounded-2xl border border-orange-100 bg-white px-4 py-3 font-bold outline-none ring-[#ffb199] focus:ring-4" />
              <input value={address.state} onChange={(event) => updateAddress('state', event.target.value.toUpperCase().slice(0, 2))} placeholder="State" className="rounded-2xl border border-orange-100 bg-white px-4 py-3 font-bold outline-none ring-[#ffb199] focus:ring-4" />
              <input value={address.zip} onChange={(event) => updateAddress('zip', event.target.value)} placeholder="ZIP" className="rounded-2xl border border-orange-100 bg-white px-4 py-3 font-bold outline-none ring-[#ffb199] focus:ring-4" />
            </div>
            <textarea value={address.instructions} onChange={(event) => updateAddress('instructions', event.target.value)} placeholder="Delivery instructions" rows="3" className="resize-none rounded-2xl border border-orange-100 bg-white px-4 py-3 font-bold outline-none ring-[#ffb199] focus:ring-4" />
          </div>
        </section>
        <CheckoutBox title="ETA" rows={['Kitchen is preparing your order', 'Estimated arrival: 25-35 min']} />
      </section>
      <Summary title="Final Total" button="Place Order" onClick={placeOrder} disabled={!cart.items.length} />
    </div>
  );
}

function CheckoutBox({ title, rows }) {
  return <div className="rounded-3xl bg-[#fff8ef] p-4"><h2 className="mb-3 text-xl font-black">{title}</h2>{rows.map((row) => <p key={row} className="py-1 font-bold text-[#76533f]">{row}</p>)}</div>;
}

function DeliveryMap({ order }) {
  const cityLine = order.address?.city ? `${order.address.city}, ${order.address.state} ${order.address.zip}` : 'Home';
  const route = [
    { label: 'Store', icon: '🏪', x: '14%', y: '68%' },
    { label: 'Driver', icon: '🚗', x: '57%', y: '42%' },
    { label: cityLine, icon: '🏠', x: '84%', y: '22%' },
  ];

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Driver on the Way</h2>
          <p className="mt-1 font-bold text-[#76533f]">Arriving in {order.eta}</p>
        </div>
        <Pill>Live preview</Pill>
      </div>
      <div className="relative mt-5 h-72 overflow-hidden rounded-[2rem] bg-[#e7f4df]">
        <div className="absolute inset-x-0 top-10 h-5 rotate-[-9deg] bg-white/80" />
        <div className="absolute inset-y-0 left-20 w-5 rotate-[19deg] bg-white/70" />
        <div className="absolute inset-x-10 bottom-16 h-5 rotate-[7deg] bg-white/80" />
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,.45) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.45) 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 14 68 C 30 62, 36 44, 55 43 S 74 31, 84 22" fill="none" stroke="#331b10" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 5" />
          <path d="M 14 68 C 30 62, 36 44, 55 43" fill="none" stroke="#ff6f61" strokeWidth="3.8" strokeLinecap="round" />
        </svg>
        {route.map((pin) => (
          <div key={pin.label} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: pin.x, top: pin.y }}>
            <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full border-4 border-white text-2xl shadow-soft ${pin.label === 'Driver' ? 'bg-[#ff6f61]' : 'bg-[#331b10]'}`}>{pin.icon}</div>
            <div className="mt-2 max-w-28 rounded-full bg-white px-3 py-1 text-xs font-black shadow-sm">{pin.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {['Store confirmed', 'Driver en route', 'Home next'].map((label, index) => (
          <div key={label} className={`rounded-2xl p-3 text-center text-xs font-black ${index === 1 ? 'bg-[#331b10] text-white' : 'bg-[#fff8ef] text-[#76533f]'}`}>{label}</div>
        ))}
      </div>
    </div>
  );
}

function Success() {
  const location = useLocation();
  const latest = getOrders()[0];
  const order = location.state?.order || latest;
  if (!order) return <EmptyCart />;
  const statuses = ['Order received', 'Store is preparing your food', 'Driver picked it up', 'Driver is on the way', 'Arriving at home'];
  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-[#ffe8d6] p-5 text-center shadow-soft md:p-8">
        <h1 className="mt-3 text-4xl font-black">Order confirmed</h1>
        <p className="mt-2 text-xl font-black text-[#9d3d2d]">Your comfort food is on the way.</p>
        <p className="mt-3 font-bold text-[#76533f]">Order {order.id} - ETA {order.eta}</p>
        <div className="mx-auto mt-5 max-w-md rounded-3xl bg-white p-4 shadow-sm">
          <p className="text-sm font-black uppercase tracking-widest text-[#ff6f61]">Order total</p>
          <p className="text-4xl font-black">{money(order.total)}</p>
        </div>
      </section>
      <DeliveryMap order={order} />
      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] bg-white p-5 shadow-soft">
          <h2 className="text-2xl font-black">Delivery Progress</h2>
          <div className="mt-5 space-y-4">
            {statuses.map((status, index) => <div key={status} className="flex gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ff6f61] text-sm font-black text-white">{index + 1}</div><p className="pt-1 font-black">{status}</p></div>)}
          </div>
        </div>
        <OrderCard order={order} />
      </section>
    </div>
  );
}

function History() {
  const orders = getOrders();
  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] bg-white p-5 shadow-soft">
        <h1 className="text-3xl font-black">Order History</h1>
        <p className="mt-1 font-semibold text-[#76533f]">Saved locally in this browser.</p>
      </div>
      {orders.length === 0 ? <EmptyCart /> : <div className="grid gap-4 md:grid-cols-2">{orders.map((order) => <OrderCard key={order.id} order={order} />)}</div>}
    </div>
  );
}

function OrderCard({ order }) {
  const payment = order.payment;
  const address = order.address;
  return (
    <article className="rounded-[2rem] bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black">{order.id}</h3>
          <p className="text-sm font-bold text-[#8a6046]">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <Pill>{money(order.total)}</Pill>
      </div>
      <div className="my-4 space-y-2">
        {order.items.map((item) => <div key={item.id} className="flex justify-between gap-3 rounded-2xl bg-[#fff8ef] px-3 py-2 font-bold"><span>{item.quantity}x {item.name}</span><span>{money(item.price * item.quantity)}</span></div>)}
      </div>
      {(payment || address) && (
        <div className="my-4 grid gap-3">
          {payment && (
            <div className="rounded-2xl bg-[#fff8ef] px-3 py-3">
              <p className="text-sm font-black uppercase text-[#ff6f61]">Payment</p>
              <p className="font-bold text-[#76533f]">{payment.brand} ending in {payment.last4} - {payment.name}</p>
              <p className="font-black">Charged {money(payment.amount)}</p>
            </div>
          )}
          {address && (
            <div className="rounded-2xl bg-[#fff8ef] px-3 py-3">
              <p className="text-sm font-black uppercase text-[#ff6f61]">Delivery</p>
              <p className="font-bold text-[#76533f]">{address.street}{address.apartment ? `, ${address.apartment}` : ''}</p>
              <p className="font-bold text-[#76533f]">{address.city}, {address.state} {address.zip}</p>
              {address.instructions && <p className="mt-1 font-black">{address.instructions}</p>}
            </div>
          )}
        </div>
      )}
      <PriceLine label="Total" value={order.total} bold />
    </article>
  );
}

export default function App() {
  return <Layout />;
}
