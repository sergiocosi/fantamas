export const DEFAULT_USERS = [
  { id: 'marco', name: 'Marco', role: 'boy' },
  { id: 'sara', name: 'Sara', role: 'boy' },
  { id: 'luca', name: 'Luca', role: 'boy' },
  { id: 'giulia', name: 'Giulia', role: 'boy' },
  { id: 'operatore-1', name: 'Operatore', role: 'operator' },
];

export const DEFAULT_RULES = [
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

export const DEFAULT_REQUESTS = [
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

export const COLOR_STYLES = {
  sky: 'bg-sky-100 text-sky-900 border-sky-200',
  orange: 'bg-orange-100 text-orange-900 border-orange-200',
  emerald: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  amber: 'bg-amber-100 text-amber-900 border-amber-200',
  cyan: 'bg-cyan-100 text-cyan-900 border-cyan-200',
  violet: 'bg-violet-100 text-violet-900 border-violet-200',
  teal: 'bg-teal-100 text-teal-900 border-teal-200',
  rose: 'bg-rose-100 text-rose-900 border-rose-200',
};

export const STATUS_STYLES = {
  pending: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  approved: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  modified: 'bg-sky-50 border-sky-200 text-sky-800',
  rejected: 'bg-rose-50 border-rose-200 text-rose-800',
};

export function formatDate(value) {
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

export function getRequestPoints(request) {
  return typeof request.finalPoints === 'number' ? request.finalPoints : request.points;
}

export function getStatusLabel(request) {
  if (request.status === 'approved') return `Approvata ${getRequestPoints(request) > 0 ? '+' : ''}${getRequestPoints(request)}`;
  if (request.status === 'modified') return `Modificata ${getRequestPoints(request) > 0 ? '+' : ''}${getRequestPoints(request)}`;
  if (request.status === 'rejected') return 'Rifiutata';
  return 'In attesa';
}

export function groupRules(rules) {
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

export function computeLeaderboard(users, requests) {
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

export function runSelfChecks() {
  console.assert(DEFAULT_USERS.some(user => user.role === 'operator'), 'Serve almeno un operatore');
  console.assert(DEFAULT_RULES.some(rule => rule.boySelectable), 'Serve almeno una regola selezionabile dai ragazzi');
  console.assert(DEFAULT_RULES.some(rule => rule.kind === 'malus'), 'Serve almeno un malus');
  console.assert(computeLeaderboard(DEFAULT_USERS, DEFAULT_REQUESTS).length >= 1, 'La classifica deve essere calcolabile');
}