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

export function getInitials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('');
}

export function getRequestPoints(request, rules = []) {
  if (request.finalPoints !== null && request.finalPoints !== undefined && request.finalPoints !== '') {
    const finalPoints = Number(request.finalPoints);
    if (Number.isFinite(finalPoints)) return finalPoints;
  }

  if (request.points !== null && request.points !== undefined && request.points !== '') {
    const directPoints = Number(request.points);
    if (Number.isFinite(directPoints)) return directPoints;
  }

  const rule = rules.find(item => item.id === request.ruleId);
  if (rule) {
    const rulePoints = Number(rule.points);
    if (Number.isFinite(rulePoints)) return rulePoints;
  }

  return 0;
}

export function getStatusLabel(request, rules = []) {
  const points = getRequestPoints(request, rules);

  if (request.status === 'approved') return `Approvata ${points > 0 ? '+' : ''}${points}`;
  if (request.status === 'modified') return `Modificata ${points > 0 ? '+' : ''}${points}`;
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

export function computeLeaderboard(users, requests, rules = []) {
  const boys = users.filter(user => user.role === 'boy');

  return boys
    .map(user => {
      const points = requests
        .filter(
          request =>
            request.userId === user.id &&
            ['approved', 'modified'].includes(request.status)
        )
        .reduce((sum, request) => sum + getRequestPoints(request, rules), 0);

      return {
        id: user.id,
        name: user.name,
        avatar_url: user.avatar_url || '',
        avatar_key: user.avatar_key || '',
        points,
      };
    })
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name, 'it'));
}