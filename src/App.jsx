import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import {
  COLOR_STYLES,
  STATUS_STYLES,
  formatDate,
  getRequestPoints,
  getStatusLabel,
  groupRules,
  computeLeaderboard,
  runSelfChecks,
} from './utils/appHelpers';

import LandingScreen from './components/screens/LandingScreen';
import OperatorLoginScreen from './components/screens/OperatorLoginScreen';
import OperatorHomeScreen from './components/screens/OperatorHomeScreen';
import OperatorHistoryScreen from './components/screens/OperatorHistoryScreen';
import OperatorRequestsScreen from './components/screens/OperatorRequestsScreen';
import OperatorManualScreen from './components/screens/OperatorManualScreen';
import BoyHomeScreen from './components/screens/BoyHomeScreen';
import BoyRequestsScreen from './components/screens/BoyRequestsScreen';
import BoyLeaderboardScreen from './components/screens/BoyLeaderboardScreen';
import BoyCategoriesScreen from './components/screens/BoyCategoriesScreen';
import BoyItemsScreen from './components/screens/BoyItemsScreen';
import BoyConfirmScreen from './components/screens/BoyConfirmScreen';
import BoyLoginScreen from './components/screens/BoyLoginScreen';
import BoyChangePasswordScreen from './components/screens/BoyChangePasswordScreen';
import VisitorLoginScreen from './components/screens/VisitorLoginScreen';
import VisitorHomeScreen from './components/screens/VisitorHomeScreen';
import VisitorRulesScreen from './components/screens/VisitorRulesScreen';
import VisitorHowItWorksScreen from './components/screens/VisitorHowItWorksScreen';
import BoyAvatarScreen from './components/screens/BoyAvatarScreen';

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
  const [boyPasswordInput, setBoyPasswordInput] = useState('');
  const [boyAccessGranted, setBoyAccessGranted] = useState(false);
  const [passwordBoyId, setPasswordBoyId] = useState('');
  const [newBoyPassword, setNewBoyPassword] = useState('');
  const [currentBoyPasswordInput, setCurrentBoyPasswordInput] = useState('');
  const [newBoyPasswordInput, setNewBoyPasswordInput] = useState('');
  const [confirmBoyPasswordInput, setConfirmBoyPasswordInput] = useState('');
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
  const [operatorUsernameInput, setOperatorUsernameInput] = useState('');
  const [operatorAccessGranted, setOperatorAccessGranted] = useState(false);
  const [currentOperator, setCurrentOperator] = useState(null);
  const currentBoy = useMemo(
  () => appState.users.find(user => user.id === currentUserId) || null,
  [appState.users, currentUserId]
);
  const [visitorUsernameInput, setVisitorUsernameInput] = useState('');
  const [visitorPasswordInput, setVisitorPasswordInput] = useState('');
  const [visitorAccessGranted, setVisitorAccessGranted] = useState(false);
  const [currentVisitor, setCurrentVisitor] = useState(null);
  const [selectedAvatarKey, setSelectedAvatarKey] = useState('');
  // const [currentUser, setCurrentUser] = useState(null);

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
    users: (boysData || []).map(user => ({
      id: user.id,
      name: user.name,
      role: user.role,
      password: user.password || '',
      avatar_url: user.avatar_url || '',
      avatar_key: user.avatar_key || '',
    })),
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
  const boys = appState.users.filter(user => user.role === 'boy');

  if (!passwordBoyId && boys.length > 0) {
    setPasswordBoyId(boys[0].id);
  }
}, [appState.users, passwordBoyId]);

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

  const currentUser = useMemo(() => {
    if (boyAccessGranted && currentBoy) return currentBoy;
    if (operatorAccessGranted && currentOperator) return currentOperator;
    if (visitorAccessGranted && currentVisitor) return currentVisitor;
    return currentBoy || currentOperator || currentVisitor || null;
  }, [
    boyAccessGranted,
    currentBoy,
    operatorAccessGranted,
    currentOperator,
    visitorAccessGranted,
    currentVisitor,
  ]);
  const categories = useMemo(() => Object.values(groupRules(appState.rules)), [appState.rules]);
  const selectedCategoryData = categories.find(category => category.key === selectedCategory) || null;
  const selectedRule = appState.rules.find(rule => rule.id === selectedRuleId) || null;
  const leaderboard = useMemo(() => computeLeaderboard(appState.users, appState.requests), [appState.users, appState.requests]);
  const pendingRequests = useMemo(() => appState.requests.filter(request => request.status === 'pending'), [appState.requests]);
  const myRequests = useMemo(() => appState.requests.filter(request => request.userId === currentUserId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [appState.requests, currentUserId]);
  const myPoints = useMemo(() => leaderboard.find(item => item.id === currentUserId)?.points || 0, [leaderboard, currentUserId]);
  const myPosition = useMemo(() => leaderboard.findIndex(item => item.id === currentUserId) + 1 || 0, [leaderboard, currentUserId]);
  const history = useMemo(() => [...appState.requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [appState.requests]);

function loginAs(userId) {
  const user = appState.users.find(item => item.id === userId);
  if (!user) return;

  setCurrentUserId(userId);

  if (user.role === 'operator') {
    setScreen('operator-login');
    return;
  }

  setBoyPasswordInput('');
  setBoyAccessGranted(false);
  setScreen('boy-login');
}

// function submitOperatorPassword() {
//  if (operatorPasswordInput === OPERATOR_PASSWORD) {
//    setOperatorAccessGranted(true);
//    setOperatorPasswordInput('');
//    setScreen('operator-home');
//    return;
//  }
//
//  alert('Password operatore non corretta');
// }

async function submitOperatorPassword() {
  const username = operatorUsernameInput.trim().toLowerCase();
  const password = operatorPasswordInput.trim();

  if (!username || !password) {
    alert('Inserisci username e password');
    return;
  }

  const { data, error } = await supabase
    .from('operators')
    .select('id, name, username, password, active')
    .eq('username', username)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error('Errore login operatore', error);
    alert('Errore durante il login operatore');
    return;
  }

  if (!data || String(data.password).trim() !== password) {
    alert('Credenziali operatore non corrette');
    return;
  }

  setCurrentOperator({
    id: data.id,
    name: data.name,
    role: 'operator',
    username: data.username,
  });

  setOperatorAccessGranted(true);
  setOperatorUsernameInput('');
  setOperatorPasswordInput('');
  setScreen('operator-home');
}

async function submitVisitorLogin() {
  const username = visitorUsernameInput.trim().toLowerCase();
  const password = visitorPasswordInput.trim();

  if (!username || !password) {
    alert('Inserisci username e password');
    return;
  }

  const { data, error } = await supabase
    .from('visitors')
    .select('id, name, username, password, active')
    .eq('username', username)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error('Errore login visitatore', error);
    alert('Errore durante il login visitatore');
    return;
  }

  if (!data || String(data.password).trim() !== password) {
    alert('Credenziali visitatore non corrette');
    return;
  }

  setCurrentVisitor({
    id: data.id,
    name: data.name,
    role: 'visitor',
    username: data.username,
  });

  setVisitorAccessGranted(true);
  setVisitorUsernameInput('');
  setVisitorPasswordInput('');
  setScreen('visitor-home');
}

function logoutOperator() {
  setOperatorAccessGranted(false);
  setOperatorUsernameInput('');
  setOperatorPasswordInput('');
  setCurrentOperator(null);
  setCurrentUserId('');
  setBoyAccessGranted(false);
  setScreen('landing');
}

function submitBoyPassword() {
  const user = appState.users.find(item => item.id === currentUserId && item.role === 'boy');
  if (!user) return;

  if (boyPasswordInput.trim() === String(user.password || '').trim()) {
    setBoyAccessGranted(true);
    setBoyPasswordInput('');
    setScreen('boy-home');
    return;
  }

  alert('Password ragazzo non corretta');
}

function logoutBoy() {
  setBoyAccessGranted(false);
  setBoyPasswordInput('');
  setCurrentBoyPasswordInput('');
  setNewBoyPasswordInput('');
  setConfirmBoyPasswordInput('');
  setCurrentUserId('');
  setCurrentOperator(null);
  setScreen('landing');
}

async function saveBoyAvatar() {
  if (!currentUserId || !selectedAvatarKey) return;

  const { error } = await supabase
    .from('boys')
    .update({ avatar_key: selectedAvatarKey })
    .eq('id', currentUserId);

  if (error) {
    console.error('Errore salvataggio avatar', error);
    alert('Errore durante il salvataggio dell’avatar');
    return;
  }

  await loadSupabaseData();
  setScreen('boy-home');
}

function logoutVisitor() {
  setVisitorAccessGranted(false);
  setVisitorUsernameInput('');
  setVisitorPasswordInput('');
  setCurrentVisitor(null);
  setScreen('landing');
}

  async function changeBoyPassword() {
  const user = appState.users.find(item => item.id === currentUserId && item.role === 'boy');
  if (!user) return;

  const currentPassword = currentBoyPasswordInput.trim();
  const nextPassword = newBoyPasswordInput.trim();
  const confirmPassword = confirmBoyPasswordInput.trim();

  if (currentPassword !== String(user.password || '').trim()) {
    alert('Password attuale non corretta');
    return;
  }

  if (!nextPassword) {
    alert('Inserisci una nuova password');
    return;
  }

  if (nextPassword !== confirmPassword) {
    alert('Le nuove password non coincidono');
    return;
  }

  const { error } = await supabase
    .from('boys')
    .update({ password: nextPassword })
    .eq('id', user.id);

  if (error) {
    console.error('Errore cambio password ragazzo', error);
    return;
  }

  setCurrentBoyPasswordInput('');
  setNewBoyPasswordInput('');
  setConfirmBoyPasswordInput('');
  await loadSupabaseData();
  alert('Password aggiornata');
  setScreen('boy-home');
}

async function updateBoyPassword() {
  const cleanPassword = newBoyPassword.trim();
  if (!passwordBoyId || !cleanPassword) return;

  const { error } = await supabase
    .from('boys')
    .update({ password: cleanPassword })
    .eq('id', passwordBoyId);

  if (error) {
    console.error('Errore modifica password ragazzo', error);
    return;
  }

  setNewBoyPassword('');
  await loadSupabaseData();
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
    password: '1234',
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
  const rawPoints = Number(newRulePoints);

  if (!category || !label || Number.isNaN(rawPoints)) return;

  const points = newRuleKind === 'malus' ? -Math.abs(rawPoints) : Math.abs(rawPoints);

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
  const rawPoints = Number(editRulePoints);

  if (!category || !label || Number.isNaN(rawPoints)) return;

  const points = editRuleKind === 'malus' ? -Math.abs(rawPoints) : Math.abs(rawPoints);

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

async function deleteRequest(requestId) {
  if (!requestId) return;

  const confirmed = window.confirm('Vuoi davvero eliminare questo movimento?');
  if (!confirmed) return;

  const { error } = await supabase
    .from('requests')
    .delete()
    .eq('id', requestId);

  if (error) {
    console.error('Errore eliminazione movimento', error);
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
  return (
    <LandingScreen
      users={appState.users}
      loginAs={loginAs}
      goToOperatorLogin={() => setScreen('operator-login')}
      goToVisitorLogin={() => setScreen('visitor-login')}
    />
  );
}

if (screen === 'boy-login' && currentUser) {
  return (
    <BoyLoginScreen
      currentUser={currentUser}
      boyPasswordInput={boyPasswordInput}
      setBoyPasswordInput={setBoyPasswordInput}
      submitBoyPassword={submitBoyPassword}
      onBack={() => {
        setBoyPasswordInput('');
        setCurrentUserId('');
        setScreen('landing');
      }}
    />
  );
}

if (screen === 'boy-home' && currentUser && boyAccessGranted) {
  return (
    <BoyHomeScreen
      currentUser={currentUser}
      myPoints={myPoints}
      myPosition={myPosition}
      myRequests={myRequests}
      goBack={logoutBoy}
      goToCategories={() => setScreen('boy-categories')}
      goToLeaderboard={() => setScreen('boy-leaderboard')}
      goToRequests={() => setScreen('boy-requests')}
      goToChangePassword={() => setScreen('boy-change-password')}
      goToAvatar={() => {
        setSelectedAvatarKey(currentUser?.avatar_key || '');
        setScreen('boy-avatar');
      }}
    />
  );
}

if (screen === 'boy-categories' && currentUser && boyAccessGranted) {
  return (
    <BoyCategoriesScreen
      currentUser={currentUser}
      categories={categories}
      colorStyles={COLOR_STYLES}
      goBack={() => setScreen('boy-home')}
      onSelectCategory={(categoryKey) => {
        setSelectedCategory(categoryKey);
        setScreen('boy-items');
      }}
    />
  );
}

if (screen === 'boy-items' && currentUser && selectedCategoryData && boyAccessGranted) {
  return (
    <BoyItemsScreen
      currentUser={currentUser}
      selectedCategoryData={selectedCategoryData}
      goBack={() => setScreen('boy-categories')}
      onSelectRule={(ruleId) => {
        setSelectedRuleId(ruleId);
        setScreen('boy-confirm');
      }}
    />
  );
}

if (screen === 'boy-confirm' && currentUser && selectedRule && boyAccessGranted) {
  return (
    <BoyConfirmScreen
      currentUser={currentUser}
      selectedRule={selectedRule}
      goBack={() => setScreen('boy-items')}
      onSubmitRequest={submitRequest}
    />
  );
}

if (screen === 'boy-requests' && currentUser && boyAccessGranted) {
  return (
    <BoyRequestsScreen
      currentUser={currentUser}
      myRequests={myRequests}
      goBack={() => setScreen('boy-home')}
      statusStyles={STATUS_STYLES}
      formatDate={formatDate}
      getStatusLabel={getStatusLabel}
    />
  );
}

if (screen === 'boy-leaderboard' && currentUser && boyAccessGranted) {
  return (
    <BoyLeaderboardScreen
      currentUser={currentUser}
      leaderboard={leaderboard}
      goBack={() => setScreen('boy-home')}
    />
  );
}

if (screen === 'boy-change-password' && currentUser && boyAccessGranted) {
  return (
    <BoyChangePasswordScreen
      currentUser={currentUser}
      currentBoyPasswordInput={currentBoyPasswordInput}
      setCurrentBoyPasswordInput={setCurrentBoyPasswordInput}
      newBoyPasswordInput={newBoyPasswordInput}
      setNewBoyPasswordInput={setNewBoyPasswordInput}
      confirmBoyPasswordInput={confirmBoyPasswordInput}
      setConfirmBoyPasswordInput={setConfirmBoyPasswordInput}
      changeBoyPassword={changeBoyPassword}
      goBack={() => setScreen('boy-home')}
    />
  );
}

if (screen === 'boy-avatar' && currentUser && boyAccessGranted) {
  return (
    <BoyAvatarScreen
      currentUser={currentUser}
      selectedAvatarKey={selectedAvatarKey}
      setSelectedAvatarKey={setSelectedAvatarKey}
      saveAvatar={saveBoyAvatar}
      goBack={() => setScreen('boy-home')}
    />
  );
}

if (screen === 'operator-login') {
  return (
    <OperatorLoginScreen
      currentUser={currentUser}
      operatorUsernameInput={operatorUsernameInput}
      setOperatorUsernameInput={setOperatorUsernameInput}
      operatorPasswordInput={operatorPasswordInput}
      setOperatorPasswordInput={setOperatorPasswordInput}
      submitOperatorPassword={submitOperatorPassword}
      onBack={() => setScreen('landing')}
    />
  );
}

if (screen === 'operator-home' && currentUser?.role === 'operator' && operatorAccessGranted) {
  return (
    <OperatorHomeScreen
      currentUser={currentUser}
      pendingRequests={pendingRequests}
      onLogout={logoutOperator}
      goToRequests={() => setScreen('operator-requests')}
      goToManual={() => setScreen('operator-manual')}
      goToHistory={() => setScreen('operator-history')}
      goToLeaderboard={() => setScreen('operator-leaderboard')}
    />
  );
}

if (screen === 'operator-requests' && currentUser && operatorAccessGranted) {
  return (
    <OperatorRequestsScreen
      currentUser={currentUser}
      pendingRequests={pendingRequests}
      modifyDraft={modifyDraft}
      setModifyDraft={setModifyDraft}
      decideRequest={decideRequest}
      startModify={startModify}
      saveModify={saveModify}
      goBack={() => setScreen('operator-home')}
      formatDate={formatDate}
    />
  );
}

if (screen === 'operator-manual' && currentUser && operatorAccessGranted) {
  return (
    <OperatorManualScreen
      currentUser={currentUser}
      appState={appState}
      operatorTargetUserId={operatorTargetUserId}
      setOperatorTargetUserId={setOperatorTargetUserId}
      operatorRuleId={operatorRuleId}
      setOperatorRuleId={setOperatorRuleId}
      operatorNote={operatorNote}
      setOperatorNote={setOperatorNote}
      newBoyName={newBoyName}
      setNewBoyName={setNewBoyName}
      newRuleCategory={newRuleCategory}
      setNewRuleCategory={setNewRuleCategory}
      newRuleLabel={newRuleLabel}
      setNewRuleLabel={setNewRuleLabel}
      newRulePoints={newRulePoints}
      setNewRulePoints={setNewRulePoints}
      newRuleKind={newRuleKind}
      setNewRuleKind={setNewRuleKind}
      newRuleSelectable={newRuleSelectable}
      setNewRuleSelectable={setNewRuleSelectable}
      deleteBoyId={deleteBoyId}
      setDeleteBoyId={setDeleteBoyId}
      deleteRuleId={deleteRuleId}
      setDeleteRuleId={setDeleteRuleId}
      editRuleId={editRuleId}
      setEditRuleId={setEditRuleId}
      editRuleCategory={editRuleCategory}
      setEditRuleCategory={setEditRuleCategory}
      editRuleLabel={editRuleLabel}
      setEditRuleLabel={setEditRuleLabel}
      editRulePoints={editRulePoints}
      setEditRulePoints={setEditRulePoints}
      editRuleKind={editRuleKind}
      setEditRuleKind={setEditRuleKind}
      editRuleSelectable={editRuleSelectable}
      setEditRuleSelectable={setEditRuleSelectable}
      editBoyId={editBoyId}
      setEditBoyId={setEditBoyId}
      editBoyName={editBoyName}
      setEditBoyName={setEditBoyName}
      addNewBoy={addNewBoy}
      deleteBoy={deleteBoy}
      updateBoy={updateBoy}
      passwordBoyId={passwordBoyId}
      setPasswordBoyId={setPasswordBoyId}
      newBoyPassword={newBoyPassword}
      setNewBoyPassword={setNewBoyPassword}
      updateBoyPassword={updateBoyPassword}
      addNewRule={addNewRule}
      deleteRule={deleteRule}
      updateRule={updateRule}
      addManualOperatorEntry={addManualOperatorEntry}
      goBack={() => setScreen('operator-home')}
    />
  );
}

if (screen === 'operator-history' && currentUser && operatorAccessGranted) {

  return (
    <OperatorHistoryScreen
      currentUser={currentUser}
      history={history}
      goBack={() => setScreen('operator-home')}
      statusStyles={STATUS_STYLES}
      formatDate={formatDate}
      getRequestPoints={getRequestPoints}
      getStatusLabel={getStatusLabel}
      deleteRequest={deleteRequest}
    />
  );
}

if (screen === 'operator-leaderboard' && currentUser?.role === 'operator' && operatorAccessGranted) {
  return (
    <BoyLeaderboardScreen
      currentUser={currentUser}
      leaderboard={leaderboard}
      goBack={() => setScreen('operator-home')}
    />
  );
}

if (screen === 'visitor-login') {
  return (
    <VisitorLoginScreen
      currentUser={currentUser}
      visitorUsernameInput={visitorUsernameInput}
      setVisitorUsernameInput={setVisitorUsernameInput}
      visitorPasswordInput={visitorPasswordInput}
      setVisitorPasswordInput={setVisitorPasswordInput}
      submitVisitorLogin={submitVisitorLogin}
      onBack={() => setScreen('landing')}
    />
  );
}

if (screen === 'visitor-home' && currentUser?.role === 'visitor' && visitorAccessGranted) {
  return (
    <VisitorHomeScreen
      currentUser={currentUser}
      onLogout={logoutVisitor}
      goToLeaderboard={() => setScreen('visitor-leaderboard')}
      goToRules={() => setScreen('visitor-rules')}
      goToHowItWorks={() => setScreen('visitor-how-it-works')}
    />
  );
}

if (screen === 'visitor-leaderboard' && currentUser?.role === 'visitor' && visitorAccessGranted) {
  return (
    <BoyLeaderboardScreen
      currentUser={currentUser}
      leaderboard={leaderboard}
      goBack={() => setScreen('visitor-home')}
    />
  );
}

if (screen === 'visitor-rules' && currentUser?.role === 'visitor' && visitorAccessGranted) {
  return (
    <VisitorRulesScreen
      currentUser={currentUser}
      rules={appState.rules}
      goBack={() => setScreen('visitor-home')}
    />
  );
}

if (screen === 'visitor-how-it-works' && currentUser?.role === 'visitor' && visitorAccessGranted) {
  return (
    <VisitorHowItWorksScreen
      currentUser={currentUser}
      goBack={() => setScreen('visitor-home')}
    />
  );
}

  return null;
}
