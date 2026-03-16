import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'fantamas-app-v1';

const DEFAULT_USERS = [
  { id: 'marco', name: 'Marco', role: 'boy' },
  { id: 'sara', name: 'Sara', role: 'boy' },
  { id: 'luca', name: 'Luca', role: 'boy' },
  { id: 'giulia', name: 'Giulia', role: 'boy' },
  { id: 'operatore-1', name: 'Operatore', role: 'operator' },
];

const DEFAULT_RULES = [
  { id: 'pulizia-stanza', category: 'Pulizia', label: 'Ho pulito una stanza', points: 5, kind: 'bonus', boySelectable: true, icon: '🧹', color: 'sky' },
  { id: 'pulizia-tavoli', category: 'Pulizia', label: 'Ho pulito i tavoli', points: 2, kind: 'bonus', boySelectable: true, icon: '🧹', color: 'sky' },
  { id: 'pranzo-menu', category: 'Pranzo', label: 'Ho scritto il menù', points: 3, kind: 'bonus', boySelectable: true, icon: '🍽️', color: 'orange' },
  { id: 'pranzo-ordini', category: 'Pranzo', label: 'Ho raccolto gli ordini', points: 2, kind: 'bonus', boySelectable: true, icon: '🍽️', color: 'orange' },
  { id: 'pranzo-ritiro', category: 'Pranzo', label: 'Ho ritirato il pranzo', points: 3, kind: 'bonus', boySelectable: true, icon: '🍽️', color: 'orange' },
  { id: 'pranzo-apparecchiare', category: 'Pranzo', label: 'Ho apparecchiato', points: 1, kind: 'bonus', boySelectable: true, icon: '🍽️', color: 'orange' },
  { id: 'pranzo-sparecchiare', category: 'Pranzo', label: 'Ho sparecchiato', points: 1, kind: 'bonus', boySelectable: true, icon: '🍽️', color: 'orange' },
  { id: 'rifiuti-svuotare', category: 'Rifiuti', label: 'Ho svuotato i rifiuti', points: 2, kind: 'bonus', boySelectable: true, icon: '♻️', color: 'emerald' },
  { id: 'rifiuti-portare', category: 'Rifiuti', label: 'Ho portato via i rifiuti', points: 3, kind: 'bonus', boySelectable: true, icon: '♻️', color: 'emerald' },
  { id: 'rifiuti-sacchi', category: 'Rifiuti', label: 'Ho rimesso i sacchi', points: 1, kind: 'bonus', boySelectable: true, icon: '♻️', color: 'emerald' },
  { id: 'cucina-partecipazione', category: 'Cucina', label: 'Ho partecipato in cucina', points: 2, kind: 'bonus', boySelectable: true, icon: '🍳', color: 'amber' },
  { id: 'cucina-pulizia', category: 'Cucina', label: 'Ho aiutato a pulire', points: 2, kind: 'bonus', boySelectable: true, icon: '🍳', color: 'amber' },
  { id: 'uscita-partecipazione', category: 'Uscite / Spesa', label: 'Ho partecipato all’uscita', points: 2, kind: 'bonus', boySelectable: true, icon: '🛒', color: 'cyan' },
  { id: 'lab-laboratorio', category: 'Didattica / Podcast / Laboratori', label: 'Ho partecipato al laboratorio', points: 4, kind: 'bonus', boySelectable: true, icon: '🎙️', color: 'violet' },
  { id: 'lab-podcast', category: 'Didattica / Podcast / Laboratori', label: 'Ho partecipato al podcast', points: 4, kind: 'bonus', boySelectable: true, icon: '🎙️', color: 'violet' },
  { id: 'cura-entrata-ok', category: 'Cura personale', label: 'Controllo entrata positivo', points: 5, kind: 'bonus', boySelectable: false, icon: '👕', color: 'teal' },
  { id: 'cura-sporco', category: 'Cura personale', label: 'Sporco o disordinato', points: -5, kind: 'malus', boySelectable: false, icon: '👕', color: 'teal' },
  { id: 'cura-molto-sporco', category: 'Cura personale', label: 'Molto sporco / cattivo odore', points: -10, kind: 'malus', boySelectable: false, icon: '👕', color: 'teal' },
  { id: 'acqua-terra', category: 'Attenzione attività', label: 'Acqua a terra', points: -5, kind: 'malus', boySelectable: false, icon: '⚠️', color: 'rose' },
  { id: 'rifiuto-partecipare', category: 'Didattica / Podcast / Laboratori', label: 'Rifiuto di partecipare', points: -5, kind: 'malus', boySelectable: false, icon: '⛔', color: 'rose' },
];

const DEFAULT_REQUESTS = [
  {
    id: 'req-1',
    userId: 'marco',
    userName: 'Marco',
    ruleId: 'lab-laboratorio',
    activity: 'Ho partecipato al laboratorio',
    points: 4,
    status: 'pending',
    createdAt: '2026-03-13T09:00:00.000Z',
    note: '',
    decidedBy: '',
  },
  {
    id: 'req-2',
    userId: 'sara',
    userName: 'Sara',
    ruleId: 'pranzo-apparecchiare',
    activity: 'Ho apparecchiato',
    points: 1,
    status: 'approved',
    createdAt: '2026-03-13T09:10:00.000Z',
    note: '',
    decidedBy: 'Operatore',
  },
  {
    id: 'req-3',
    userId: 'luca',
    userName: 'Luca',
    ruleId: 'pulizia-tavoli',
    activity: 'Ho pulito i tavoli',
    points: 2,
    finalPoints: 1,
    status: 'modified',
    createdAt: '2026-03-13T09:20:00.000Z',
    note: 'Fatto a metà',
    decidedBy: 'Operatore',
  },
];

const COLOR_STYLES = {
  sky: 'bg-sky-100 text-sky-900 border-sky-200',
  orange: 'bg-orange-100 text-orange-900 border-orange-200',
  emerald: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  amber: 'bg-amber-100 text-amber-900 border-amber-200',
  cyan: 'bg-cyan-100 text-cyan-900 border-cyan-200',
  violet: 'bg-violet-100 text-violet-900 border-violet-200',
  teal: 'bg-teal-100 text-teal-900 border-teal-200',
  rose: 'bg-rose-100 text-rose-900 border-rose-200',
};

const STATUS_STYLES = {
  pending: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  approved: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  modified: 'bg-sky-50 border-sky-200 text-sky-800',
  rejected: 'bg-rose-50 border-rose-200 text-rose-800',
};

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

function formatDate(value) {
  try {
    return new Date(value).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function getRequestPoints(request) {
  return typeof request.finalPoints === 'number' ? request.finalPoints : request.points;
}

function getStatusLabel(request) {
  if (request.status === 'approved') return `Approvata ${getRequestPoints(request) > 0 ? '+' : ''}${getRequestPoints(request)}`;
  if (request.status === 'modified') return `Modificata ${getRequestPoints(request) > 0 ? '+' : ''}${getRequestPoints(request)}`;
  if (request.status === 'rejected') return 'Rifiutata';
  return 'In attesa';
}

function groupRules(rules) {
  const selectable = rules.filter(rule => rule.boySelectable);
  return selectable.reduce((acc, rule) => {
    const key = rule.category;
    if (!acc[key]) {
      acc[key] = {
        key,
        label: key,
        icon: rule.icon,
        color: rule.color,
        items: [],
      };
    }
    acc[key].items.push(rule);
    return acc;
  }, {});
}

function computeLeaderboard(users, requests) {
  const boys = users.filter(user => user.role === 'boy');
  return boys
    .map(user => {
      const points = requests
        .filter(request => request.userId === user.id && ['approved', 'modified'].includes(request.status))
        .reduce((sum, request) => sum + getRequestPoints(request), 0);
      return { id: user.id, name: user.name, points };
    })
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name, 'it'));
}

function runSelfChecks() {
  console.assert(DEFAULT_USERS.some(user => user.role === 'operator'), 'Serve almeno un operatore');
  console.assert(DEFAULT_RULES.some(rule => rule.boySelectable), 'Serve almeno una regola selezionabile dai ragazzi');
  console.assert(DEFAULT_RULES.some(rule => rule.kind === 'malus'), 'Serve almeno un malus');
  console.assert(computeLeaderboard(DEFAULT_USERS, DEFAULT_REQUESTS).length >= 1, 'La classifica deve essere calcolabile');
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

export default function FantaMasMockup() {
  const [appState, setAppState] = useState(() => loadState() || {
    users: DEFAULT_USERS,
    rules: DEFAULT_RULES,
    requests: DEFAULT_REQUESTS,
  });
  const [screen, setScreen] = useState('landing');
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [operatorTargetUserId, setOperatorTargetUserId] = useState('marco');
  const [operatorRuleId, setOperatorRuleId] = useState('rifiuto-partecipare');
  const [operatorNote, setOperatorNote] = useState('');
  const [modifyDraft, setModifyDraft] = useState({ requestId: '', finalPoints: '', note: '' });

  useEffect(() => {
    runSelfChecks();
  }, []);

  useEffect(() => {
    saveState(appState);
  }, [appState]);

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
    setCurrentUserId(userId);
    setScreen(user.role === 'operator' ? 'operator-home' : 'boy-home');
  }

  function submitRequest() {
    if (!currentUser || !selectedRule) return;
    const newRequest = {
      id: `req-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      ruleId: selectedRule.id,
      activity: selectedRule.label,
      points: selectedRule.points,
      status: 'pending',
      createdAt: new Date().toISOString(),
      note: '',
      decidedBy: '',
    };
    setAppState(previous => ({ ...previous, requests: [newRequest, ...previous.requests] }));
    setSelectedCategory('');
    setSelectedRuleId('');
    setScreen('boy-requests');
  }

  function decideRequest(requestId, action) {
    if (!currentUser) return;
    setAppState(previous => ({
      ...previous,
      requests: previous.requests.map(request => {
        if (request.id !== requestId || request.status !== 'pending') return request;
        if (action === 'approve') {
          return { ...request, status: 'approved', decidedBy: currentUser.name, note: '' };
        }
        if (action === 'reject') {
          return { ...request, status: 'rejected', decidedBy: currentUser.name, note: 'Non confermato' };
        }
        return request;
      }),
    }));
  }

  function startModify(request) {
    setModifyDraft({ requestId: request.id, finalPoints: String(Math.max(1, request.points - 1)), note: request.note || 'Partecipazione parziale' });
  }

  function saveModify() {
    if (!modifyDraft.requestId || !currentUser) return;
    const parsedPoints = Number(modifyDraft.finalPoints);
    if (Number.isNaN(parsedPoints)) return;
    setAppState(previous => ({
      ...previous,
      requests: previous.requests.map(request => {
        if (request.id !== modifyDraft.requestId || request.status !== 'pending') return request;
        return {
          ...request,
          status: 'modified',
          finalPoints: parsedPoints,
          note: modifyDraft.note,
          decidedBy: currentUser.name,
        };
      }),
    }));
    setModifyDraft({ requestId: '', finalPoints: '', note: '' });
  }

  function addManualOperatorEntry() {
    const user = appState.users.find(item => item.id === operatorTargetUserId);
    const rule = appState.rules.find(item => item.id === operatorRuleId);
    if (!user || !rule || !currentUser) return;
    const newRequest = {
      id: `req-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      ruleId: rule.id,
      activity: rule.label,
      points: rule.points,
      status: 'approved',
      createdAt: new Date().toISOString(),
      note: operatorNote,
      decidedBy: currentUser.name,
    };
    setAppState(previous => ({ ...previous, requests: [newRequest, ...previous.requests] }));
    setOperatorNote('');
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
            <ActionButton onClick={() => setScreen('boy-categories')}>
              <div className="text-3xl mb-2">➕</div>
              <div className="font-semibold">Aggiungi attività</div>
              <div className="text-sm text-neutral-600">Invia una richiesta punti</div>
            </ActionButton>
            <ActionButton onClick={() => setScreen('boy-leaderboard')}>
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-semibold">Classifica</div>
              <div className="text-sm text-neutral-600">Guarda il gruppo</div>
            </ActionButton>
            <ActionButton onClick={() => setScreen('boy-requests')}>
              <div className="text-3xl mb-2">📋</div>
              <div className="font-semibold">Le mie richieste</div>
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
                  <div className="font-semibold">{request.activity}</div>
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
            <Card key={item.id} className={item.id === currentUser.id ? 'border-orange-300 bg-orange-50' : ''}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold">{index + 1}</div>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    {item.id === currentUser.id && <div className="text-sm text-neutral-600">Questo sei tu</div>}
                  </div>
                </div>
                <div className="text-xl font-bold">{item.points}</div>
              </div>
            </Card>
          ))}
        </div>
      </Shell>
    );
  }

  if (screen === 'operator-home' && currentUser) {
    return (
      <Shell title="Area Operatori" subtitle="Controllo rapido delle attività." onBack={() => setScreen('landing')} onReset={resetDemo} currentUser={currentUser}>
        <div className="grid lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 text-white lg:col-span-1">
            <div className="text-sm text-slate-300">Richieste in attesa</div>
            <div className="text-5xl font-bold mt-2">{pendingRequests.length}</div>
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

  if (screen === 'operator-requests' && currentUser) {
    return (
      <Shell title="Richieste da verificare" subtitle="Conferma le attività inviate dai ragazzi." onBack={() => setScreen('operator-home')} onReset={resetDemo} currentUser={currentUser}>
        <div className="grid gap-3">
          {pendingRequests.length === 0 && <Card>Nessuna richiesta in attesa.</Card>}
          {pendingRequests.map(request => (
            <Card key={request.id}>
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-neutral-500">{request.userName}</div>
                  <div className="text-xl font-semibold">{request.activity}</div>
                  <div className="text-sm text-neutral-600 mt-1">{formatDate(request.createdAt)} · punti proposti: {request.points > 0 ? '+' : ''}{request.points}</div>
                </div>
                <div className="flex flex-wrap gap-2 xl:max-w-md">
                  <button onClick={() => decideRequest(request.id, 'approve')} className="rounded-2xl px-4 py-2 bg-emerald-600 text-white">Approva</button>
                  <button onClick={() => startModify(request)} className="rounded-2xl px-4 py-2 bg-sky-600 text-white">Modifica</button>
                  <button onClick={() => decideRequest(request.id, 'reject')} className="rounded-2xl px-4 py-2 bg-rose-600 text-white">Rifiuta</button>
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

  if (screen === 'operator-manual' && currentUser) {
    const operatorRules = appState.rules.filter(rule => !rule.boySelectable || rule.kind === 'bonus');
    const boys = appState.users.filter(user => user.role === 'boy');
    return (
      <Shell title="Aggiunta manuale punti" subtitle="Per bonus e malus decisi dagli operatori." onBack={() => setScreen('operator-home')} onReset={resetDemo} currentUser={currentUser}>
        <div className="max-w-3xl">
          <Card>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-600">Ragazzo</label>
                <select value={operatorTargetUserId} onChange={event => setOperatorTargetUserId(event.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-3 bg-white">
                  {boys.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-600">Voce</label>
                <select value={operatorRuleId} onChange={event => setOperatorRuleId(event.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-3 bg-white">
                  {operatorRules.map(rule => (
                    <option key={rule.id} value={rule.id}>{rule.category} — {rule.label} ({rule.points > 0 ? '+' : ''}{rule.points})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm text-neutral-600">Nota facoltativa</label>
              <input value={operatorNote} onChange={event => setOperatorNote(event.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-3" placeholder="Es. controllo entrata, comportamento, partecipazione parziale..." />
            </div>
            <div className="mt-6">
              <button onClick={addManualOperatorEntry} className="rounded-2xl px-5 py-3 bg-slate-900 text-white">Salva movimento</button>
            </div>
          </Card>
        </div>
      </Shell>
    );
  }

  if (screen === 'operator-history' && currentUser) {
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
                    <Pill className={STATUS_STYLES[request.status] || 'bg-white'}>{request.status}</Pill>
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
