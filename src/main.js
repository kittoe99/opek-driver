import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  document.querySelector('#app').innerHTML = `
    <div class="flex flex-col h-dvh items-center justify-center bg-gray-50 px-6">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h2 class="text-lg font-bold text-gray-800 mb-1">Configuration Required</h2>
      <p class="text-sm text-gray-500 text-center">Set <code class="bg-gray-200 px-1 rounded">VITE_SUPABASE_URL</code> and <code class="bg-gray-200 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your environment variables.</p>
    </div>
  `
  throw new Error('Supabase configuration missing')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const tabs = [
  { id: 'jobs', label: 'Jobs', icon: 'briefcase' },
  { id: 'schedule', label: 'Schedule', icon: 'calendar' },
  { id: 'pay', label: 'Pay', icon: 'wallet' },
  { id: 'settings', label: 'Settings', icon: 'cog' },
]

const statusConfig = {
  pending: { bg: 'bg-amber-50', dot: 'bg-amber-500', text: 'text-amber-700', border: 'border-l-amber-500' },
  confirmed: { bg: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-700', border: 'border-l-blue-500' },
  in_progress: { bg: 'bg-indigo-50', dot: 'bg-indigo-500', text: 'text-indigo-700', border: 'border-l-indigo-500' },
  completed: { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-l-emerald-500' },
  cancelled: { bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-700', border: 'border-l-red-500' },
}

const serviceTypeConfig = {
  'Junk Removal': 'bg-orange-100 text-orange-700',
  'Moving Labor': 'bg-purple-100 text-purple-700',
  'Moving': 'bg-purple-100 text-purple-700',
  'Demolition': 'bg-rose-100 text-rose-700',
  'Cleaning': 'bg-teal-100 text-teal-700',
}

const iconsSvg = {
  briefcase: '<path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7h20v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 11v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 11v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="16" y1="2" x2="16" y2="6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="8" y1="2" x2="8" y2="6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="3" y1="10" x2="21" y2="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  wallet: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 12a2 2 0 1 1 0 4h-4v-4h4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  cog: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  chevronLeft: '<polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  truck: '<rect x="1" y="3" width="15" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18.5" cy="18.5" r="2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  dollarSign: '<line x1="12" y1="1" x2="12" y2="23" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22 4 12 14.01 9 11.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  clock: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  package: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="22.08" x2="12" y2="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
}

let session = null
let bookings = []
let loading = true
let authView = 'login'
let selectedBooking = null
let scheduleMonth = new Date()
let scheduleSelectedDate = null

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function formatMonth(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay() }
function getBookingsForDate(dateStr) { return bookings.filter(b => b.booking_details?.preferred_date === dateStr) }

function groupBookingsByDate() {
  const map = {}
  bookings.forEach(b => { const d = b.booking_details?.preferred_date; if (d) { if (!map[d]) map[d] = []; map[d].push(b) } })
  return map
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

function jobCard(booking) {
  const { id, order_number, customer_info, location_info, booking_details, status } = booking
  const sc = statusConfig[status] || statusConfig.pending
  const serviceBadge = serviceTypeConfig[booking_details?.service_type] || 'bg-gray-100 text-gray-700'
  const hasPhoto = booking_details?.photo_url
  return `<div class="job-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3 border-l-4 ${sc.border} active:scale-[0.98] transition-transform cursor-pointer" data-booking-id="${id}"><div class="p-4"><div class="flex items-start justify-between mb-2"><div class="flex items-center gap-2"><span class="text-sm font-bold text-gray-800 tracking-tight">${location_info?.city || order_number || ''}</span><span class="text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text} capitalize">${(status||'pending').replace('_',' ')}</span></div><span class="text-lg font-bold text-gray-900">$${booking_details?.price||0}</span></div><div class="flex items-start gap-3 mb-3">${hasPhoto?`<img src="${booking_details.photo_url}" class="w-12 h-12 rounded-lg object-cover shrink-0" alt="" loading="lazy" />`:`<div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`}<div class="min-w-0"><p class="font-semibold text-gray-800 truncate">${customer_info?.name||'Unknown'}</p><span class="inline-block text-xs px-1.5 py-0.5 rounded font-medium mt-1 ${serviceBadge}">${booking_details?.service_type||'Service'}</span></div></div><div class="flex items-center gap-4 text-xs text-gray-500"><div class="flex items-center gap-1 truncate"><svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span class="truncate">${location_info?.city||''}, ${location_info?.state||''}</span></div><div class="flex items-center gap-1 shrink-0"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span>${formatDate(booking_details?.preferred_date)}</span></div><div class="flex items-center gap-1 shrink-0"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>${booking_details?.preferred_time||''}</span></div></div></div></div>`
}

function renderBookingDetail(booking) {
  const { order_number, customer_info, location_info, booking_details, status, created_at } = booking
  const sc = statusConfig[status] || statusConfig.pending
  const serviceBadge = serviceTypeConfig[booking_details?.service_type] || 'bg-gray-100 text-gray-700'
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent([location_info?.address||'', location_info?.unit_number||'', location_info?.city||'', location_info?.state||'', location_info?.zip_code||''].filter(Boolean).join(' '))}`
  return `<div class="absolute inset-0 z-20 bg-gray-50 flex flex-col animate-slide-up"><header class="bg-white border-b border-gray-100 px-5 pt-12 pb-3 shrink-0"><div class="flex items-center gap-3"><button id="close-detail" class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center active:scale-90 transition-transform"><svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24">${iconsSvg.chevronLeft}</svg></button><div><span class="text-sm font-bold text-gray-800">${order_number||''}</span><span class="text-xs ml-2 px-2 py-0.5 rounded-full font-semibold ${sc.bg} ${sc.text} capitalize">${(status||'pending').replace('_',' ')}</span></div></div></header><main class="flex-1 overflow-y-auto">${booking_details?.photo_url?`<div class="h-48 bg-gray-200"><img src="${booking_details.photo_url}" class="w-full h-full object-cover" alt="" /></div>`:''}<div class="p-4 space-y-4"><div class="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100"><span class="text-xs px-2.5 py-1 rounded-full font-medium ${serviceBadge}">${booking_details?.service_type||'Service'}</span><span class="text-xl font-bold text-gray-900">$${booking_details?.price||0}</span></div><div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer</h3><p class="text-base font-semibold text-gray-800">${customer_info?.name||'Unknown'}</p>${customer_info?.email?`<a href="mailto:${customer_info.email}" class="flex items-center gap-2 text-sm text-gray-500 mt-2"><svg class="w-4 h-4" viewBox="0 0 24 24">${iconsSvg.mail}</svg><span>${customer_info.email}</span></a>`:''}${customer_info?.phone?`<a href="tel:${customer_info.phone.replace(/[^0-9+]/g,'')}" class="flex items-center gap-2 text-sm text-gray-500 mt-1.5"><svg class="w-4 h-4" viewBox="0 0 24 24">${iconsSvg.phone}</svg><span>${customer_info.phone}</span></a>`:''}</div><div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Location</h3><a href="${mapsUrl}" target="_blank" rel="noopener" class="block text-sm text-emerald-600 hover:text-emerald-700 active:text-emerald-800 transition"><p>${location_info?.address||''}${location_info?.unit_number?' '+location_info.unit_number:''}</p><p>${location_info?.city||''}, ${location_info?.state||''} ${location_info?.zip_code||''}</p></a></div>${booking_details?.preferred_date||booking_details?.preferred_time?`<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Schedule</h3>${booking_details?.preferred_date?`<div class="flex items-center gap-2 text-sm text-gray-700"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24">${iconsSvg.calendar}</svg><span>${formatDate(booking_details.preferred_date)}</span></div>`:''}${booking_details?.preferred_time?`<div class="flex items-center gap-2 text-sm text-gray-700 mt-2"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24">${iconsSvg.clock}</svg><span>${booking_details.preferred_time}</span></div>`:''}</div>`:''}${booking_details?.estimated_items&&booking_details.estimated_items.length?`<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Items</h3>${booking_details.estimated_items.map(item=>`<div class="flex items-center gap-2 text-sm text-gray-700"><svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24">${iconsSvg.package}</svg><span>${item}</span></div>`).join('')}${booking_details?.estimated_volume?`<p class="text-xs text-gray-400 mt-2">${booking_details.estimated_volume}</p>`:''}</div>`:''}${booking_details?.estimate_summary?`<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Pricing</h3><p class="text-sm text-gray-700">${booking_details.estimate_summary}</p></div>`:''}${booking_details?.deposit_paid!=null?`<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Deposit</h3><div class="flex items-center gap-2"><svg class="w-4 h-4 ${booking_details.deposit_paid?'text-emerald-500':'text-amber-500'}" viewBox="0 0 24 24">${iconsSvg.checkCircle}</svg><span class="text-sm font-medium ${booking_details.deposit_paid?'text-emerald-600':'text-amber-600'}">${booking_details.deposit_paid?'$'+(booking_details.deposit_amount||0)+' paid':'Not paid'}</span></div></div>`:''}<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Details</h3><p class="text-sm text-gray-700 whitespace-pre-wrap">${booking_details?.details||'No additional details'}</p></div><p class="text-xs text-gray-400 text-center pb-4">Created ${formatDateTime(created_at)}</p></div></main></div>`
}

async function loadBookings() {
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
  if (!error) bookings = data || []
  loading = false
  render()
}

function renderLoginPage() {
  document.querySelector('#app').innerHTML = `<div class="flex flex-col h-dvh max-w-md mx-auto bg-emerald-700 relative overflow-hidden"><div class="absolute top-0 left-0 right-0 h-64 bg-emerald-700"></div><div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-50"></div><div class="relative z-10 flex flex-col h-full"><div class="pt-20 pb-8 px-8 text-center text-white"><div class="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><svg class="w-8 h-8" viewBox="0 0 24 24">${iconsSvg.package}</svg></div><h1 class="text-2xl font-bold">Opek Junk Removal</h1><p class="text-emerald-200 text-sm mt-1">Driver Dashboard</p></div><div class="flex-1 flex flex-col px-6 justify-center"><div class="bg-white rounded-2xl shadow-xl p-6">${authView==='login'?`<h2 class="text-lg font-bold text-gray-800 mb-6">Sign In</h2><form id="login-form" class="space-y-4"><div><label class="block text-xs font-medium text-gray-600 mb-1">Email</label><input type="email" id="login-email" placeholder="you@example.com" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /></div><div><label class="block text-xs font-medium text-gray-600 mb-1">Password</label><input type="password" id="login-password" placeholder="Enter your password" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /></div><p id="login-error" class="text-red-500 text-xs hidden"></p><button type="submit" class="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition text-sm">Sign In</button></form><p class="text-center text-xs text-gray-500 mt-4">Don't have an account? <a href="#" id="switch-to-signup" class="text-emerald-600 font-medium">Sign Up</a></p>`:`<h2 class="text-lg font-bold text-gray-800 mb-6">Create Account</h2><form id="signup-form" class="space-y-4"><div><label class="block text-xs font-medium text-gray-600 mb-1">Email</label><input type="email" id="signup-email" placeholder="you@example.com" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /></div><div><label class="block text-xs font-medium text-gray-600 mb-1">Password</label><input type="password" id="signup-password" placeholder="Min. 6 characters" required minlength="6" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /></div><p id="signup-error" class="text-red-500 text-xs hidden"></p><button type="submit" class="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition text-sm">Create Account</button></form><p class="text-center text-xs text-gray-500 mt-4">Already have an account? <a href="#" id="switch-to-login" class="text-emerald-600 font-medium">Sign In</a></p>`}</div></div><p class="text-center text-xs text-gray-400 pb-6">Opek Junk Removal &copy; 2026</p></div></div>`

  setTimeout(() => {
    if (authView === 'login') {
      const form = document.getElementById('login-form'); const errorEl = document.getElementById('login-error')
      form.addEventListener('submit', async (e) => {
        e.preventDefault(); const email = document.getElementById('login-email').value; const password = document.getElementById('login-password').value
        errorEl.classList.add('hidden')
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { errorEl.textContent = error.message; errorEl.classList.remove('hidden') }
        else { session = data.session; renderApp() }
      })
    } else {
      const form = document.getElementById('signup-form'); const errorEl = document.getElementById('signup-error')
      form.addEventListener('submit', async (e) => {
        e.preventDefault(); const email = document.getElementById('signup-email').value; const password = document.getElementById('signup-password').value
        errorEl.classList.add('hidden')
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) { errorEl.textContent = error.message; errorEl.classList.remove('hidden') }
        else {
          await supabase.from('crm_admins').insert({ email }).select()
          session = data.session
          if (session) renderApp()
          else { errorEl.textContent = 'Check your email to confirm your account.'; errorEl.classList.remove('hidden') }
        }
      })
    }
    const ssu = document.getElementById('switch-to-signup'); const sli = document.getElementById('switch-to-login')
    if (ssu) ssu.addEventListener('click', (e) => { e.preventDefault(); authView = 'signup'; renderLoginPage() })
    if (sli) sli.addEventListener('click', (e) => { e.preventDefault(); authView = 'login'; renderLoginPage() })
  }, 0)
}

function renderEmptyState(label) {
  const iconMap = { Jobs: iconsSvg.briefcase, Schedule: iconsSvg.calendar, Pay: iconsSvg.wallet, Settings: iconsSvg.cog }
  return `<div class="flex flex-col items-center justify-center h-full text-gray-400 px-6 py-12"><svg class="w-16 h-16 mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">${iconMap[label]||iconMap['Jobs']}</svg><p class="text-lg font-medium text-gray-500">No ${label.toLowerCase()} yet</p><p class="text-sm text-gray-400 mt-1">Your ${label.toLowerCase()} will appear here</p></div>`
}

function renderJobsContent() {
  if (loading) return [1,2,3].map(()=>'<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse mb-3"><div class="flex justify-between mb-3"><div class="h-4 bg-gray-200 rounded w-24"></div><div class="h-4 bg-gray-200 rounded w-12"></div></div><div class="flex gap-3 mb-3"><div class="h-12 w-12 bg-gray-200 rounded-lg shrink-0"></div><div class="flex-1"><div class="h-4 bg-gray-200 rounded w-32 mb-2"></div><div class="h-3 bg-gray-200 rounded w-20"></div></div></div><div class="flex gap-3"><div class="h-3 bg-gray-200 rounded w-16"></div><div class="h-3 bg-gray-200 rounded w-20"></div><div class="h-3 bg-gray-200 rounded w-28"></div></div></div>').join('')
  if (!bookings.length) return renderEmptyState('Jobs')
  return `<div class="mb-4 flex items-center justify-between"><span class="text-sm text-gray-500 font-medium">${bookings.length} booking${bookings.length!==1?'s':''}</span><div class="flex gap-1"><button class="text-xs px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600 font-medium shadow-sm">All</button><button class="text-xs px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium">Pending</button><button class="text-xs px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">Completed</button></div></div>${bookings.map(b=>jobCard(b)).join('')}`
}

function renderScheduleContent() {
  const bookingsByDate = groupBookingsByDate()
  const upcoming = bookings.filter(b=>b.booking_details?.preferred_date).sort((a,b)=>a.booking_details.preferred_date.localeCompare(b.booking_details.preferred_date)).filter(b=>b.booking_details.preferred_date>=new Date().toISOString().slice(0,10))
  const year = scheduleMonth.getFullYear(); const month = scheduleMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month); const firstDay = getFirstDayOfMonth(year, month)
  const today = new Date()
  let calendarHTML = ''
  for (let i = 0; i < firstDay; i++) calendarHTML += '<div class="h-9"></div>'
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    const dateBookings = bookingsByDate[dateStr] || []
    const isToday = isSameDay(new Date(year, month, day), today)
    const isSelected = scheduleSelectedDate === dateStr
    const hasJobs = dateBookings.length > 0
    let cellClass = 'h-9 rounded-lg flex flex-col items-center justify-center text-sm cursor-pointer transition'
    if (isSelected) cellClass += ' bg-emerald-600 text-white font-bold'
    else if (isToday) cellClass += ' bg-emerald-100 text-emerald-800 font-bold'
    else cellClass += ' text-gray-700 hover:bg-gray-100'
    calendarHTML += `<div class="${cellClass}" data-date="${dateStr}"><span>${day}</span>${hasJobs?'<span class="w-1 h-1 rounded-full '+(isSelected?'bg-white':'bg-emerald-500')+'"></span>':''}</div>`
  }
  const selectedDateJobs = scheduleSelectedDate ? getBookingsForDate(scheduleSelectedDate) : []
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  return `<div class="space-y-4"><div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"><div class="flex items-center justify-between px-4 py-3 border-b border-gray-50"><button id="prev-month" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500"><svg class="w-4 h-4" viewBox="0 0 24 24">${iconsSvg.chevronLeft}</svg></button><span class="text-sm font-bold text-gray-800">${formatMonth(scheduleMonth)}</span><button id="next-month" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500"><svg class="w-4 h-4 rotate-180" viewBox="0 0 24 24">${iconsSvg.chevronLeft}</svg></button></div><div class="p-3"><div class="grid grid-cols-7 text-center text-xs font-medium text-gray-400 mb-1">${dayNames.map(d=>`<div>${d}</div>`).join('')}</div><div class="grid grid-cols-7 gap-0.5">${calendarHTML}</div></div></div>${scheduleSelectedDate?`<div><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">${formatDate(scheduleSelectedDate)}</h3><div class="space-y-2">${selectedDateJobs.length?selectedDateJobs.map(b=>{const sc=statusConfig[b.status]||statusConfig.pending;const sb=serviceTypeConfig[b.booking_details?.service_type]||'bg-gray-100 text-gray-700';return`<div class="schedule-job-card bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer" data-booking-id="${b.id}"><div class="w-2 h-10 ${sc.dot} rounded-full shrink-0"></div><div class="min-w-0 flex-1"><p class="text-sm font-semibold text-gray-800 truncate">${b.customer_info?.name||'Unknown'}</p><div class="flex items-center gap-2 mt-0.5"><span class="text-xs font-medium ${sc.text} capitalize">${(b.status||'pending').replace('_',' ')}</span><span class="text-xs px-1.5 py-0.5 rounded font-medium ${sb}">${b.booking_details?.service_type||''}</span></div></div><span class="text-sm font-bold text-gray-900 shrink-0">$${b.booking_details?.price||0}</span></div>`}).join(''):'<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center text-sm text-gray-400">No jobs on this date</div>'}</div></div>`:''}${upcoming.length?`<div><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Upcoming</h3><div class="space-y-2">${upcoming.slice(0,6).map(b=>{const sc=statusConfig[b.status]||statusConfig.pending;const sb=serviceTypeConfig[b.booking_details?.service_type]||'bg-gray-100 text-gray-700';return`<div class="schedule-job-card bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer" data-booking-id="${b.id}"><div class="flex flex-col items-center shrink-0 w-12"><span class="text-xs font-bold text-gray-500">${new Date(b.booking_details.preferred_date+'T00:00:00').toLocaleDateString('en-US',{month:'short'}).toUpperCase()}</span><span class="text-lg font-bold text-gray-800">${new Date(b.booking_details.preferred_date+'T00:00:00').getDate()}</span></div><div class="min-w-0 flex-1"><p class="text-sm font-semibold text-gray-800 truncate">${b.customer_info?.name||'Unknown'}</p><div class="flex items-center gap-2 mt-0.5"><span class="text-xs font-medium ${sc.text} capitalize">${(b.status||'pending').replace('_',' ')}</span><span class="text-xs px-1.5 py-0.5 rounded font-medium ${sb}">${b.booking_details?.service_type||''}</span><span class="text-xs text-gray-400">${b.booking_details?.preferred_time||''}</span></div></div><span class="text-sm font-bold text-gray-900 shrink-0">$${b.booking_details?.price||0}</span></div>`}).join('')}</div></div>`:`<div class="text-center text-gray-400 py-8"><svg class="w-12 h-12 mx-auto mb-2 text-gray-300" viewBox="0 0 24 24">${iconsSvg.calendar}</svg><p class="text-sm">No upcoming jobs</p></div>`}</div>`
}

function renderSettingsContent() {
  return `<div class="space-y-4 pt-2"><div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"><div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg">${(session.user.email||'?')[0].toUpperCase()}</div><div><p class="font-semibold text-gray-800">${session.user.email}</p><p class="text-xs text-gray-400">Driver</p></div></div><div class="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50"><button class="w-full flex items-center gap-3 p-4 text-sm text-gray-500 hover:bg-gray-50 transition"><svg class="w-5 h-5" viewBox="0 0 24 24">${iconsSvg.clock}</svg><span>Activity Log</span><svg class="w-4 h-4 ml-auto text-gray-300" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="w-full flex items-center gap-3 p-4 text-sm text-gray-500 hover:bg-gray-50 transition"><svg class="w-5 h-5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="8" y1="21" x2="16" y2="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12" y2="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>App Version</span><span class="ml-auto text-xs text-gray-400">1.0.0</span></button></div><button id="logout-btn" class="w-full bg-red-50 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-100 active:scale-[0.98] transition text-sm border border-red-200">Sign Out</button></div>`
}

function renderApp() {
  const params = new URLSearchParams(window.location.hash.slice(1))
  const active = params.get('tab') || 'jobs'
  const activeTabData = tabs.find(t => t.id === active)
  const contentMap = {
    jobs: () => renderJobsContent(),
    schedule: () => renderScheduleContent(),
    pay: () => renderEmptyState('Pay'),
    settings: () => renderSettingsContent(),
  }
  document.querySelector('#app').innerHTML = `<div class="flex flex-col h-dvh max-w-md mx-auto bg-gray-50 shadow-xl relative overflow-hidden"><header class="bg-white border-b border-gray-100 px-5 pt-12 pb-3 shrink-0"><div class="flex items-center justify-between"><div class="flex items-center gap-2.5"><span class="text-lg font-bold text-emerald-700">Opek</span><span class="text-lg font-bold text-gray-400">Driver</span></div><div class="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center"><span class="text-xs font-bold text-emerald-700">${(session?.user?.email||'?')[0].toUpperCase()}</span></div></div></header><main class="flex-1 overflow-y-auto p-4 relative">${(contentMap[active])()}</main><nav class="bg-white border-t border-gray-200 flex shrink-0">${tabs.map(tab=>{const isActive=tab.id===active;return`<a href="#tab=${tab.id}" class="flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${isActive?'text-emerald-600':'text-gray-400 hover:text-gray-600'}"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isActive?2.5:1.8}" stroke-linecap="round" stroke-linejoin="round">${iconsSvg[tab.icon]}</svg><span>${tab.label}</span></a>`}).join('')}</nav></div>`
  bindEvents(active)
}

function bindEvents(active) {
  if (active === 'jobs' && !loading && bookings.length) {
    document.querySelectorAll('.job-card').forEach(card=>{card.addEventListener('click',()=>{const id=card.dataset.bookingId;selectedBooking=bookings.find(b=>b.id===id);if(selectedBooking)showBookingDetail()})})
  }
  if (active === 'schedule') {
    document.getElementById('prev-month').addEventListener('click',()=>{scheduleMonth=new Date(scheduleMonth.getFullYear(),scheduleMonth.getMonth()-1,1);renderApp()})
    document.getElementById('next-month').addEventListener('click',()=>{scheduleMonth=new Date(scheduleMonth.getFullYear(),scheduleMonth.getMonth()+1,1);renderApp()})
    document.querySelectorAll('[data-date]').forEach(cell=>{cell.addEventListener('click',()=>{scheduleSelectedDate=cell.dataset.date;renderApp()})})
    document.querySelectorAll('.schedule-job-card').forEach(card=>{card.addEventListener('click',()=>{const id=card.dataset.bookingId;selectedBooking=bookings.find(b=>b.id===id);if(selectedBooking)showBookingDetail()})})
  }
  if (active === 'settings') {
    const btn = document.getElementById('logout-btn')
    if (btn) btn.addEventListener('click', async () => { await supabase.auth.signOut(); session = null; window.location.hash = ''; renderLoginPage() })
  }
}

function showBookingDetail() {
  const main = document.querySelector('main')
  if (!main || !selectedBooking) return
  main.insertAdjacentHTML('beforeend', renderBookingDetail(selectedBooking))
  setTimeout(()=>{document.getElementById('close-detail').addEventListener('click',closeBookingDetail)},0)
}

function closeBookingDetail() {
  const detail = document.querySelector('main .animate-slide-up')
  if (detail) detail.remove()
  selectedBooking = null
}

function render() { renderApp() }

async function init() {
  const { data } = await supabase.auth.getSession()
  session = data.session
  if (session) { renderApp(); loadBookings() }
  else renderLoginPage()
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session = newSession
    if (session) { renderApp(); loadBookings() }
    else { window.location.hash = ''; renderLoginPage() }
  })
}

init()

window.addEventListener('hashchange', () => { if (session) renderApp() })
