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
} from './utils/appHelpers';

import LandingScreen from './components/screens/LandingScreen';
import OperatorLoginScreen from './components/screens/OperatorLoginScreen';
import OperatorHomeScreen from './components/screens/OperatorHomeScreen';
import OperatorHistoryScreen from './components/screens/OperatorHistoryScreen';
import OperatorRequestsScreen from './components/screens/OperatorRequestsScreen';
import OperatorManualScreen from './components/screens/OperatorManualScreen';
import OperatorChangePasswordScreen from './components/screens/OperatorChangePasswordScreen';
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

const SESSION_STORAGE_KEY = 'fantamas_session';

function saveSession(sessionData) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Errore lettura sessione:', error);
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

const OPERATOR_PASSWORD = import.meta.env.VITE_OPERATOR_PASSWORD;

export default function FantaMasMockup() {
  const [appState, setAppState] = useState({
    users: [],
    rules: [],
    requests: [],
  });
  const [screen, setScreen] = useState('landing');
  const [sessionRestored, setSessionRestored] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [operatorTargetUserId, setOperatorTargetUserId] = useState('marco');
  const [operatorRuleId, setOperatorRuleId] = useState('rifiuto-partecipare');
  const [operatorNote, setOperatorNote] = useState('');
  const [newBoyName, setNewBoyName] = useState('');
  const [boyPasswordInput, setBoyPasswordInput] = useState('');
  const [boyUsernameInput, setBoyUsernameInput] = useState('');
  const [boyAccessGranted, setBoyAccessGranted] = useState(false);
  const [passwordBoyId, setPasswordBoyId] = useState('');
  const [newBoyPassword, setNewBoyPassword] = useState('');
  const [currentBoyPasswordInput, setCurrentBoyPasswordInput] = useState('');
  const [newBoyPasswordInput, setNewBoyPasswordInput] = useState('');
  const [confirmBoyPasswordInput, setConfirmBoyPasswordInput] = useState('');
  const boys = appState.users.filter(user => user.role === 'boy');
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
  const [selectedAdjustmentUserId, setSelectedAdjustmentUserId] = useState('');
  const [adjustmentPointsInput, setAdjustmentPointsInput] = useState('');
  const [adjustmentReasonInput, setAdjustmentReasonInput] = useState('');
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

  useEffect(() => {
    loadSupabaseData();
  }, []);

  async function loadSupabaseData() {
  try {
    const { data, error } = await supabase.functions.invoke('get-app-data', {
      body: {},
    });

    if (error) {
      console.error('Errore invoke get-app-data', error);
      return;
    }

    if (!data?.ok) {
      console.error('Errore caricamento dati app', data?.error);
      return;
    }

    setAppState(prev => ({
      ...prev,
      users: (data.boys || []).map(user => ({
        id: user.id,
        name: user.name,
        role: 'boy',
        username: user.username || '',
        avatar_url: user.avatar_url || '',
        avatar_key: user.avatar_key && user.avatar_key !== 'NULL' ? user.avatar_key : '',
      })),
      rules: (data.rules || []).map(rule => ({
        id: rule.id,
        category: rule.category,
        label: rule.label,
        points: rule.points,
        kind: rule.kind,
        boySelectable: rule.boy_selectable,
        icon: rule.icon,
        color: rule.color,
      })),
      requests: (data.requests || []).map(request => ({
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
    }));
  } catch (err) {
    console.error('Eccezione loadSupabaseData', err);
  }
}

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const savedSession = loadSession();

      if (!savedSession?.accessGranted) {
        if (isMounted) setSessionRestored(true);
        return;
      }

      const { role, userId } = savedSession;

      if (!role) {
        clearSession();
        if (isMounted) setSessionRestored(true);
        return;
      }

      if (isMounted) {
        setBoyAccessGranted(false);
        setOperatorAccessGranted(false);
        setVisitorAccessGranted(false);
        setCurrentUserId('');
        setCurrentOperator(null);
        setCurrentVisitor(null);
      }

      if (role === 'boy') {
        if (!userId) {
          clearSession();
          if (isMounted) setSessionRestored(true);
          return;
        }

        const boy = appState.users.find(
          item => String(item.id) === String(userId) && item.role === 'boy'
        );

        if (!boy) {
          if (isMounted) setSessionRestored(true);
          return;
        }

        if (isMounted) {
          setCurrentUserId(boy.id);
          setBoyAccessGranted(true);
          setScreen('boy-home');
          setSessionRestored(true);
        }

        return;
      }

      if (role === 'operator') {
        if (!userId) {
          clearSession();
          if (isMounted) setSessionRestored(true);
          return;
        }

        const { data, error } = await supabase
          .from('operators')
          .select('id, name, username, active')
          .eq('id', userId)
          .eq('active', true)
          .maybeSingle();

        if (error || !data) {
          console.error('Errore ripristino sessione operatore', error);
          clearSession();
          if (isMounted) setSessionRestored(true);
          return;
        }

        if (isMounted) {
          setCurrentOperator({
            id: data.id,
            name: data.name,
            role: 'operator',
            username: data.username,
          });
          setOperatorAccessGranted(true);
          setScreen('operator-home');
          setSessionRestored(true);
        }

        return;
      }

      if (role === 'visitor') {
        if (!userId) {
          clearSession();
          if (isMounted) setSessionRestored(true);
          return;
        }

        const { data, error } = await supabase
          .from('visitors')
          .select('id, name, username, active')
          .eq('id', userId)
          .eq('active', true)
          .maybeSingle();

        if (error || !data) {
          console.error('Errore ripristino sessione visitatore', error);
          clearSession();
          if (isMounted) setSessionRestored(true);
          return;
        }

        if (isMounted) {
          setCurrentVisitor({
            id: data.id,
            name: data.name,
            role: 'visitor',
            username: data.username,
          });
          setVisitorAccessGranted(true);
          setScreen('visitor-home');
          setSessionRestored(true);
        }

        return;
      }

      clearSession();
      if (isMounted) setSessionRestored(true);
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [appState.users]);

  useEffect(() => {
    const boysList = appState.users.filter(user => user.role === 'boy');

    if (!passwordBoyId && boysList.length > 0) {
      setPasswordBoyId(boysList[0].id);
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

    const selectedRuleData = appState.rules.find(rule => rule.id === editRuleId);
    if (!selectedRuleData) return;

    setEditRuleCategory(selectedRuleData.category);
    setEditRuleLabel(selectedRuleData.label);
    setEditRulePoints(String(selectedRuleData.points));
    setEditRuleKind(selectedRuleData.kind);
    setEditRuleSelectable(selectedRuleData.boySelectable);
  }, [appState.rules, editRuleId]);

  useEffect(() => {
    const boysList = appState.users.filter(user => user.role === 'boy');

    if (!editBoyId && boysList.length > 0) {
      setEditBoyId(boysList[0].id);
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
  const leaderboard = useMemo(
    () => computeLeaderboard(appState.users, appState.requests, appState.rules),
    [appState.users, appState.requests, appState.rules]
  );
  
  const pendingRequests = useMemo(
    () => appState.requests.filter(request => request.status === 'pending'),
    [appState.requests]
  );
  const myRequests = useMemo(
    () =>
      appState.requests
        .filter(request => request.userId === currentUserId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [appState.requests, currentUserId]
  );
  const myPoints = useMemo(
    () => leaderboard.find(item => item.id === currentUserId)?.points || 0,
    [leaderboard, currentUserId]
  );
  const myPosition = useMemo(
    () => leaderboard.findIndex(item => item.id === currentUserId) + 1 || 0,
    [leaderboard, currentUserId]
  );
  const history = useMemo(
    () => [...appState.requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [appState.requests]
  );

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

  async function submitOperatorPassword() {
  const username = operatorUsernameInput.trim().toLowerCase();
  const password = operatorPasswordInput.trim();

  if (!username || !password) {
    alert('Inserisci username e password');
    return;
  }

  try {
    const { data, error } = await supabase.functions.invoke('login-operator', {
      body: {
        username,
        password,
      },
    });

    if (error) {
      console.error('Errore invoke login-operator', error);
      alert('Errore durante il login operatore');
      return;
    }

    if (!data?.ok || !data?.operator) {
      alert(data?.error || 'Credenziali operatore non corrette');
      return;
    }

    const operator = data.operator;

    setCurrentOperator({
      id: operator.id,
      name: operator.name,
      role: 'operator',
      username: operator.username,
    });

    setCurrentVisitor(null);
    setCurrentUserId(operator.id);
    setOperatorAccessGranted(true);
    setBoyAccessGranted(false);
    setVisitorAccessGranted(false);
    setOperatorUsernameInput('');
    setOperatorPasswordInput('');
    setScreen('operator-home');

    saveSession({
      role: 'operator',
      userId: operator.id,
      accessGranted: true,
    });
  } catch (err) {
    console.error('Eccezione login operatore', err);
    alert('Errore durante il login operatore');
  }
}

  async function submitVisitorLogin() {
  const username = visitorUsernameInput.trim().toLowerCase();
  const password = visitorPasswordInput.trim();

  if (!username || !password) {
    alert('Inserisci username e password');
    return;
  }

  try {
    const { data, error } = await supabase.functions.invoke('login-visitor', {
      body: {
        username,
        password,
      },
    });

    if (error) {
      console.error('Errore invoke login-visitor', error);
      alert('Errore durante il login visitatore');
      return;
    }

    if (!data?.ok || !data?.visitor) {
      alert(data?.error || 'Credenziali visitatore non corrette');
      return;
    }

    const visitor = data.visitor;

    setCurrentVisitor({
      id: visitor.id,
      name: visitor.name,
      role: 'visitor',
      username: visitor.username,
    });

    setCurrentOperator(null);
    setCurrentUserId(visitor.id);
    setVisitorAccessGranted(true);
    setBoyAccessGranted(false);
    setOperatorAccessGranted(false);
    setVisitorUsernameInput('');
    setVisitorPasswordInput('');
    setScreen('visitor-home');

    saveSession({
      role: 'visitor',
      userId: visitor.id,
      accessGranted: true,
    });
  } catch (err) {
    console.error('Eccezione login visitatore', err);
    alert('Errore durante il login visitatore');
  }
}

  function logoutOperator() {
    setOperatorAccessGranted(false);
    setBoyAccessGranted(false);
    setVisitorAccessGranted(false);

    setOperatorUsernameInput('');
    setOperatorPasswordInput('');

    setCurrentOperator(null);
    setCurrentVisitor(null);
    setCurrentUserId('');

    setScreen('landing');
    clearSession();
  }

  function logoutBoy() {
    setBoyAccessGranted(false);
    setOperatorAccessGranted(false);
    setVisitorAccessGranted(false);

    setBoyPasswordInput('');
    setCurrentBoyPasswordInput('');
    setNewBoyPasswordInput('');
    setConfirmBoyPasswordInput('');

    setCurrentOperator(null);
    setCurrentVisitor(null);
    setCurrentUserId('');

    setScreen('landing');
    clearSession();
  }

  function logoutVisitor() {
    setVisitorAccessGranted(false);
    setBoyAccessGranted(false);
    setOperatorAccessGranted(false);

    setVisitorUsernameInput('');
    setVisitorPasswordInput('');

    setCurrentVisitor(null);
    setCurrentOperator(null);
    setCurrentUserId('');

    setScreen('landing');
    clearSession();
  }

async function submitBoyPassword() {
  const username = boyUsernameInput.trim().toLowerCase();
  const password = boyPasswordInput.trim();

  if (!username || !password) {
    alert('Inserisci username e password');
    return;
  }

  try {
    const { data, error } = await supabase.functions.invoke('login-boy', {
      body: {
        username,
        password,
      },
    });

    if (error) {
      console.error('Errore invoke login-boy', error);
      alert('Errore durante il login ragazzo');
      return;
    }

    if (!data?.ok || !data?.boy) {
      alert(data?.error || 'Credenziali ragazzo non corrette');
      return;
    }

    const boy = data.boy;

    setCurrentUserId(boy.id);
    setBoyAccessGranted(true);
    setOperatorAccessGranted(false);
    setVisitorAccessGranted(false);
    setCurrentOperator(null);
    setCurrentVisitor(null);
    setBoyUsernameInput('');
    setBoyPasswordInput('');
    setScreen('boy-home');

    saveSession({
      role: 'boy',
      userId: boy.id,
      accessGranted: true,
    });
  } catch (err) {
    console.error('Eccezione login ragazzo', err);
    alert('Errore durante il login ragazzo');
  }
}

  async function saveBoyAvatar() {
  if (!currentUserId || !selectedAvatarKey) return;

  try {
    const { data, error } = await supabase.functions.invoke('save-boy-avatar', {
      body: {
        boyId: currentUserId,
        avatarKey: selectedAvatarKey,
      },
    });

    if (error) {
      console.error('Errore invoke save-boy-avatar', error);
      alert('Errore durante il salvataggio dell’avatar');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante il salvataggio dell’avatar');
      return;
    }

    await loadSupabaseData();
    setScreen('boy-home');
  } catch (err) {
    console.error('Eccezione salvataggio avatar', err);
    alert('Errore durante il salvataggio dell’avatar');
  }
}

  async function changeBoyPassword() {
  const currentPassword = currentBoyPasswordInput.trim();
  const nextPassword = newBoyPasswordInput.trim();
  const confirmPassword = confirmBoyPasswordInput.trim();

  if (!currentUserId) return;

  if (!currentPassword) {
    alert('Inserisci la password attuale');
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

  try {
    const { data, error } = await supabase.functions.invoke('change-boy-password', {
      body: {
        boyId: currentUserId,
        currentPassword,
        newPassword: nextPassword,
      },
    });

    if (error) {
      console.error('Errore invoke change-boy-password', error);
      alert('Errore durante il cambio password ragazzo');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante il cambio password ragazzo');
      return;
    }

    setCurrentBoyPasswordInput('');
    setNewBoyPasswordInput('');
    setConfirmBoyPasswordInput('');
    await loadSupabaseData();
    alert('Password aggiornata');
    setScreen('boy-home');
  } catch (err) {
    console.error('Eccezione cambio password ragazzo', err);
    alert('Errore durante il cambio password ragazzo');
  }
}

  async function updateBoyPassword() {
  const cleanPassword = newBoyPassword.trim();
  if (!passwordBoyId || !cleanPassword) return;

  try {
    const { data, error } = await supabase.functions.invoke('reset-boy-password', {
      body: {
        boyId: passwordBoyId,
        newPassword: cleanPassword,
      },
    });

    if (error) {
      console.error('Errore invoke reset-boy-password', error);
      alert('Errore durante la modifica password ragazzo');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante la modifica password ragazzo');
      return;
    }

    setNewBoyPassword('');
    await loadSupabaseData();
  } catch (err) {
    console.error('Eccezione modifica password ragazzo', err);
    alert('Errore durante la modifica password ragazzo');
  }
}

  async function submitRequest() {
  if (!currentUser?.id || !selectedRule?.id) return;

  try {
    const { data, error } = await supabase.functions.invoke('submit-request', {
      body: {
        userId: currentUser.id,
        ruleId: selectedRule.id,
      },
    });

    if (error) {
      console.error('Errore invoke submit-request', error);
      alert('Errore durante l’invio della richiesta');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante l’invio della richiesta');
      return;
    }

    setSelectedCategory('');
    setSelectedRuleId('');
    await loadSupabaseData();
    setScreen('boy-requests');
  } catch (err) {
    console.error('Eccezione invio richiesta', err);
    alert('Errore durante l’invio della richiesta');
  }
}

  async function decideRequest(requestId, action) {
  if (!currentUser?.name) return;

  try {
    const { data, error } = await supabase.functions.invoke('decide-request', {
      body: {
        requestId,
        action,
        decidedBy: currentUser.name,
      },
    });

    if (error) {
      console.error('Errore invoke decide-request', error);
      alert('Errore durante la decisione della richiesta');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante la decisione della richiesta');
      return;
    }

    await loadSupabaseData();
  } catch (err) {
    console.error('Eccezione decisione richiesta', err);
    alert('Errore durante la decisione della richiesta');
  }
}

  function startModify(request) {
    setModifyDraft({
      requestId: request.id,
      finalPoints: String(Math.max(1, request.points - 1)),
      note: request.note || 'Partecipazione parziale',
    });
  }

  async function saveModify() {
  if (!modifyDraft.requestId || !currentUser?.name) return;

  const parsedPoints = Number(modifyDraft.finalPoints);
  if (Number.isNaN(parsedPoints)) return;

  try {
    const { data, error } = await supabase.functions.invoke('modify-request', {
      body: {
        requestId: modifyDraft.requestId,
        finalPoints: parsedPoints,
        note: modifyDraft.note,
        decidedBy: currentUser.name,
      },
    });

    if (error) {
      console.error('Errore invoke modify-request', error);
      alert('Errore durante la modifica della richiesta');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante la modifica della richiesta');
      return;
    }

    setModifyDraft({ requestId: '', finalPoints: '', note: '' });
    await loadSupabaseData();
  } catch (err) {
    console.error('Eccezione modifica richiesta', err);
    alert('Errore durante la modifica della richiesta');
  }
}

  async function addNewBoy() {
  const cleanName = newBoyName.trim();
  if (!cleanName) return;

  try {
    const { data, error } = await supabase.functions.invoke('add-boy', {
      body: {
        name: cleanName,
      },
    });

    if (error) {
      console.error('Errore invoke add-boy', error);
      alert('Errore durante l’aggiunta del ragazzo');
      return;
    }

    if (!data?.ok || !data?.boy) {
      alert(data?.error || 'Errore durante l’aggiunta del ragazzo');
      return;
    }

    setNewBoyName('');
    setOperatorTargetUserId(data.boy.id);
    await loadSupabaseData();
  } catch (err) {
    console.error('Eccezione aggiunta ragazzo', err);
    alert('Errore durante l’aggiunta del ragazzo');
  }
}

  async function deleteBoy() {
  if (!deleteBoyId) return;

  const userToDelete = appState.users.find(user => user.id === deleteBoyId);
  if (!userToDelete || userToDelete.role !== 'boy') return;

  try {
    const { data, error } = await supabase.functions.invoke('delete-boy', {
      body: {
        boyId: deleteBoyId,
      },
    });

    if (error) {
      console.error('Errore invoke delete-boy', error);
      alert('Errore durante l’eliminazione del ragazzo');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante l’eliminazione del ragazzo');
      return;
    }

    setDeleteBoyId('');
    await loadSupabaseData();
  } catch (err) {
    console.error('Eccezione eliminazione ragazzo', err);
    alert('Errore durante l’eliminazione del ragazzo');
  }
}

  async function addNewRule() {
  const category = newRuleCategory.trim();
  const label = newRuleLabel.trim();
  const rawPoints = Number(newRulePoints);

  if (!category || !label || Number.isNaN(rawPoints)) return;

  try {
    const { data, error } = await supabase.functions.invoke('add-rule-safe', {
      body: {
        category,
        label,
        points: rawPoints,
        kind: newRuleKind,
        boySelectable: newRuleSelectable,
      },
    });

    if (error) {
      console.error('Errore invoke add-rule', error);
      alert('Errore durante l’aggiunta della regola');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante l’aggiunta della regola');
      return;
    }

    setNewRuleCategory('');
    setNewRuleLabel('');
    setNewRulePoints('');
    setNewRuleKind('bonus');
    setNewRuleSelectable(true);

    await loadSupabaseData();
  } catch (err) {
    console.error('Eccezione aggiunta regola', err);
    alert('Errore durante l’aggiunta della regola');
  }
}

  async function deleteRule() {
  if (!deleteRuleId) return;

  try {
    const { data, error } = await supabase.functions.invoke('delete-rule', {
      body: {
        ruleId: deleteRuleId,
      },
    });

    if (error) {
      console.error('Errore invoke delete-rule', error);
      alert('Errore durante l’eliminazione della regola');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante l’eliminazione della regola');
      return;
    }

    setDeleteRuleId('');
    await loadSupabaseData();
  } catch (err) {
    console.error('Eccezione eliminazione regola', err);
    alert('Errore durante l’eliminazione della regola');
  }
}

  async function updateRule() {
  if (!editRuleId) return;

  const category = editRuleCategory.trim();
  const label = editRuleLabel.trim();
  const rawPoints = Number(editRulePoints);

  if (!category || !label || Number.isNaN(rawPoints)) return;

  try {
    const { data, error } = await supabase.functions.invoke('update-rule', {
      body: {
        ruleId: editRuleId,
        category,
        label,
        points: rawPoints,
        kind: editRuleKind,
        boySelectable: editRuleSelectable,
      },
    });

    if (error) {
      console.error('Errore invoke update-rule', error);
      alert('Errore durante la modifica della regola');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante la modifica della regola');
      return;
    }

    await loadSupabaseData();
  } catch (err) {
    console.error('Eccezione modifica regola', err);
    alert('Errore durante la modifica della regola');
  }
}

  async function deleteRequest(requestId) {
  if (!requestId) return;

  const confirmed = window.confirm('Vuoi davvero eliminare questo movimento?');
  if (!confirmed) return;

  try {
    const { data, error } = await supabase.functions.invoke('delete-request', {
      body: {
        requestId,
      },
    });

    if (error) {
      console.error('Errore invoke delete-request', error);
      alert('Errore durante l’eliminazione del movimento');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante l’eliminazione del movimento');
      return;
    }

    await loadSupabaseData();
  } catch (err) {
    console.error('Eccezione eliminazione movimento', err);
    alert('Errore durante l’eliminazione del movimento');
  }
}

  async function updateBoy() {
  const cleanName = editBoyName.trim();
  if (!editBoyId || !cleanName) return;

  try {
    const { data, error } = await supabase.functions.invoke('update-boy', {
      body: {
        boyId: editBoyId,
        name: cleanName,
      },
    });

    if (error) {
      console.error('Errore invoke update-boy', error);
      alert('Errore durante la modifica del ragazzo');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante la modifica del ragazzo');
      return;
    }

    await loadSupabaseData();
  } catch (err) {
    console.error('Eccezione modifica ragazzo', err);
    alert('Errore durante la modifica del ragazzo');
  }
}

async function addManualOperatorEntry() {
  if (!currentUser?.name) return;

  try {
    const { data, error } = await supabase.functions.invoke('add-manual-entry', {
      body: {
        userId: operatorTargetUserId,
        ruleId: operatorRuleId,
        note: operatorNote,
        decidedBy: currentUser.name,
      },
    });

    if (error) {
      console.error('Errore invoke add-manual-entry', error);
      alert('Errore durante l’inserimento manuale');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante l’inserimento manuale');
      return;
    }

    setOperatorNote('');
    await loadSupabaseData();
    setScreen('operator-history');
  } catch (err) {
    console.error('Eccezione inserimento manuale', err);
    alert('Errore durante l’inserimento manuale');
  }
}

async function addArbitraryManualAdjustment({ userId, points, reason }) {
  if (!currentUser?.name) return;

  try {
    const { data, error } = await supabase.functions.invoke('add-manual-adjustment', {
      body: {
        userId,
        points: Number(points),
        reason: reason?.trim() || '',
        decidedBy: currentUser.name,
      },
    });

    if (error) {
      console.error('Errore invoke add-manual-adjustment', error);
      alert('Errore durante il bonus/malus manuale');
      return;
    }

    if (!data?.ok) {
      alert(data?.error || 'Errore durante il bonus/malus manuale');
      return;
    }

    await loadSupabaseData();
    setScreen('operator-history');
  } catch (err) {
    console.error('Eccezione bonus/malus manuale', err);
    alert('Errore durante il bonus/malus manuale');
  }
}

  if (screen === 'landing') {
    return (
      <LandingScreen
        users={appState.users}
        goToBoyLogin={() => {
          setBoyUsernameInput('');
          setBoyPasswordInput('');
          setCurrentUserId('');
          setScreen('boy-login');
        }}
        goToOperatorLogin={() => {
          setOperatorUsernameInput('');
          setOperatorPasswordInput('');
          setScreen('operator-login');
        }}
        goToVisitorLogin={() => {
          setVisitorUsernameInput('');
          setVisitorPasswordInput('');
          setScreen('visitor-login');
        }}
      />
    );
  }

  if (screen === 'boy-login') {
    return (
      <BoyLoginScreen
        currentUser={currentUser}
        boyUsernameInput={boyUsernameInput}
        setBoyUsernameInput={setBoyUsernameInput}
        boyPasswordInput={boyPasswordInput}
        setBoyPasswordInput={setBoyPasswordInput}
        submitBoyPassword={submitBoyPassword}
        onBack={() => {
          setBoyUsernameInput('');
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

  if (screen === 'operator-home' && currentOperator?.role === 'operator' && operatorAccessGranted) {
    return (
      <OperatorHomeScreen
        currentUser={currentOperator}
        pendingRequests={pendingRequests}
        onLogout={logoutOperator}
        goToRequests={() => setScreen('operator-requests')}
        goToManual={() => setScreen('operator-manual')}
        goToHistory={() => setScreen('operator-history')}
        goToLeaderboard={() => setScreen('operator-leaderboard')}
        setScreen={setScreen}
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
        addArbitraryManualAdjustment={addArbitraryManualAdjustment}
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

  if (screen === 'operator-change-password' && currentOperator?.role === 'operator' && operatorAccessGranted) {
    return (
      <OperatorChangePasswordScreen
        currentUser={currentOperator}
        setScreen={setScreen}
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