import {
  DEFAULT_USERS,
  DEFAULT_RULES,
  DEFAULT_REQUESTS,
  COLOR_STYLES,
  STATUS_STYLES,
  formatDate,
  getRequestPoints,
  getStatusLabel,
  groupRules,
  computeLeaderboard,
  runSelfChecks,
} from './utils/appHelpers';
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';

const STORAGE_KEY = 'fantamas-app-v1';

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.rules) || !Array.isArray(parsed.requests)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors in preview environments
  }
}

async function loadSupabaseData() {
  const { data: boysData, error: boysError } = await supabase
    .from('boys')
    .select('*')
    .order('created_at', { ascending: true });

  const { data: rulesData, error: rulesError } = await supabase
    .from('rules')
    .select('*')
    .order('created_at', { ascending: true });

  const { data: requestsData, error: requestsError } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (boysError || rulesError || requestsError) {
    console.error('Errore caricamento Supabase', {
      boysError,
      rulesError,
      requestsError,
    });
    return;
  }

  setAppState({
    users: [
      ...(boysData || []).map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
      })),
      { id: 'operatore-1', name: 'Operatore', role: 'operator' },
    ],
    rules: (rulesData || []).map(rule => ({
      id: rule.id,
      category: rule.category,
      label: rule.label,
      points: rule.points,
      kind: rule.kind,
      boySelectable: rule.boy_selectable,
      icon: rule.icon,
      color: rule.color,
    })),
    requests: (requestsData || []).map(request => ({
      id: request.id,
      userId: request.user_id,
      userName: request.user_name,
      ruleId: request.rule_id,
      activity: request.activity,
      points: request.points,
      finalPoints: request.final_points,
      status: request.status,
      createdAt: request.created_at,
      note: request.note || '',
      decidedBy: request.decided_by || '',
    })),
  });
}

function Shell({ children, title, subtitle, onBack, onReset, currentUser }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-slate-50 text-neutral-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-4xl md:text-5xl font-black tracking-tight text-orange-600">FantaMas</div>
            <div className="text-base md:text-lg text-neutral-600 mt-1">{subtitle || 'Prima web app demo'}</div>
            {currentUser && <div className="text-sm mt-2 text-neutral-500">Accesso: {currentUser.name}</div>}
          </div>
          <div className="flex flex-wrap gap-2">
            {onBack && (
              <button onClick={onBack} className="rounded-2xl px-4 py-2.5 bg-white border border-neutral-200 shadow-sm hover:bg-neutral-100 font-medium">
                ← Indietro
              </button>
            )}
            {onReset && (
              <button onClick={onReset} className="rounded-2xl px-4 py-2.5 bg-white border border-neutral-200 shadow-sm hover:bg-neutral-100 font-medium">
                Reset demo
              </button>
            )}
          </div>
        </div>
        {title && <h1 className="text-3xl md:text-4xl font-bold mb-5">{title}</h1>}
        {children}
      </div>
    </div>
  );
}

function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-[28px] shadow-md border border-neutral-200 p-6 ${className}`}>{children}</div>;
}

function ActionButton({ children, onClick, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-[24px] px-5 py-5 text-left border border-neutral-200 shadow-sm bg-white hover:bg-neutral-50 hover:shadow-md transition font-medium ${className}`}
    >
      {children}
    </button>
  );
}

function Pill({ children, className = '' }) {
  return <div className={`inline-flex rounded-full px-3 py-1 text-sm font-medium border ${className}`}>{children}</div>;
}

const OPERATOR_PASSWORD = import.meta.env.VITE_OPERATOR_PASSWORD;

export default function FantaMasMockup() {
  const [appState, setAppState] = useState({
    users: [],
    rules: [],
    requests: [],
  });
  const [screen, setScreen] = useState('landing');
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [operatorTargetUserId, setOperatorTargetUserId] = useState('marco');
  const [operatorRuleId, setOperatorRuleId] = useState('rifiuto-partecipare');
  const [operatorNote, setOperatorNote] = useState('');
  const [newBoyName, setNewBoyName] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState('');
  const [newRuleLabel, setNewRuleLabel] = useState('');
  const [newRulePoints, setNewRulePoints] = useState('');
  const [newRuleKind, setNewRuleKind] = useState('bonus');
  const [newRuleSelectable, setNewRuleSelectable] = useState(true);
  const [deleteBoyId, setDeleteBoyId] = useState('marco');
  const [deleteRuleId, setDeleteRuleId] = useState('');
  const [editRuleId, setEditRuleId] = useState('');
  const [editRuleCategory, setEditRuleCategory] = useState('');
  const [editRuleLabel, setEditRuleLabel] = useState('');
  const [editRulePoints, setEditRulePoints] = useState('');
  const [editRuleKind, setEditRuleKind] = useState('bonus');
  const [editRuleSelectable, setEditRuleSelectable] = useState(true);
  const [editBoyId, setEditBoyId] = useState('');
  const [editBoyName, setEditBoyName] = useState('');
  const [modifyDraft, setModifyDraft] = useState({ requestId: '', finalPoints: '', note: '' });
  const [operatorPasswordInput, setOperatorPasswordInput] = useState('');
  const [operatorAccessGranted, setOperatorAccessGranted] = useState(false);

  useEffect(() => {
    runSelfChecks();
  }, []);

  useEffect(() => {
  loadSupabaseData();
}, []);

  async function loadSupabaseData() {
  const { data: boysData, error: boysError } = await supabase
    .from('boys')
    .select('*')
    .order('created_at', { ascending: true });

  const { data: rulesData, error: rulesError } = await supabase
    .from('rules')
    .select('*')
    .order('created_at', { ascending: true });

  const { data: requestsData, error: requestsError } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (boysError || rulesError || requestsError) {
    console.error('Errore caricamento Supabase', {
      boysError,
      rulesError,
      requestsError,
    });
    return;
  }

  setAppState({
    users: [
      ...(boysData || []).map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
      })),
      { id: 'operatore-1', name: 'Operatore', role: 'operator' },
    ],
    rules: (rulesData || []).map(rule => ({
      id: rule.id,
      category: rule.category,
      label: rule.label,
      points: rule.points,
      kind: rule.kind,
      boySelectable: rule.boy_selectable,
      icon: rule.icon,
      color: rule.color,
    })),
    requests: (requestsData || []).map(request => ({
      id: request.id,
      userId: request.user_id,
      userName: request.user_name,
      ruleId: request.rule_id,
      activity: request.activity,
      points: request.points,
      finalPoints: request.final_points,
      status: request.status,
      createdAt: request.created_at,
      note: request.note || '',
      decidedBy: request.decided_by || '',
    })),
  });
}

  // useEffect(() => {
  //  saveState(appState);
  // }, [appState]);

  useEffect(() => {
  if (!deleteRuleId && appState.rules.length > 0) {
    setDeleteRuleId(appState.rules[0].id);
  }
  }, [appState.rules, deleteRuleId]);

  useEffect(() => {
  if (!editRuleId && appState.rules.length > 0) {
    setEditRuleId(appState.rules[0].id);
    return;
  }

  const selectedRule = appState.rules.find(rule => rule.id === editRuleId);
  if (!selectedRule) return;

  setEditRuleCategory(selectedRule.category);
  setEditRuleLabel(selectedRule.label);
  setEditRulePoints(String(selectedRule.points));
  setEditRuleKind(selectedRule.kind);
  setEditRuleSelectable(selectedRule.boySelectable);
}, [appState.rules, editRuleId]);

useEffect(() => {
  const boys = appState.users.filter(user => user.role === 'boy');

  if (!editBoyId && boys.length > 0) {
    setEditBoyId(boys[0].id);
    return;
  }

  const selectedBoy = appState.users.find(user => user.id === editBoyId && user.role === 'boy');
  if (!selectedBoy) return;

  setEditBoyName(selectedBoy.name);
}, [appState.users, editBoyId]);

  const currentUser = useMemo(() => appState.users.find(user => user.id === currentUserId) || null, [appState.users, currentUserId]);
  const categories = useMemo(() => Object.values(groupRules(appState.rules)), [appState.rules]);
  const selectedCategoryData = categories.find(category => category.key === selectedCategory) || null;
  const selectedRule = appState.rules.find(rule => rule.id === selectedRuleId) || null;
  const leaderboard = useMemo(() => computeLeaderboard(appState.users, appState.requests), [appState.users, appState.requests]);
  const pendingRequests = useMemo(() => appState.requests.filter(request => request.status === 'pending'), [appState.requests]);
  const myRequests = useMemo(
    () => appState.requests.filter(request => request.userId === currentUserId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [appState.requests, currentUserId]
  );
  const myPoints = useMemo(() => leaderboard.find(item => item.id === currentUserId)?.points || 0, [leaderboard, currentUserId]);
  const myPosition = useMemo(() => leaderboard.findIndex(item => item.id === currentUserId) + 1 || 0, [leaderboard, currentUserId]);

  function resetDemo() {
    const fresh = { users: DEFAULT_USERS, rules: DEFAULT_RULES, requests: DEFAULT_REQUESTS };
    setAppState(fresh);
    setScreen('landing');
    setCurrentUserId('');
    setSelectedCategory('');
    setSelectedRuleId('');
    setOperatorTargetUserId('marco');
    setOperatorRuleId('rifiuto-partecipare');
    setOperatorNote('');
    setModifyDraft({ requestId: '', finalPoints: '', note: '' });
    saveState(fresh);
  }

function loginAs(userId) {
  const user = appState.users.find(item => item.id === userId);
  if (!user) return;

  if (user.role === 'operator') {
    setCurrentUserId(userId);
    setScreen('operator-login');
    return;
  }

  setCurrentUserId(userId);
  setScreen('boy-home');
}

function submitOperatorPassword() {
  if (operatorPasswordInput === OPERATOR_PASSWORD) {
    setOperatorAccessGranted(true);
    setOperatorPasswordInput('');
    setScreen('operator-home');
    return;
  }

  alert('Password operatore non corretta');
}

function logoutOperator() {
  setOperatorAccessGranted(false);
  setOperatorPasswordInput('');
  setCurrentUserId('');
  setScreen('landing');
}

  async function submitRequest() {
  if (!currentUser || !selectedRule) return;

  const newRequest = {
    id: `req-${Date.now()}`,
    user_id: currentUser.id,
    user_name: currentUser.name,
    rule_id: selectedRule.id,
    activity: selectedRule.label,
    points: selectedRule.points,
    status: 'pending',
    created_at: new Date().toISOString(),
    note: '',
    decided_by: '',
  };

  const { error } = await supabase.from('requests').insert(newRequest);

  if (error) {
    console.error('Errore invio richiesta', error);
    return;
  }

  setSelectedCategory('');
  setSelectedRuleId('');
  await loadSupabaseData();
  setScreen('boy-requests');
}

async function decideRequest(requestId, action) {
  if (!currentUser) return;

  let payload = null;

  if (action === 'approve') {
    payload = {
      status: 'approved',
      decided_by: currentUser.name,
      note: '',
    };
  }

  if (action === 'reject') {
    payload = {
      status: 'rejected',
      decided_by: currentUser.name,
      note: 'Non confermato',
    };
  }

  if (!payload) return;

  const { error } = await supabase
    .from('requests')
    .update(payload)
    .eq('id', requestId)
    .eq('status', 'pending');

  if (error) {
    console.error('Errore decisione richiesta', error);
    return;
  }

  await loadSupabaseData();
}

  function startModify(request) {
    setModifyDraft({ requestId: request.id, finalPoints: String(Math.max(1, request.points - 1)), note: request.note || 'Partecipazione parziale' });
  }

async function saveModify() {
  if (!modifyDraft.requestId || !currentUser) return;

  const parsedPoints = Number(modifyDraft.finalPoints);
  if (Number.isNaN(parsedPoints)) return;

  const { error } = await supabase
    .from('requests')
    .update({
      status: 'modified',
      final_points: parsedPoints,
      note: modifyDraft.note,
      decided_by: currentUser.name,
    })
    .eq('id', modifyDraft.requestId)
    .eq('status', 'pending');

  if (error) {
    console.error('Errore modifica richiesta', error);
    return;
  }

  setModifyDraft({ requestId: '', finalPoints: '', note: '' });
  await loadSupabaseData();
}

async function addNewBoy() {
  const cleanName = newBoyName.trim();
  if (!cleanName) return;

  const normalizedId = cleanName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const finalId = normalizedId || `ragazzo-${Date.now()}`;

  const alreadyExists = appState.users.some(
    user => user.role === 'boy' && (user.id === finalId || user.name.toLowerCase() === cleanName.toLowerCase())
  );

  if (alreadyExists) return;

  const { error } = await supabase.from('boys').insert({
    id: finalId,
    name: cleanName,
    role: 'boy',
  });

  if (error) {
    console.error('Errore aggiunta ragazzo', error);
    return;
  }

  setNewBoyName('');
  setOperatorTargetUserId(finalId);
  await loadSupabaseData();
}

async function deleteBoy() {
  if (!deleteBoyId) return;

  const userToDelete = appState.users.find(user => user.id === deleteBoyId);
  if (!userToDelete || userToDelete.role !== 'boy') return;

  const { error } = await supabase
    .from('boys')
    .delete()
    .eq('id', deleteBoyId);

  if (error) {
    console.error('Errore eliminazione ragazzo', error);
    return;
  }

  setDeleteBoyId('');
  await loadSupabaseData();
}

async function addNewRule() {
  const category = newRuleCategory.trim();
  const label = newRuleLabel.trim();
  const points = Number(newRulePoints);

  if (!category || !label || Number.isNaN(points)) return;

  const normalizedId = `${category}-${label}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const finalId = normalizedId || `regola-${Date.now()}`;

  const alreadyExists = appState.rules.some(
    rule => rule.id === finalId || rule.label.toLowerCase() === label.toLowerCase()
  );

  if (alreadyExists) return;

  const colorByCategory = {
    pulizia: 'sky',
    pranzo: 'orange',
    rifiuti: 'emerald',
    cucina: 'amber',
    uscite: 'cyan',
    spesa: 'cyan',
    didattica: 'violet',
    podcast: 'violet',
    laboratori: 'violet',
    cura: 'teal',
    attenzione: 'rose',
  };

  const iconByCategory = {
    pulizia: '🧹',
    pranzo: '🍽️',
    rifiuti: '♻️',
    cucina: '🍳',
    uscite: '🛒',
    spesa: '🛒',
    didattica: '🎙️',
    podcast: '🎙️',
    laboratori: '🎙️',
    cura: '👕',
    attenzione: '⚠️',
  };

  const categoryKey = category.toLowerCase();
  const matchedColor =
    Object.keys(colorByCategory).find(key => categoryKey.includes(key));
  const matchedIcon =
    Object.keys(iconByCategory).find(key => categoryKey.includes(key));

  const newRule = {
    id: finalId,
    category,
    label,
    points,
    kind: newRuleKind,
    boy_selectable: newRuleSelectable,
    icon: matchedIcon ? iconByCategory[matchedIcon] : (newRuleKind === 'malus' ? '⚠️' : '⭐'),
    color: matchedColor ? colorByCategory[matchedColor] : (newRuleKind === 'malus' ? 'rose' : 'orange'),
  };

  const { error } = await supabase.from('rules').insert(newRule);

  if (error) {
    console.error('Errore aggiunta regola', error);
    return;
  }

  setNewRuleCategory('');
  setNewRuleLabel('');
  setNewRulePoints('');
  setNewRuleKind('bonus');
  setNewRuleSelectable(true);

  await loadSupabaseData();
}

async function deleteRule() {
  if (!deleteRuleId) return;

  const { error } = await supabase
    .from('rules')
    .delete()
    .eq('id', deleteRuleId);

  if (error) {
    console.error('Errore eliminazione regola', error);
    return;
  }

  setDeleteRuleId('');
  await loadSupabaseData();
}

  async function updateRule() {
  if (!editRuleId) return;

  const category = editRuleCategory.trim();
  const label = editRuleLabel.trim();
  const points = Number(editRulePoints);

  if (!category || !label || Number.isNaN(points)) return;

  const colorByCategory = {
    pulizia: 'sky',
    pranzo: 'orange',
    rifiuti: 'emerald',
    cucina: 'amber',
    uscite: 'cyan',
    spesa: 'cyan',
    didattica: 'violet',
    podcast: 'violet',
    laboratori: 'violet',
    cura: 'teal',
    attenzione: 'rose',
  };

  const iconByCategory = {
    pulizia: '🧹',
    pranzo: '🍽️',
    rifiuti: '♻️',
    cucina: '🍳',
    uscite: '🛒',
    spesa: '🛒',
    didattica: '🎙️',
    podcast: '🎙️',
    laboratori: '🎙️',
    cura: '👕',
    attenzione: '⚠️',
  };

  const categoryKey = category.toLowerCase();
  const matchedColor =
    Object.keys(colorByCategory).find(key => categoryKey.includes(key));
  const matchedIcon =
    Object.keys(iconByCategory).find(key => categoryKey.includes(key));

  const { error } = await supabase
    .from('rules')
    .update({
      category,
      label,
      points,
      kind: editRuleKind,
      boy_selectable: editRuleSelectable,
      icon: matchedIcon ? iconByCategory[matchedIcon] : (editRuleKind === 'malus' ? '⚠️' : '⭐'),
      color: matchedColor ? colorByCategory[matchedColor] : (editRuleKind === 'malus' ? 'rose' : 'orange'),
    })
    .eq('id', editRuleId);

  if (error) {
    console.error('Errore modifica regola', error);
    return;
  }

  await loadSupabaseData();
}

async function updateBoy() {
  const cleanName = editBoyName.trim();
  if (!editBoyId || !cleanName) return;

  const duplicateName = appState.users.some(
    user =>
      user.role === 'boy' &&
      user.id !== editBoyId &&
      user.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (duplicateName) return;

  const { error: boyError } = await supabase
    .from('boys')
    .update({ name: cleanName })
    .eq('id', editBoyId);

  if (boyError) {
    console.error('Errore modifica ragazzo', boyError);
    return;
  }

  const { error: requestsError } = await supabase
    .from('requests')
    .update({ user_name: cleanName })
    .eq('user_id', editBoyId);

  if (requestsError) {
    console.error('Errore aggiornamento richieste del ragazzo', requestsError);
    return;
  }

  await loadSupabaseData();
}

async function addManualOperatorEntry() {
  const user = appState.users.find(item => item.id === operatorTargetUserId);
  const rule = appState.rules.find(item => item.id === operatorRuleId);
  if (!user || !rule || !currentUser) return;

  const newRequest = {
    id: `req-${Date.now()}`,
    user_id: user.id,
    user_name: user.name,
    rule_id: rule.id,
    activity: rule.label,
    points: rule.points,
    status: 'approved',
    created_at: new Date().toISOString(),
    note: operatorNote,
    decided_by: currentUser.name,
  };

  const { error } = await supabase.from('requests').insert(newRequest);

  if (error) {
    console.error('Errore inserimento manuale', error);
    return;
  }

  setOperatorNote('');
  await loadSupabaseData();
  setScreen('operator-history');
}

  if (screen === 'landing') {
    const boys = appState.users.filter(user => user.role === 'boy');
    const operators = appState.users.filter(user => user.role === 'operator');

    return (
      <Shell title="Scegli l’accesso" subtitle="Web app demo con dati salvati in locale." onReset={resetDemo}>
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-orange-500 to-amber-400 text-white border-orange-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-orange-100">MasQueNada</div>
                <div className="text-3xl md:text-4xl font-black mt-1">Partecipa, aiuta, guadagna punti</div>
                <p className="mt-3 text-orange-50 max-w-2xl">
                  Una prima versione semplice per ragazzi e operatori: richieste punti, verifiche, storico e classifica.
                </p>
              </div>
              <div className="rounded-[24px] bg-white/15 backdrop-blur px-5 py-4 min-w-[220px]">
                <div className="text-sm text-orange-100">Profili demo</div>
                <div className="text-3xl font-black mt-1">{boys.length + operators.length}</div>
                <div className="text-sm text-orange-50 mt-1">ragazzi + operatori</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid xl:grid-cols-2 gap-6">
          <Card className="bg-orange-50 border-orange-200">
            <div className="text-5xl mb-4">🧑‍🤝‍🧑</div>
            <div className="text-2xl font-bold mb-2">Area Ragazzi</div>
            <p className="text-neutral-700 mb-5 text-base leading-6">Ogni ragazzo entra con il proprio profilo, invia attività e controlla punti e classifica.</p>
            <div className="grid gap-3">
              {boys.map(user => (
                <ActionButton key={user.id} onClick={() => loginAs(user.id)}>
                  <div className="text-lg font-bold">Entra come {user.name}</div>
                  <div className="text-sm text-neutral-600 mt-1">Profilo ragazzo</div>
                </ActionButton>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-50 border-slate-200">
            <div className="text-5xl mb-4">🧑‍🏫</div>
            <div className="text-2xl font-bold mb-2">Area Operatori</div>
            <p className="text-neutral-700 mb-5 text-base leading-6">Gli operatori verificano le richieste e possono aggiungere bonus o malus manualmente.</p>
            <div className="grid gap-3">
              {operators.map(user => (
                <ActionButton key={user.id} onClick={() => loginAs(user.id)} className="bg-slate-900 text-white border-slate-900 hover:bg-slate-800">
                  <div className="text-lg font-bold">Entra come {user.name}</div>
                  <div className="text-sm text-slate-300 mt-1">Profilo operatore</div>
                </ActionButton>
              ))}
            </div>
          </Card>
        </div>
      </Shell>
    );
  }

  if (screen === 'boy-home' && currentUser) {
    return (
      <Shell title={`Ciao, ${currentUser.name}!`} subtitle="Ogni aiuto vale punti." onBack={() => setScreen('landing')} onReset={resetDemo} currentUser={currentUser}>
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-orange-50 border-orange-200">
            <div className="text-sm text-neutral-600 mb-2 uppercase tracking-wider">I tuoi progressi</div>
            <div className="text-6xl font-black">{myPoints}</div>
            <div className="text-neutral-700 mt-2 text-lg">punti totali</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill className="bg-white">Posizione: {myPosition || '-'}</Pill>
              <Pill className="bg-white">Richieste in attesa: {myRequests.filter(request => request.status === 'pending').length}</Pill>
            </div>
          </Card>

          <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4">
            <ActionButton onClick={() => setScreen('boy-categories')} className="border-orange-200 bg-orange-50 hover:bg-orange-100">
              <div className="text-3xl mb-2">➕</div>
              <div className="font-bold">Aggiungi attività</div>
              <div className="text-sm text-neutral-600">Invia una richiesta punti</div>
            </ActionButton>
            <ActionButton onClick={() => setScreen('boy-leaderboard')} className="border-amber-200 bg-amber-50 hover:bg-amber-100">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-bold">Classifica</div>
              <div className="text-sm text-neutral-600">Guarda il gruppo</div>
            </ActionButton>
            <ActionButton onClick={() => setScreen('boy-requests')} className="border-sky-200 bg-sky-50 hover:bg-sky-100">
              <div className="text-3xl mb-2">📋</div>
              <div className="font-bold">Le mie richieste</div>
              <div className="text-sm text-neutral-600">Controlla lo stato</div>
            </ActionButton>
          </div>
        </div>
      </Shell>
    );
  }

  if (screen === 'boy-categories' && currentUser) {
    return (
      <Shell title="Scegli attività" subtitle="Tocca una categoria per continuare." onBack={() => setScreen('boy-home')} onReset={resetDemo} currentUser={currentUser}>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map(category => (
            <button
              key={category.key}
              type="button"
              onClick={() => {
                setSelectedCategory(category.key);
                setScreen('boy-items');
              }}
              className={`rounded-3xl border p-5 text-left shadow-sm hover:scale-[1.01] transition ${COLOR_STYLES[category.color] || ''}`}
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <div className="text-xl font-semibold">{category.label}</div>
              <div className="text-sm opacity-80 mt-1">{category.items.length} attività</div>
            </button>
          ))}
        </div>
      </Shell>
    );
  }

  if (screen === 'boy-items' && currentUser && selectedCategoryData) {
    return (
      <Shell title={selectedCategoryData.label} subtitle="Scegli cosa hai fatto." onBack={() => setScreen('boy-categories')} onReset={resetDemo} currentUser={currentUser}>
        <div className="grid gap-3 max-w-4xl">
          {selectedCategoryData.items.map(rule => (
            <ActionButton
              key={rule.id}
              onClick={() => {
                setSelectedRuleId(rule.id);
                setScreen('boy-confirm');
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">{rule.label}</div>
                  <div className="text-sm text-neutral-600">Richiesta da confermare dall’operatore</div>
                </div>
                <Pill className="bg-emerald-100 border-emerald-200 text-emerald-800">+{rule.points}</Pill>
              </div>
            </ActionButton>
          ))}
        </div>
      </Shell>
    );
  }

  if (screen === 'boy-confirm' && currentUser && selectedRule) {
    return (
      <Shell title="Conferma richiesta" subtitle="Controlla e invia." onBack={() => setScreen('boy-items')} onReset={resetDemo} currentUser={currentUser}>
        <div className="max-w-2xl">
          <Card>
            <div className="text-sm text-neutral-500">Attività selezionata</div>
            <div className="text-2xl font-semibold mt-1">{selectedRule.label}</div>
            <div className="mt-4 inline-flex rounded-full bg-emerald-100 text-emerald-800 px-4 py-2 font-semibold border border-emerald-200">
              Punti previsti: {selectedRule.points > 0 ? '+' : ''}{selectedRule.points}
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <ActionButton onClick={submitRequest} className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600">
                Invia richiesta
              </ActionButton>
              <ActionButton onClick={() => setScreen('boy-items')}>Annulla</ActionButton>
            </div>
          </Card>
        </div>
      </Shell>
    );
  }

  if (screen === 'boy-requests' && currentUser) {
    return (
      <Shell title="Le mie richieste" subtitle="Stato delle attività inviate." onBack={() => setScreen('boy-home')} onReset={resetDemo} currentUser={currentUser}>
        <div className="grid gap-3 max-w-4xl">
          {myRequests.length === 0 && <Card>Nessuna richiesta inviata.</Card>}
          {myRequests.map(request => (
            <Card key={request.id} className={STATUS_STYLES[request.status] || ''}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-lg">{request.activity}</div>
                  <div className="text-sm opacity-80 mt-1">{formatDate(request.createdAt)}</div>
                  {request.note && <div className="text-sm mt-2">Nota: {request.note}</div>}
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  <Pill className={STATUS_STYLES[request.status] || 'bg-white'}>{getStatusLabel(request)}</Pill>
                  {request.decidedBy && <div className="text-xs opacity-70">da {request.decidedBy}</div>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Shell>
    );
  }

  if (screen === 'boy-leaderboard' && currentUser) {
    return (
      <Shell title="Classifica" subtitle="Punteggio totale demo." onBack={() => setScreen('boy-home')} onReset={resetDemo} currentUser={currentUser}>
        <div className="max-w-4xl grid gap-3">
          {leaderboard.map((item, index) => (
            <Card key={item.id} className={item.id === currentUser.id ? 'border-orange-300 bg-orange-50 shadow-lg' : ''}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-lg">{index + 1}</div>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    {item.id === currentUser.id && <div className="text-sm text-neutral-600">Questo sei tu</div>}
                  </div>
                </div>
                <div className="text-2xl font-black text-orange-600">{item.points}</div>
              </div>
            </Card>
          ))}
        </div>
      </Shell>
    );
  }

  if (screen === 'operator-login' && currentUser) {
  return (
    <Shell
      title="Accesso Operatore"
      subtitle="Inserisci la password per continuare."
      onBack={() => setScreen('landing')}
      currentUser={currentUser}
    >
      <div className="max-w-xl">
        <Card>
          <div className="text-lg font-bold mb-3">Password operatore</div>
          <input
            type="password"
            value={operatorPasswordInput}
            onChange={event => setOperatorPasswordInput(event.target.value)}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
            placeholder="Inserisci la password"
          />
          <div className="mt-4">
            <button
              onClick={submitOperatorPassword}
              className="rounded-2xl px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm"
            >
              Entra
            </button>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

  if (screen === 'operator-home' && currentUser && operatorAccessGranted) {
    return (
      <Shell title="Area Operatori" subtitle="Controllo rapido delle attività." onBack={logoutOperator} onReset={resetDemo} currentUser={currentUser}>
        <div className="grid lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 text-white lg:col-span-1">
            <div className="text-sm text-slate-300 uppercase tracking-wider">Richieste in attesa</div>
            <div className="text-6xl font-black mt-2">{pendingRequests.length}</div>
            <div className="text-sm text-slate-300 mt-2">Da controllare adesso</div>
          </Card>
          <ActionButton onClick={() => setScreen('operator-requests')}>
            <div className="text-3xl mb-2">✅</div>
            <div className="font-semibold">Verifica richieste</div>
            <div className="text-sm text-neutral-600">Approva, modifica o rifiuta</div>
          </ActionButton>
          <ActionButton onClick={() => setScreen('operator-manual')}>
            <div className="text-3xl mb-2">✍️</div>
            <div className="font-semibold">Aggiungi bonus / malus</div>
            <div className="text-sm text-neutral-600">Inserimento manuale</div>
          </ActionButton>
          <ActionButton onClick={() => setScreen('operator-history')}>
            <div className="text-3xl mb-2">🕘</div>
            <div className="font-semibold">Storico</div>
            <div className="text-sm text-neutral-600">Tutti i movimenti</div>
          </ActionButton>
        </div>
      </Shell>
    );
  }

  if (screen === 'operator-requests' && currentUser && operatorAccessGranted) {
    return (
      <Shell title="Richieste da verificare" subtitle="Conferma le attività inviate dai ragazzi." onBack={() => setScreen('operator-home')} onReset={resetDemo} currentUser={currentUser}>
        <div className="grid gap-3">
          {pendingRequests.length === 0 && <Card>Nessuna richiesta in attesa.</Card>}
          {pendingRequests.map(request => (
            <Card key={request.id}>
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Pill className="bg-orange-50 border-orange-200 text-orange-700">{request.userName}</Pill>
                    <Pill className="bg-emerald-50 border-emerald-200 text-emerald-700">
                      {request.points > 0 ? '+' : ''}{request.points} punti
                    </Pill>
                  </div>
                  <div className="text-xl font-bold">{request.activity}</div>
                  <div className="text-sm text-neutral-600 mt-1">{formatDate(request.createdAt)}</div>
                </div>
                <div className="flex flex-wrap gap-2 xl:max-w-md">
                  <button onClick={() => decideRequest(request.id, 'approve')} className="rounded-2xl px-4 py-2 bg-emerald-600 text-white font-semibold shadow-sm">
                    Approva
                  </button>
                  <button onClick={() => startModify(request)} className="rounded-2xl px-4 py-2 bg-sky-600 text-white font-semibold shadow-sm">
                    Modifica
                  </button>
                  <button onClick={() => decideRequest(request.id, 'reject')} className="rounded-2xl px-4 py-2 bg-rose-600 text-white font-semibold shadow-sm">
                    Rifiuta
                  </button>
                </div>
              </div>
              {modifyDraft.requestId === request.id && (
                <div className="mt-4 border-t pt-4 grid md:grid-cols-[140px_1fr_auto] gap-3 items-end">
                  <div>
                    <label className="text-sm text-neutral-600">Punti finali</label>
                    <input
                      value={modifyDraft.finalPoints}
                      onChange={event => setModifyDraft(previous => ({ ...previous, finalPoints: event.target.value }))}
                      className="mt-1 w-full rounded-2xl border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600">Nota</label>
                    <input
                      value={modifyDraft.note}
                      onChange={event => setModifyDraft(previous => ({ ...previous, note: event.target.value }))}
                      className="mt-1 w-full rounded-2xl border px-3 py-2"
                    />
                  </div>
                  <button onClick={saveModify} className="rounded-2xl px-4 py-2 bg-slate-900 text-white">Salva modifica</button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Shell>
    );
  }

  if (screen === 'operator-manual' && currentUser && operatorAccessGranted) {
    const operatorRules = appState.rules.filter(rule => !rule.boySelectable || rule.kind === 'bonus');
    const boys = appState.users.filter(user => user.role === 'boy');
    return (
      <Shell title="Aggiunta manuale punti" subtitle="Per bonus e malus decisi dagli operatori." onBack={() => setScreen('operator-home')} onReset={resetDemo} currentUser={currentUser}>
        <div className="max-w-3xl">
          <Card>
            <div className="mb-6 pb-6 border-b border-neutral-200">
              <div className="text-lg font-bold mb-3">Aggiungi un ragazzo</div>
              <div className="grid md:grid-cols-[1fr_auto] gap-3">
                <input
                  value={newBoyName}
                  onChange={event => setNewBoyName(event.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  placeholder="Scrivi il nome del ragazzo"
                />
                <button
                  onClick={addNewBoy}
                  className="rounded-2xl px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Aggiungi ragazzo
                </button>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-neutral-200">
              <div className="text-lg font-bold mb-3">Elimina un ragazzo</div>
              <div className="grid md:grid-cols-[1fr_auto] gap-3">
                <select
                  value={deleteBoyId}
                  onChange={event => setDeleteBoyId(event.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                >
                  <option value="">Seleziona un ragazzo</option>
                  {appState.users
                    .filter(user => user.role === 'boy')
                    .map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>

                <button
                  onClick={deleteBoy}
                  className="rounded-2xl px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
                >
                  Elimina ragazzo
                </button>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="text-lg font-bold mb-3">Modifica un ragazzo</div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700">Ragazzo da modificare</label>
                <select
                  value={editBoyId}
                  onChange={event => setEditBoyId(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                >
                  {appState.users
                    .filter(user => user.role === 'boy')
                    .map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700">Nuovo nome</label>
                <input
                  value={editBoyName}
                  onChange={event => setEditBoyName(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                />
              </div>

              <div>
                <button
                  onClick={updateBoy}
                  className="rounded-2xl px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-sm"
                >
                  Salva modifica ragazzo
                </button>
              </div>
            </div>
          </div>
                  
            <div className="mb-6 pb-6 border-b border-neutral-200">
              <div className="text-lg font-bold mb-3">Aggiungi una regola</div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-neutral-700">Categoria</label>
                  <input
                    value={newRuleCategory}
                    onChange={event => setNewRuleCategory(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                    placeholder="Es. Pulizia, Pranzo, Laboratori..."
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700">Etichetta</label>
                  <input
                    value={newRuleLabel}
                    onChange={event => setNewRuleLabel(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                    placeholder="Es. Ho sistemato gli scaffali"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700">Punti</label>
                  <input
                    value={newRulePoints}
                    onChange={event => setNewRulePoints(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                    placeholder="Es. 3 oppure -5"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700">Tipo</label>
                  <select
                    value={newRuleKind}
                    onChange={event => setNewRuleKind(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                  >
                    <option value="bonus">Bonus</option>
                    <option value="malus">Malus</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <input
                  id="boySelectable"
                  type="checkbox"
                  checked={newRuleSelectable}
                  onChange={event => setNewRuleSelectable(event.target.checked)}
                />
                <label htmlFor="boySelectable" className="text-sm font-semibold text-neutral-700">
                  Selezionabile dai ragazzi
                </label>
              </div>

              <div className="mt-4">
                <button
                  onClick={addNewRule}
                  className="rounded-2xl px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-sm"
                >
                  Aggiungi regola
                </button>
              </div>
            </div>
            
            <div className="mb-6 pb-6 border-b border-neutral-200">
              <div className="text-lg font-bold mb-3">Elimina una regola</div>
              <div className="grid md:grid-cols-[1fr_auto] gap-3">
                <select
                  value={deleteRuleId}
                  onChange={event => setDeleteRuleId(event.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                >
                  <option value="">Seleziona una regola</option>
                  {appState.rules.map(rule => (
                    <option key={rule.id} value={rule.id}>
                      {rule.category} — {rule.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={deleteRule}
                  className="rounded-2xl px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
                >
                  Elimina regola
                </button>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="text-lg font-bold mb-3">Modifica una regola</div>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700">Regola da modificare</label>
                <select
                  value={editRuleId}
                  onChange={event => setEditRuleId(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                >
                  {appState.rules.map(rule => (
                    <option key={rule.id} value={rule.id}>
                      {rule.category} — {rule.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-neutral-700">Categoria</label>
                  <input
                    value={editRuleCategory}
                    onChange={event => setEditRuleCategory(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700">Etichetta</label>
                  <input
                    value={editRuleLabel}
                    onChange={event => setEditRuleLabel(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700">Punti</label>
                  <input
                    value={editRulePoints}
                    onChange={event => setEditRulePoints(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-neutral-700">Tipo</label>
                  <select
                    value={editRuleKind}
                    onChange={event => setEditRuleKind(event.target.value)}
                    className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                  >
                    <option value="bonus">Bonus</option>
                    <option value="malus">Malus</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="editRuleSelectable"
                  type="checkbox"
                  checked={editRuleSelectable}
                  onChange={event => setEditRuleSelectable(event.target.checked)}
                />
                <label htmlFor="editRuleSelectable" className="text-sm font-semibold text-neutral-700">
                  Selezionabile dai ragazzi
                </label>
              </div>

              <div>
                <button
                  onClick={updateRule}
                  className="rounded-2xl px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-sm"
                >
                  Salva modifica regola
                </button>
              </div>
            </div>
          </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-neutral-700">Ragazzo</label>
                <select
                  value={operatorTargetUserId}
                  onChange={event => setOperatorTargetUserId(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                >
                  {boys.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-neutral-700">Voce</label>
                <select
                  value={operatorRuleId}
                  onChange={event => setOperatorRuleId(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 bg-white shadow-sm"
                >
                  {operatorRules.map(rule => (
                    <option key={rule.id} value={rule.id}>
                      {rule.category} — {rule.label} ({rule.points > 0 ? '+' : ''}{rule.points})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-semibold text-neutral-700">Nota facoltativa</label>
              <input
                value={operatorNote}
                onChange={event => setOperatorNote(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 shadow-sm"
                placeholder="Es. controllo entrata, comportamento, partecipazione parziale..."
              />
            </div>
            <div className="mt-6">
              <button onClick={addManualOperatorEntry} className="rounded-2xl px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm">
                Salva movimento
              </button>
            </div>
          </Card>
        </div>
      </Shell>
    );
  }

  if (screen === 'operator-history' && currentUser && operatorAccessGranted) {
    const history = [...appState.requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return (
      <Shell title="Storico" subtitle="Ultimi movimenti registrati." onBack={() => setScreen('operator-home')} onReset={resetDemo} currentUser={currentUser}>
        <div className="grid gap-3">
          {history.map(request => {
            const displayedPoints = getRequestPoints(request);
            return (
              <Card key={request.id}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-neutral-500">{request.userName} · {formatDate(request.createdAt)}</div>
                    <div className="font-semibold">{request.activity}</div>
                    {request.note && <div className="text-sm text-neutral-600">Nota: {request.note}</div>}
                    {request.decidedBy && <div className="text-xs text-neutral-500 mt-1">Gestito da {request.decidedBy}</div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Pill className={STATUS_STYLES[request.status] || 'bg-white'}>{getStatusLabel(request)}</Pill>
                    <div className={`font-bold text-lg ${displayedPoints >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {displayedPoints > 0 ? '+' : ''}{displayedPoints}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Shell>
    );
  }

  return null;
}
