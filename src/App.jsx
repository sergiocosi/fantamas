import React, { useEffect, useMemo, useRef, useState } from 'react';
import { callApi, saveSession, loadSession, clearSession } from './api';
import {
  COLOR_STYLES,
  STATUS_STYLES,
  formatDate,
  getRequestPoints,
  getStatusLabel,
  groupRules,
  computeLeaderboard,
  getPrizeStatus,
} from './utils/appHelpers';
import { photoToJpegDataUrl } from './utils/photo';

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

export default function FantaMasMockup() {
  const [appState, setAppState] = useState({
    users: [],
    rules: [],
    requests: [],
  });
  const [screen, setScreen] = useState(() =>
    loadSession()?.accessGranted || window.location.search.includes('famiglie=') ? 'loading' : 'landing'
  );
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [operatorTargetUserId, setOperatorTargetUserId] = useState('');
  const [operatorRuleId, setOperatorRuleId] = useState('');
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
  const [newRuleCategory, setNewRuleCategory] = useState('');
  const [newRuleLabel, setNewRuleLabel] = useState('');
  const [newRulePoints, setNewRulePoints] = useState('');
  const [newRuleKind, setNewRuleKind] = useState('bonus');
  const [newRuleSelectable, setNewRuleSelectable] = useState(true);
  const [deleteBoyId, setDeleteBoyId] = useState('');
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
  const [sessionRestored, setSessionRestored] = useState(false);
  const [selectedAvatarKey, setSelectedAvatarKey] = useState('');

  useEffect(() => {
    loadSupabaseData();
  }, []);

  async function loadSupabaseData() {
    try {
      const { data, error } = await callApi('get-app-data', {});

      if (error) {
        console.error('Errore invoke get-app-data', error);
        return;
      }

      if (!data?.ok) {
        console.error('Errore caricamento dati app', data?.error);
        return;
      }

      setAppState({
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
      });
    } catch (err) {
      console.error('Eccezione loadSupabaseData', err);
    }
  }

  useEffect(() => {
  let isMounted = true;

  async function restoreSession() {
    // Link per le famiglie: ?famiglie=<token> → entra come visitatore
    try {
      const params = new URLSearchParams(window.location.search);
      const familyToken = params.get('famiglie');
      if (familyToken) {
        const current = loadSession();
        if (!current?.accessGranted || current.role === 'visitor') {
          saveSession({ role: 'visitor', userId: 'famiglie', token: familyToken, accessGranted: true });
        }
        params.delete('famiglie');
        const rest = params.toString();
        window.history.replaceState(null, '', window.location.pathname + (rest ? `?${rest}` : ''));
      }
    } catch (err) {
      console.error('Errore link famiglie', err);
    }

    const savedSession = loadSession();

    if (!savedSession?.accessGranted) {
      if (isMounted) {
        setScreen('landing');
        setSessionRestored(true);
      }
      return;
    }

    const { role, userId, token } = savedSession;

    if (!role || !userId || !token) {
      clearSession();
      if (isMounted) {
        setScreen('landing');
        setSessionRestored(true);
      }
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

    let data = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await callApi('bootstrap-session');
        data = result.data;
        const status = result.status || 0;
        // risposta chiara dal server: sessione valida oppure scaduta
        if (data?.ok || (status >= 400 && status < 500)) break;
      } catch (err) {
        console.error('Eccezione bootstrap session', err);
      }
      data = null;
      await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
    }

    if (!isMounted) return;

    if (data === null) {
      // problema di connessione: la sessione resta salvata, si ritenta al prossimo caricamento
      alert('Connessione non disponibile. Controlla internet e ricarica la pagina.');
      setScreen('landing');
      setSessionRestored(true);
      return;
    }

    if (!data.ok || !data.user) {
      console.error('Sessione non valida', data.error);
      clearSession();
      setScreen('landing');
      setSessionRestored(true);
      return;
    }

    try {
      const user = data.user;

      if (role === 'boy') {
        if (isMounted) {
          setCurrentUserId(user.id);
          setBoyAccessGranted(true);
          setScreen('boy-home');
          setSessionRestored(true);
        }
        return;
      }

      if (role === 'operator') {
        if (isMounted) {
          setCurrentOperator({
            id: user.id,
            name: user.name,
            role: 'operator',
            username: user.username,
          });
          setCurrentUserId(user.id);
          setOperatorAccessGranted(true);
          setScreen('operator-home');
          setSessionRestored(true);
        }
        return;
      }

      if (role === 'visitor') {
        if (isMounted) {
          setCurrentVisitor({
            id: user.id,
            name: user.name,
            role: 'visitor',
            username: user.username,
          });
          setCurrentUserId(user.id);
          setVisitorAccessGranted(true);
          setScreen('visitor-home');
          setSessionRestored(true);
        }
        return;
      }

      clearSession();
      setScreen('landing');
      setSessionRestored(true);
    } catch (err) {
      console.error('Eccezione ripristino sessione', err);
      setScreen('landing');
      setSessionRestored(true);
    }
  }

  restoreSession();

  return () => {
    isMounted = false;
  };
}, []);

  // ---------- Tasto "indietro" del telefono / browser ----------
  const accessRef = useRef({ boy: false, operator: false, visitor: false });
  accessRef.current = { boy: boyAccessGranted, operator: operatorAccessGranted, visitor: visitorAccessGranted };

  useEffect(() => {
    if (screen === 'loading') return;
    if (window.history.state?.fantamasScreen === screen) return;
    const isFirst = !window.history.state?.fantamasScreen;
    const state = { fantamasScreen: screen };
    if (isFirst) window.history.replaceState(state, '');
    else window.history.pushState(state, '');
  }, [screen]);

  useEffect(() => {
    function onPopState(event) {
      const target = event.state?.fantamasScreen;
      const access = accessRef.current;
      const home = access.boy ? 'boy-home' : access.operator ? 'operator-home' : access.visitor ? 'visitor-home' : 'landing';
      const loggedIn = home !== 'landing';
      const isPublic = !target || target === 'landing' || target.endsWith('-login');
      const sameRole = target && home !== 'landing' && target.startsWith(home.split('-')[0] + '-');

      let next = target || home;
      if (loggedIn && (isPublic || !sameRole)) next = home; // da dentro l'app non si torna alla pagina di login
      if (!loggedIn && !isPublic) next = 'landing'; // dopo l'uscita non si rientra con "indietro"

      if (next !== target) window.history.replaceState({ fantamasScreen: next }, '');
      setScreen(next);
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const boysList = appState.users.filter(user => user.role === 'boy');

    if (!passwordBoyId && boysList.length > 0) {
      setPasswordBoyId(boysList[0].id);
    }
  }, [appState.users, passwordBoyId]);

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
  const getLeaderboard = monthKey =>
    computeLeaderboard(appState.users, appState.requests, appState.rules, monthKey);
  
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
  const prizeStatus = useMemo(
    () => getPrizeStatus(leaderboard, currentUserId),
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

  async function submitOperatorPassword() {
  const username = operatorUsernameInput.trim().toLowerCase();
  const password = operatorPasswordInput.trim();

  if (!username || !password) {
    alert('Inserisci username e password');
    return;
  }

  try {
    const { data, error } = await callApi('login-operator', {
        username,
        password,
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
      token: data.token,
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
    const { data, error } = await callApi('login-visitor', {
        username,
        password,
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
      token: data.token,
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
    const { data, error } = await callApi('login-boy', {
        username,
        password,
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
      token: data.token,
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
    const { data, error } = await callApi('save-boy-avatar', {
        boyId: currentUserId,
        avatarKey: selectedAvatarKey,
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
    const { data, error } = await callApi('change-boy-password', {
        boyId: currentUserId,
        currentPassword,
        newPassword: nextPassword,
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
    const { data, error } = await callApi('reset-boy-password', {
        boyId: passwordBoyId,
        newPassword: cleanPassword,
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
    const { data, error } = await callApi('submit-request', {
        userId: currentUser.id,
        ruleId: selectedRule.id,
      });

    if (error) {
      console.error('Errore invoke submit-request', error);
      alert(`Errore invoke submit-request: ${error.message || JSON.stringify(error)}`);
      return;
    }

    if (!data?.ok) {
      console.error('submit-request KO:', data);
      alert(`Errore durante l’invio della richiesta: ${data?.error || 'errore sconosciuto'}`);
      return;
    }

    setSelectedCategory('');
    setSelectedRuleId('');
    await loadSupabaseData();
    setScreen('boy-requests');
  } catch (err) {
    console.error('Eccezione invio richiesta', err);
    alert(`Errore durante l’invio della richiesta: ${err.message || err}`);
  }
}

  async function decideRequest(requestId, action) {
  if (!currentUser?.name) return;

  try {
    const { data, error } = await callApi('decide-request', {
        requestId,
        action,
        decidedBy: currentUser.name,
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

  async function uploadPhoto(boyId, file) {
    try {
      const image = await photoToJpegDataUrl(file);
      const { data, error } = await callApi('upload-photo', { boyId, image });
      if (error || !data?.ok) {
        alert(data?.error || 'Errore durante il caricamento della foto');
        return false;
      }
      await loadSupabaseData();
      return true;
    } catch (err) {
      console.error('Eccezione caricamento foto', err);
      alert(err.message || 'Errore durante il caricamento della foto');
      return false;
    }
  }

  async function removePhoto(boyId) {
    try {
      const { data, error } = await callApi('remove-photo', { boyId });
      if (error || !data?.ok) {
        alert(data?.error || 'Errore durante la rimozione della foto');
        return;
      }
      await loadSupabaseData();
    } catch (err) {
      console.error('Eccezione rimozione foto', err);
      alert('Errore durante la rimozione della foto');
    }
  }

  async function createFamilyLink() {
    try {
      const { data, error } = await callApi('create-family-link');
      if (error || !data?.ok) {
        alert(data?.error || 'Errore durante la creazione del link');
        return '';
      }
      return `${window.location.origin}/?famiglie=${encodeURIComponent(data.token)}`;
    } catch (err) {
      console.error('Eccezione link famiglie', err);
      alert('Errore durante la creazione del link');
      return '';
    }
  }

  async function approveAll() {
    const toApprove = [...pendingRequests];
    if (toApprove.length === 0) return;
    if (!window.confirm(`Approvare tutte le ${toApprove.length} richieste in attesa?`)) return;

    let failed = 0;
    for (const request of toApprove) {
      try {
        const { data, error } = await callApi('decide-request', { requestId: request.id, action: 'approve' });
        if (error || !data?.ok) failed++;
      } catch {
        failed++;
      }
    }

    await loadSupabaseData();
    if (failed > 0) alert(`${failed} richieste non sono state approvate: riprova.`);
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
    const { data, error } = await callApi('modify-request', {
        requestId: modifyDraft.requestId,
        finalPoints: parsedPoints,
        note: modifyDraft.note,
        decidedBy: currentUser.name,
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
    const { data, error } = await callApi('add-boy', {
        name: cleanName,
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

  const movements = appState.requests.filter(request => request.userId === deleteBoyId).length;
  const confirmed = window.confirm(
    `Vuoi davvero eliminare ${userToDelete.name}?\n\nVerranno cancellati anche tutti i suoi ${movements} movimenti (punti, richieste, storico).\nNon si può annullare.`
  );
  if (!confirmed) return;

  try {
    const { data, error } = await callApi('delete-boy', {
        boyId: deleteBoyId,
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
    const { data, error } = await callApi('add-rule', {
        category,
        label,
        points: rawPoints,
        kind: newRuleKind,
        boySelectable: newRuleSelectable,
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

  const ruleToDelete = appState.rules.find(rule => rule.id === deleteRuleId);
  const confirmed = window.confirm(
    `Vuoi davvero eliminare la regola "${ruleToDelete?.label || deleteRuleId}"?\n\nI punti già assegnati restano, ma i ragazzi non potranno più sceglierla.`
  );
  if (!confirmed) return;

  try {
    const { data, error } = await callApi('delete-rule', {
        ruleId: deleteRuleId,
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
    const { data, error } = await callApi('update-rule', {
        ruleId: editRuleId,
        category,
        label,
        points: rawPoints,
        kind: editRuleKind,
        boySelectable: editRuleSelectable,
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
    const { data, error } = await callApi('delete-request', {
        requestId,
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
    const { data, error } = await callApi('update-boy', {
        boyId: editBoyId,
        name: cleanName,
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

  if (!operatorTargetUserId || !operatorRuleId) {
    alert('Seleziona il ragazzo e la voce');
    return;
  }

  try {
    const { data, error } = await callApi('add-manual-entry', {
        userId: operatorTargetUserId,
        ruleId: operatorRuleId,
        note: operatorNote,
        decidedBy: currentUser.name,
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
    const { data, error } = await callApi('add-manual-adjustment', {
        userId,
        points: Number(points),
        reason: reason?.trim() || '',
        decidedBy: currentUser.name,
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

  if (screen === 'loading' || (!sessionRestored && screen !== 'landing')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-orange-50 to-white">
        <div className="text-4xl font-black text-orange-600">FantaMas</div>
        <div className="text-neutral-500">Un attimo…</div>
      </div>
    );
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
        prizeStatus={prizeStatus}
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
      getLeaderboard={getLeaderboard}
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
        uploadPhoto={uploadPhoto}
        removePhoto={removePhoto}
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
        goToManage={() => setScreen('operator-manage')}
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
        approveAll={approveAll}
        startModify={startModify}
        saveModify={saveModify}
        goBack={() => setScreen('operator-home')}
        formatDate={formatDate}
      />
    );
  }
  if ((screen === 'operator-manual' || screen === 'operator-manage') && currentUser && operatorAccessGranted) {
    return (
      <OperatorManualScreen
        section={screen === 'operator-manage' ? 'manage' : 'points'}
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
        uploadPhoto={uploadPhoto}
        removePhoto={removePhoto}
        createFamilyLink={createFamilyLink}
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
        getLeaderboard={getLeaderboard}
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
        getLeaderboard={getLeaderboard}
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