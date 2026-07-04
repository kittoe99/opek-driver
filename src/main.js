import './style.css'
import { createClient } from '@supabase/supabase-js'

// Leaflet loaded via CDN — available as global L

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  document.querySelector('#app').innerHTML = `<div class="flex flex-col h-dvh items-center justify-center bg-gray-50 px-6"><div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"><svg class="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><h2 class="text-lg font-bold text-gray-800 mb-1">Configuration Required</h2><p class="text-sm text-gray-500 text-center">Set <code class="bg-gray-200 px-1 rounded">VITE_SUPABASE_URL</code> and <code class="bg-gray-200 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your environment variables.</p></div>`
  throw new Error('Supabase configuration missing')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const tabs = [
  { id: 'schedule', label: 'Map', icon: 'mapPin' },
  { id: 'offers', label: 'Offers', icon: 'bell' },
  { id: 'jobs', label: 'Jobs', icon: 'briefcase' },
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
  cog: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  chevronLeft: '<polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22 4 12 14.01 9 11.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  clock: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  package: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="22.08" x2="12" y2="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
}

let session = null
let driver = null
let serviceAreas = []
let assignments = []
let bookingsById = {}
let loading = true
let authView = 'login'
let selectedBooking = null
let selectedAssignment = null
let scheduleMonth = new Date()
let scheduleSelectedDate = null
let scheduleViewMode = 'map'
let geocodeCache = {}

const assignmentStatusConfig = {
  offered: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-l-amber-500' },
  accepted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-l-blue-500' },
  in_progress: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-l-indigo-500' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-l-emerald-500' },
  declined: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-l-red-500' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-l-gray-400' },
}

function parseStatesInput(v) { return v.split(/[,;\s]+/).map(s=>s.trim().toUpperCase()).filter(s=>s.length===2) }
function getOffers() { return assignments.filter(a=>a.status==='offered') }
function getTodayEarnings() {
  const today = new Date().toISOString().slice(0, 10)
  return assignments.filter(a=>a.status==='completed').reduce((s,a)=>{const b=bookingsById[a.booking_id];return s+(b?.booking_details?.preferred_date===today?b?.booking_details?.price||0:0)},0)
}
function getAcceptedJobs() { return assignments.filter(a=>a.status==='accepted'||a.status==='in_progress'||a.status==='completed') }
function getAcceptedBookings() { return getAcceptedJobs().map(a=>bookingsById[a.booking_id]).filter(Boolean) }
function getBookingForAssignment(a) { return bookingsById[a?.booking_id] }

function formatDate(dateStr) { if(!dateStr)return''; const d=new Date(dateStr+'T00:00:00'); return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}) }
function formatDateTime(isoStr) { if(!isoStr)return''; const d=new Date(isoStr); return d.toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}) }
function formatMonth(date) { return date.toLocaleDateString('en-US',{month:'long',year:'numeric'}) }
function getDaysInMonth(y,m) { return new Date(y,m+1,0).getDate() }
function getFirstDayOfMonth(y,m) { return new Date(y,m,1).getDay() }
function getBookingsForDate(d) { return getAcceptedBookings().filter(b=>b.booking_details?.preferred_date===d) }
function groupBookingsByDate() { const m={}; getAcceptedBookings().forEach(b=>{const d=b.booking_details?.preferred_date;if(d){if(!m[d])m[d]=[];m[d].push(b)}});return m }
function isSameDay(d1,d2){return d1.getFullYear()===d2.getFullYear()&&d1.getMonth()===d2.getMonth()&&d1.getDate()===d2.getDate()}

function jobCard(booking,assignment){
  const{id,order_number,customer_info,location_info,booking_details,status}=booking
  const sc=statusConfig[status]||statusConfig.pending
  const sb=serviceTypeConfig[booking_details?.service_type]||'bg-gray-100 text-gray-700'
  const hp=booking_details?.photo_url
  const aa=assignment?` data-assignment-id="${assignment.id}"`:''
  return`<div class="job-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3 border-l-4 ${sc.border} active:scale-[0.98] transition-transform cursor-pointer" data-booking-id="${id}"${aa}><div class="p-4"><div class="flex items-start justify-between mb-2"><div class="flex items-center gap-2"><span class="text-sm font-bold text-gray-800 tracking-tight">${location_info?.city||order_number||''}</span><span class="text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text} capitalize">${(status||'pending').replace('_',' ')}</span></div></div><div class="flex items-start gap-3 mb-3">${hp?`<img src="${hp}" class="w-12 h-12 rounded-lg object-cover shrink-0" alt="" loading="lazy" />`:`<div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`}<div class="min-w-0"><p class="font-semibold text-gray-800 truncate">${customer_info?.name||'Unknown'}</p><span class="inline-block text-xs px-1.5 py-0.5 rounded font-medium mt-1 ${sb}">${booking_details?.service_type||'Service'}</span></div></div><div class="flex items-center gap-4 text-xs text-gray-500"><div class="flex items-center gap-1 truncate"><svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span class="truncate">${location_info?.city||''},${location_info?.state||''}</span></div><div class="flex items-center gap-1 shrink-0"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span>${formatDate(booking_details?.preferred_date)}</span></div><div class="flex items-center gap-1 shrink-0"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>${booking_details?.preferred_time||''}</span></div></div></div></div>`
}

function renderBookingDetail(booking,assignment){
  const{order_number,customer_info,location_info,booking_details,status,created_at}=booking
  const sc=statusConfig[status]||statusConfig.pending
  const serviceBadge=serviceTypeConfig[booking_details?.service_type]||'bg-gray-100 text-gray-700'
  const mapsUrl=`https://maps.google.com/?q=${encodeURIComponent([location_info?.address||'',location_info?.unit_number||'',location_info?.city||'',location_info?.state||'',location_info?.zip_code||''].filter(Boolean).join(' '))}`
  const asgnStatus=assignment?.status
  const showStartJob=asgnStatus==='accepted'
  const showCompleteJob=asgnStatus==='in_progress'
  return`<div class="absolute inset-0 z-[2000] bg-gray-100 flex flex-col animate-slide-up"><header class="bg-white border-b border-gray-100 text-gray-800 px-4 pt-3 pb-3 shrink-0"><div class="flex items-center gap-3"><button id="close-detail" class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center active:scale-90 transition-transform"><svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24">${iconsSvg.chevronLeft}</svg></button><div><h1 class="text-xs font-semibold leading-tight">${location_info?.city||''}, ${location_info?.state||''} &mdash; ${booking_details?.service_type||''}</h1></div></div></header><main class="flex-1 overflow-y-auto pb-0">${booking_details?.photo_url?`<div class="h-48 bg-gray-200"><img src="${booking_details.photo_url}" class="w-full h-full object-cover" alt="" /></div>`:''}<div class="p-4 space-y-4 pb-24"><div class="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div class="flex items-center gap-3"><span class="text-xs px-2.5 py-1 rounded-full font-semibold ${sc.bg} ${sc.text} capitalize">${(status||'pending').replace('_',' ')}</span><span class="text-xs px-2.5 py-1 rounded-full font-medium ${serviceBadge}">${booking_details?.service_type||'Service'}</span></div><span class="text-xl font-bold text-gray-900">$${booking_details?.price||0}</span></div><div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer</h3><p class="text-base font-semibold text-gray-800">${customer_info?.name||'Unknown'}</p>${customer_info?.email?`<a href="mailto:${customer_info.email}" class="flex items-center gap-2 text-sm text-gray-500 mt-2"><svg class="w-4 h-4" viewBox="0 0 24 24">${iconsSvg.mail}</svg><span>${customer_info.email}</span></a>`:''}${customer_info?.phone?`<a href="tel:${customer_info.phone.replace(/[^0-9+]/g,'')}" class="flex items-center gap-2 text-sm text-gray-500 mt-1.5"><svg class="w-4 h-4" viewBox="0 0 24 24">${iconsSvg.phone}</svg><span>${customer_info.phone}</span></a>`:''}</div><div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Location</h3><a href="${mapsUrl}" target="_blank" rel="noopener" class="block text-sm text-emerald-600 hover:text-emerald-700 active:text-emerald-800 transition"><p>${location_info?.address||''}${location_info?.unit_number?' '+location_info.unit_number:''}</p><p>${location_info?.city||''},${location_info?.state||''} ${location_info?.zip_code||''}</p></a></div>${booking_details?.preferred_date||booking_details?.preferred_time?`<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Schedule</h3>${booking_details?.preferred_date?`<div class="flex items-center gap-2 text-sm text-gray-700"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24">${iconsSvg.calendar}</svg><span>${formatDate(booking_details.preferred_date)}</span></div>`:''}${booking_details?.preferred_time?`<div class="flex items-center gap-2 text-sm text-gray-700 mt-2"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24">${iconsSvg.clock}</svg><span>${booking_details.preferred_time}</span></div>`:''}</div>`:''}${booking_details?.estimated_items&&booking_details.estimated_items.length?`<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Items</h3>${booking_details.estimated_items.map(i=>`<div class="flex items-center gap-2 text-sm text-gray-700"><svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24">${iconsSvg.package}</svg><span>${i}</span></div>`).join('')}${booking_details?.estimated_volume?`<p class="text-xs text-gray-400 mt-2">${booking_details.estimated_volume}</p>`:''}</div>`:''}<div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Details</h3><p class="text-sm text-gray-700 whitespace-pre-wrap">${booking_details?.details||'No additional details'}</p></div><p class="text-xs text-gray-400 text-center">Created ${formatDateTime(created_at)}</p></div></main>${showStartJob||showCompleteJob?`<div class="bg-white border-t border-gray-200 px-4 py-3 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">${showStartJob?`<button id="start-job-btn" class="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition text-sm">Start Job</button>`:''}${showCompleteJob?`<button id="complete-job-btn" class="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition text-sm">Mark Job Complete</button>`:''}</div>`:''}</div>`
}

async function loadDriverData(){
  loading=true;render()
  let driverRow=null
  const{data:rpcDriver,error:rpcError}=await supabase.rpc('get_my_driver')
  if(!rpcError&&rpcDriver)driverRow=rpcDriver
  else{const uid=session?.user?.id;if(uid){await supabase.rpc('register_driver',{p_full_name:'',p_phone:'',p_states:[]});const{data:linked}=await supabase.from('drivers').select('*').eq('user_id',uid).maybeSingle();driverRow=linked}}
  driver=driverRow||null
  if(driver){const{data:areas}=await supabase.from('driver_service_areas').select('state').eq('driver_id',driver.id).order('state');serviceAreas=(areas||[]).map(a=>a.state)}
  else{serviceAreas=[]}
  if(!driver||driver.status!=='approved'){assignments=[];bookingsById={};loading=false;render();return}
  const{data:assignmentRows}=await supabase.from('job_assignments').select('*').eq('driver_id',driver.id).order('assigned_at',{ascending:false})
  assignments=assignmentRows||[]
  const bookingIds=[...new Set(assignments.map(a=>a.booking_id))]
  if(bookingIds.length){const{data:bookingRows}=await supabase.from('bookings').select('*').in('id',bookingIds);bookingsById=Object.fromEntries((bookingRows||[]).map(b=>[b.id,b]))}
  else{bookingsById={}}
  loading=false;render()
}

function renderLoginPage(){
  document.querySelector('#app').innerHTML=`<div class="flex flex-col h-dvh max-w-md mx-auto bg-emerald-700 relative overflow-hidden"><div class="absolute top-0 left-0 right-0 h-64 bg-emerald-700"></div><div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-50"></div><div class="relative z-10 flex flex-col h-full"><div class="pt-20 pb-8 px-8 text-center text-white"><div class="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><svg class="w-8 h-8" viewBox="0 0 24 24">${iconsSvg.package}</svg></div><h1 class="text-2xl font-bold">Opek Junk Removal</h1><p class="text-emerald-200 text-sm mt-1">Driver Dashboard</p></div><div class="flex-1 flex flex-col px-6 justify-center"><div class="bg-white rounded-2xl shadow-xl p-6">${authView==='login'?`<h2 class="text-lg font-bold text-gray-800 mb-6">Sign In</h2><form id="login-form" class="space-y-4"><div><label class="block text-xs font-medium text-gray-600 mb-1">Email</label><input type="email" id="login-email" placeholder="you@example.com" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /></div><div><label class="block text-xs font-medium text-gray-600 mb-1">Password</label><input type="password" id="login-password" placeholder="Enter your password" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /></div><p id="login-error" class="text-red-500 text-xs hidden"></p><button type="submit" class="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition text-sm">Sign In</button></form><p class="text-center text-xs text-gray-500 mt-4">Don't have an account? <a href="#" id="switch-to-signup" class="text-emerald-600 font-medium">Sign Up</a></p>`:`<h2 class="text-lg font-bold text-gray-800 mb-6">Create Account</h2><form id="signup-form" class="space-y-4"><div><label class="block text-xs font-medium text-gray-600 mb-1">Full name</label><input type="text" id="signup-name" placeholder="Your name" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /></div><div><label class="block text-xs font-medium text-gray-600 mb-1">Email</label><input type="email" id="signup-email" placeholder="you@example.com" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /></div><div><label class="block text-xs font-medium text-gray-600 mb-1">Phone</label><input type="tel" id="signup-phone" placeholder="(555) 555-5555" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /></div><div><label class="block text-xs font-medium text-gray-600 mb-1">Service states</label><input type="text" id="signup-states" placeholder="CA, NV, AZ" required class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /><p class="text-xs text-gray-400 mt-1">Comma-separated 2-letter state codes you cover</p></div><div><label class="block text-xs font-medium text-gray-600 mb-1">Password</label><input type="password" id="signup-password" placeholder="Min. 6 characters" required minlength="6" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" /></div><p id="signup-error" class="text-red-500 text-xs hidden"></p><button type="submit" class="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition text-sm">Create Account</button></form><p class="text-center text-xs text-gray-500 mt-4">Already have an account? <a href="#" id="switch-to-login" class="text-emerald-600 font-medium">Sign In</a></p>`}</div></div><p class="text-center text-xs text-gray-400 pb-6">Opek Junk Removal &copy; 2026</p></div></div>`
  setTimeout(()=>{
    if(authView==='login'){
      const f=document.getElementById('login-form');const e=document.getElementById('login-error')
      f.addEventListener('submit',async(ev)=>{ev.preventDefault();const em=document.getElementById('login-email').value;const pw=document.getElementById('login-password').value;e.classList.add('hidden');const{data,error}=await supabase.auth.signInWithPassword({email:em,password:pw});if(error){e.textContent=error.message;e.classList.remove('hidden')}else{session=data.session;renderApp();await loadDriverData()}})
    }else{
      const f=document.getElementById('signup-form');const e=document.getElementById('signup-error')
      f.addEventListener('submit',async(ev)=>{ev.preventDefault();const em=document.getElementById('signup-email').value;const pw=document.getElementById('signup-password').value;const nm=document.getElementById('signup-name').value;const ph=document.getElementById('signup-phone').value;const st=parseStatesInput(document.getElementById('signup-states').value);e.classList.add('hidden');const{data,error}=await supabase.auth.signUp({email:em,password:pw});if(error){e.textContent=error.message;e.classList.remove('hidden')}else{session=data.session;if(session){const{error:regError}=await supabase.rpc('register_driver',{p_full_name:nm,p_phone:ph,p_states:st});if(regError){e.textContent=regError.message;e.classList.remove('hidden');return};await loadDriverData()}else{e.textContent='Check your email to confirm your account, then sign in.';e.classList.remove('hidden')}}})
    }
    const ssu=document.getElementById('switch-to-signup');const sli=document.getElementById('switch-to-login')
    if(ssu)ssu.addEventListener('click',(ev)=>{ev.preventDefault();authView='signup';renderLoginPage()})
    if(sli)sli.addEventListener('click',(ev)=>{ev.preventDefault();authView='login';renderLoginPage()})
  },0)
}

function renderEmptyState(label,hint){
  const iconMap={Offers:iconsSvg.bell,Jobs:iconsSvg.briefcase,Schedule:iconsSvg.calendar,Settings:iconsSvg.cog}
  return`<div class="flex flex-col items-center justify-center h-full text-gray-400 px-6 py-12"><svg class="w-16 h-16 mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">${iconMap[label]||iconMap['Jobs']}</svg><p class="text-lg font-medium text-gray-500">No ${label.toLowerCase()} yet</p><p class="text-sm text-gray-400 mt-1 text-center">${hint||`Your ${label.toLowerCase()} will appear here`}</p></div>`
}

function renderAppLoading(){return[1,2].map(()=>'<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse mb-3"><div class="h-4 bg-gray-200 rounded w-24 mb-3"></div><div class="h-4 bg-gray-200 rounded w-32 mb-2"></div><div class="h-8 bg-gray-200 rounded w-full mt-4"></div></div>').join('')}

function renderPendingScreen(){
  const isPending=driver?.status==='pending';const isSuspended=driver?.status==='suspended';const noProfile=!driver
  return`<div class="flex flex-col items-center justify-center h-full px-6 py-12 text-center"><div class="w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isSuspended?'bg-red-100':'bg-amber-100'}"><svg class="w-8 h-8 ${isSuspended?'text-red-600':'text-amber-600'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${iconsSvg.clock}</svg></div><h2 class="text-lg font-bold text-gray-800 mb-2">${noProfile?'Complete your profile':isSuspended?'Account suspended':'Pending approval'}</h2><p class="text-sm text-gray-500 max-w-xs">${noProfile?'Contact support to link your contractor account, or sign out and create a new driver account.':isSuspended?'Your driver account has been suspended. Contact Opek support for help.':'Your application is under review. You will see job offers here once an admin approves your account.'}</p>${driver&&serviceAreas.length?`<p class="text-xs text-gray-400 mt-4">Service areas: ${serviceAreas.join(', ')}</p>`:''}<button id="logout-btn" class="mt-8 text-sm text-red-600 font-medium">Sign out</button></div>`
}

function offerCard(assignment){
  const booking=getBookingForAssignment(assignment)
  if(!booking)return''
  const sc=assignmentStatusConfig.offered
  const sb=serviceTypeConfig[booking.booking_details?.service_type]||'bg-gray-100 text-gray-700'
  return`<div class="offer-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3 border-l-4 ${sc.border}" data-assignment-id="${assignment.id}"><div class="p-4"><div class="flex items-start justify-between mb-2"><div class="flex items-center gap-2"><span class="text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}">New offer</span><span class="text-sm font-bold text-gray-800">${booking.location_info?.city||booking.order_number||''}</span></div></div><p class="font-semibold text-gray-800 mb-1">${booking.customer_info?.name||'Unknown'}</p><span class="inline-block text-xs px-1.5 py-0.5 rounded font-medium ${sb}">${booking.booking_details?.service_type||'Service'}</span><p class="text-xs text-gray-500 mt-2">${booking.location_info?.city||''},${booking.location_info?.state||''}</p><p class="text-xs text-gray-500">${formatDate(booking.booking_details?.preferred_date)} &middot; ${booking.booking_details?.preferred_time||''}</p>${assignment.note?`<p class="text-xs text-gray-400 mt-2 italic">"${assignment.note}"</p>`:''}<div class="flex gap-2 mt-4"><button class="accept-offer-btn flex-1 bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-sm active:scale-[0.98] transition" data-assignment-id="${assignment.id}">Accept</button><button class="decline-offer-btn flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl text-sm active:scale-[0.98] transition" data-assignment-id="${assignment.id}">Decline</button></div></div></div>`
}

function renderOffersContent(){const o=getOffers();if(!o.length)return renderEmptyState('Offers','New job offers from dispatch will appear here');return`<div class="mb-4"><span class="text-sm text-gray-500 font-medium">${o.length} pending offer${o.length!==1?'s':''}</span></div>${o.map(a=>offerCard(a)).join('')}`}

function renderJobsContent(){
  if(loading)return[1,2,3].map(()=>'<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse mb-3"><div class="flex justify-between mb-3"><div class="h-4 bg-gray-200 rounded w-24"></div><div class="h-4 bg-gray-200 rounded w-12"></div></div><div class="flex gap-3 mb-3"><div class="h-12 w-12 bg-gray-200 rounded-lg shrink-0"></div><div class="flex-1"><div class="h-4 bg-gray-200 rounded w-32 mb-2"></div><div class="h-3 bg-gray-200 rounded w-20"></div></div></div><div class="flex gap-3"><div class="h-3 bg-gray-200 rounded w-16"></div><div class="h-3 bg-gray-200 rounded w-20"></div><div class="h-3 bg-gray-200 rounded w-28"></div></div></div>').join('')
  if(!getAcceptedBookings().length)return renderEmptyState('Jobs','Accepted jobs will appear here')
  const accepted=getAcceptedJobs()
  return`<div class="mb-4 flex items-center justify-between"><span class="text-sm text-gray-500 font-medium">${accepted.length} job${accepted.length!==1?'s':''}</span></div>${accepted.map(a=>{const b=getBookingForAssignment(a);return b?jobCard(b,a):''}).join('')}`
}

function renderScheduleContent(){
  const acceptedBookings=getAcceptedBookings()
  const upcoming=acceptedBookings.filter(b=>b.booking_details?.preferred_date).sort((a,b)=>a.booking_details.preferred_date.localeCompare(b.booking_details.preferred_date)).filter(b=>b.booking_details.preferred_date>=new Date().toISOString().slice(0,10))
  const listViewHTML=`<div class="flex-1 overflow-y-auto px-4 pt-3 pb-4"><div class="flex items-center justify-between mb-3"><span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">${upcoming.length} upcoming job${upcoming.length!==1?'s':''}</span><div class="flex items-center gap-1"><button id="view-map" class="text-xs px-2.5 py-1 rounded-full font-medium transition ${scheduleViewMode==='map'?'bg-emerald-600 text-white shadow-sm':'bg-white text-gray-500 border border-gray-200'}">Map</button><button id="view-list" class="text-xs px-2.5 py-1 rounded-full font-medium transition ${scheduleViewMode==='list'?'bg-emerald-600 text-white shadow-sm':'bg-white text-gray-500 border border-gray-200'}">List</button></div></div>${!upcoming.length?`<div class="text-center text-gray-400 py-16"><svg class="w-12 h-12 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24">${iconsSvg.calendar}</svg><p class="text-sm">No upcoming jobs</p></div>`:(()=>{const byDate={};upcoming.forEach(b=>{const d=b.booking_details?.preferred_date||'unknown';if(!byDate[d])byDate[d]=[];byDate[d].push(b)});return Object.entries(byDate).map(([date,jobs])=>`<div class="mb-4"><div class="flex items-center gap-2 mb-2 px-0.5"><div class="w-2 h-2 rounded-full bg-emerald-500"></div><span class="text-xs font-bold text-gray-500">${formatDate(date)}</span><span class="text-[10px] text-gray-400 ml-auto">${jobs.length} job${jobs.length>1?'s':''}</span></div><div class="space-y-2">${jobs.map(b=>{const sc=statusConfig[b.status]||statusConfig.pending;const addr=b.location_info;return`<div class="schedule-job-card bg-white rounded-xl border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer shadow-sm" data-booking-id="${b.id}"><div class="flex items-stretch"><div class="w-1 ${sc.dot} shrink-0"></div><div class="flex-1 p-3.5"><div class="flex items-start justify-between gap-2"><div class="min-w-0"><p class="text-sm font-semibold text-gray-800 truncate">${b.customer_info?.name||'Unknown'}</p><p class="text-xs text-gray-400 mt-0.5">${addr?.address?addr.address.split(',')[0]:addr?.city||''}${addr?.unit_number?' #'+addr.unit_number:''}</p></div><span class="text-xs font-bold ${sc.text} bg-gray-50 px-2 py-0.5 rounded-full shrink-0">${b.booking_details?.preferred_time||''}</span></div><div class="flex items-center gap-2 mt-2"><svg class="w-3.5 h-3.5 text-gray-300" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="text-xs text-gray-400">${addr?.city||''},${addr?.state||''} ${addr?.zip_code||''}</span></div></div></div></div>`}).join('')}</div></div>`).join('')})()}</div>`
  return`<div class="flex flex-col h-full relative"><div class="flex-1 p-3 ${scheduleViewMode==='list'?'hidden':''}"><div class="w-full h-full rounded-2xl overflow-hidden border-2 border-gray-300 bg-gray-200" id="map-container"></div></div><div class="absolute top-3 right-3 z-[1000] flex items-center gap-1"><button id="view-map" class="text-xs px-3 py-1.5 rounded-full font-medium shadow-md transition ${scheduleViewMode==='map'?'bg-emerald-600 text-white':'bg-white text-gray-700 border border-gray-200/50'}">Map</button><button id="view-list" class="text-xs px-3 py-1.5 rounded-full font-medium shadow-md transition ${scheduleViewMode==='list'?'bg-emerald-600 text-white':'bg-white text-gray-700 border border-gray-200/50'}">List</button></div>${scheduleViewMode==='map'&&upcoming.length?`<div class="absolute bottom-3 left-3 right-3 z-[1000]">${upcoming.slice(0,2).map(b=>{const sc=statusConfig[b.status]||statusConfig.pending;return`<div class="schedule-job-card bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-3 mb-2 active:scale-[0.98] transition-transform cursor-pointer" data-booking-id="${b.id}"><div class="w-10 h-10 rounded-xl bg-emerald-50 flex flex-col items-center justify-center shrink-0"><span class="text-xs font-bold text-emerald-700">${new Date(b.booking_details.preferred_date+'T00:00:00').getDate()}</span><span class="text-[9px] font-semibold text-emerald-500 uppercase leading-none">${new Date(b.booking_details.preferred_date+'T00:00:00').toLocaleDateString('en-US',{month:'short'})}</span></div><div class="min-w-0 flex-1"><p class="text-sm font-semibold text-gray-800 truncate">${b.customer_info?.name||'Unknown'}</p><div class="flex items-center gap-1.5 mt-0.5"><span class="text-[11px] font-medium ${sc.text} capitalize">${(b.status||'pending').replace('_',' ')}</span><span class="text-[11px] text-gray-400">&middot; ${b.location_info?.city||''} &middot; ${b.booking_details?.preferred_time||''}</span></div></div><svg class="w-4 h-4 text-gray-300 shrink-0" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`}).join('')}</div>`:''}${scheduleViewMode==='list'?listViewHTML:''}</div>`
}

function renderSettingsContent(){
  const statusLabel=driver?.status?driver.status.charAt(0).toUpperCase()+driver.status.slice(1):'Unknown'
  const statusColor=driver?.status==='approved'?'text-emerald-600':driver?.status==='suspended'?'text-red-600':'text-amber-600'
  return`<div class="space-y-4 pt-2"><div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"><div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg">${(driver?.full_name||session.user.email||'?')[0].toUpperCase()}</div><div><p class="font-semibold text-gray-800">${driver?.full_name||session.user.email}</p><p class="text-xs ${statusColor} font-medium">${statusLabel} driver</p></div></div>${serviceAreas.length?`<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4"><h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Service areas</h3><p class="text-sm text-gray-700">${serviceAreas.join(', ')}</p></div>`:''}<div class="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50"><div class="flex items-center gap-3 p-4 text-sm text-gray-500"><svg class="w-5 h-5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="8" y1="21" x2="16" y2="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="17" x2="12" y2="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>App Version</span><span class="ml-auto text-xs text-gray-400">1.1.0</span></div></div><button id="logout-btn" class="w-full bg-red-50 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-100 active:scale-[0.98] transition text-sm border border-red-200">Sign Out</button></div>`
}

function renderApp(){
  const params=new URLSearchParams(window.location.hash.slice(1))
  const active=params.get('tab')||'schedule'
  const offersCount=getOffers().length
  const contentMap={offers:()=>renderOffersContent(),jobs:()=>renderJobsContent(),schedule:()=>renderScheduleContent(),settings:()=>renderSettingsContent()}
  const isApproved=driver?.status==='approved'
  const showMainApp=!loading&&isApproved
  let mainContent
  if(loading)mainContent=renderAppLoading()
  else if(isApproved)mainContent=(contentMap[active]||contentMap.offers)()
  else mainContent=renderPendingScreen()
  document.querySelector('#app').innerHTML=`<div class="flex flex-col h-dvh max-w-md mx-auto bg-gray-100 shadow-xl relative overflow-hidden"><header class="bg-white border-b border-gray-100 px-5 pt-12 pb-4 shrink-0"><div class="flex items-end justify-between"><div class="flex items-center gap-2"><span class="text-xl font-bold text-emerald-700">Opek</span><span class="text-sm font-semibold text-gray-300 mb-0.5">Driver</span></div><div class="text-right"><p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">Today</p><p class="text-lg font-bold text-emerald-700">$${getTodayEarnings()}</p></div></div></header><main class="flex-1 ${active==='schedule'?'p-0':'overflow-y-auto p-4'} relative">${mainContent}</main>${showMainApp?`<nav class="bg-white border-t border-gray-200 flex shrink-0">${tabs.map(tab=>{const isActive=tab.id===active;const badge=tab.id==='offers'&&offersCount>0?`<span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">${offersCount}</span>`:'';return`<a href="#tab=${tab.id}" class="relative flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${isActive?'text-emerald-600':'text-gray-400 hover:text-gray-600'}"><span class="relative"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isActive?2.5:1.8}" stroke-linecap="round" stroke-linejoin="round">${iconsSvg[tab.icon]}</svg>${badge}</span><span>${tab.label}</span></a>`}).join('')}</nav>`:''}</div>`
  bindEvents(active,showMainApp)
}

function bindEvents(active,showApp=true){
  if(!showApp){const b=document.getElementById('logout-btn');if(b)b.addEventListener('click',async()=>{await supabase.auth.signOut();session=null;driver=null;window.location.hash='';renderLoginPage()});return}
  if(active==='offers'&&!loading){
    document.querySelectorAll('.accept-offer-btn').forEach(btn=>btn.addEventListener('click',async(e)=>{e.stopPropagation();const id=btn.dataset.assignmentId;btn.disabled=true;const{error}=await supabase.rpc('accept_job_assignment',{p_assignment_id:id});if(error){alert(error.message);btn.disabled=false;return};await loadDriverData();window.location.hash='tab=jobs'}))
    document.querySelectorAll('.decline-offer-btn').forEach(btn=>btn.addEventListener('click',async(e)=>{e.stopPropagation();const id=btn.dataset.assignmentId;if(!confirm('Decline this job offer?'))return;btn.disabled=true;const{error}=await supabase.rpc('decline_job_assignment',{p_assignment_id:id});if(error)alert(error.message);await loadDriverData()}))
  }
  if(active==='jobs'&&!loading&&getAcceptedJobs().length)document.querySelectorAll('.job-card').forEach(c=>c.addEventListener('click',()=>{const id=c.dataset.bookingId;const aid=c.dataset.assignmentId;selectedBooking=bookingsById[id];selectedAssignment=aid?assignments.find(a=>a.id===aid):null;if(selectedBooking)showBookingDetail()}))
  if(active==='schedule'){
    document.getElementById('view-map').addEventListener('click',()=>{scheduleViewMode='map';renderApp()})
    document.getElementById('view-list').addEventListener('click',()=>{scheduleViewMode='list';renderApp()})
    if(scheduleViewMode==='map')initScheduleMap()
    document.querySelectorAll('.schedule-job-card').forEach(c=>c.addEventListener('click',()=>{const id=c.dataset.bookingId;selectedBooking=bookingsById[id];selectedAssignment=assignments.find(a=>a.booking_id===id&&(a.status==='accepted'||a.status==='in_progress'||a.status==='completed'))||null;if(selectedBooking)showBookingDetail()}))
  }
  if(active==='settings'){const b=document.getElementById('logout-btn');if(b)b.addEventListener('click',async()=>{await supabase.auth.signOut();session=null;window.location.hash='';renderLoginPage()})}
}

function showBookingDetail(){const main=document.querySelector('main');if(!main||!selectedBooking)return;main.insertAdjacentHTML('beforeend',renderBookingDetail(selectedBooking,selectedAssignment));setTimeout(()=>{document.getElementById('close-detail')?.addEventListener('click',closeBookingDetail);document.getElementById('start-job-btn')?.addEventListener('click',async()=>{if(!selectedAssignment||selectedAssignment.status!=='accepted')return;const btn=document.getElementById('start-job-btn');btn.disabled=true;const{error}=await supabase.rpc('start_job_assignment',{p_assignment_id:selectedAssignment.id});if(error){alert(error.message);btn.disabled=false;return};closeBookingDetail();await loadDriverData()});document.getElementById('complete-job-btn')?.addEventListener('click',async()=>{if(!selectedAssignment||selectedAssignment.status!=='in_progress')return;const btn=document.getElementById('complete-job-btn');btn.disabled=true;const{error}=await supabase.rpc('complete_job_assignment',{p_assignment_id:selectedAssignment.id});if(error){alert(error.message);btn.disabled=false;return};closeBookingDetail();await loadDriverData()})},0)}

function closeBookingDetail(){const d=document.querySelector('main .animate-slide-up');if(d)d.remove();selectedBooking=null;selectedAssignment=null}

async function geocodeAddress(address,city,state,zip){const key=[address,city,state,zip].filter(Boolean).join(', ');if(geocodeCache[key])return geocodeCache[key];const query=encodeURIComponent(key);try{const res=await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&addressdetails=0`);const data=await res.json();if(data.length){const result={lat:parseFloat(data[0].lat),lng:parseFloat(data[0].lon)};geocodeCache[key]=result;return result}}catch{}return null}

function initScheduleMap(){const L=window.L;if(!L)return;const container=document.getElementById('map-container');if(!container)return;container.innerHTML='';const map=L.map('map-container',{zoomControl:false,attributionControl:false}).setView([39.7392,-104.9853],11);L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'&copy; CARTO',maxZoom:18}).addTo(map);const acceptedBookings=getAcceptedBookings();const colors=['#10b981','#6366f1','#f59e0b','#3b82f6','#ef4444'];acceptedBookings.forEach(async(b,i)=>{const addr=b.location_info;const coords=await geocodeAddress(addr?.address,addr?.city,addr?.state,addr?.zip_code);if(!coords)return;const m=L.circleMarker([coords.lat,coords.lng],{radius:8,fillColor:colors[i%colors.length],color:'#fff',weight:2,fillOpacity:.9}).addTo(map);const name=(b.customer_info?.name||'').split(' ')[0];m.bindTooltip(name,{permanent:true,direction:'top',offset:[0,-12]});m.bindPopup(`${b.customer_info?.name||''}<br><span style="font-size:11px;color:#6b7280">${b.booking_details?.service_type||''} &middot; ${formatDate(b.booking_details?.preferred_date)}</span>`);m.on('click',()=>{selectedBooking=b;selectedAssignment=assignments.find(a=>a.booking_id===b.id)||null;showBookingDetail()})});setTimeout(()=>map.invalidateSize(),100)}

function render(){renderApp()}

async function init(){loading=true;const{data}=await supabase.auth.getSession();session=data.session;if(session){await loadDriverData()}else{loading=false;renderLoginPage()}supabase.auth.onAuthStateChange(async(event,newSession)=>{if(event==='INITIAL_SESSION')return;session=newSession;if(session){await loadDriverData()}else{loading=false;driver=null;assignments=[];bookingsById={};window.location.hash='';renderLoginPage()}})}

init()
window.addEventListener('hashchange',()=>{if(session)renderApp()})
