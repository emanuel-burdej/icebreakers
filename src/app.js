const CARD_TYPE = {
    question: 'question',
    instantTask: 'instantTask',
    longTermChallenge: 'longTermChallenge'
};

const LEGACY_CARD_TYPE = {
    [String.fromCharCode(113)]: CARD_TYPE.question,
    [String.fromCharCode(116)]: CARD_TYPE.instantTask,
    [String.fromCharCode(108)]: CARD_TYPE.longTermChallenge
};

const DONATION_AMOUNT_DEFAULTS = {
    question: { eur: 1, czk: 25 },
    instantTask: { eur: 2, czk: 50 },
    longTermChallenge: { eur: 3, czk: 75 },
    pexesoInstantTask: { eur: 1, czk: 25 }
};

const LEGACY_DONATION_AMOUNT_DEFAULTS = {
    question: { eur: 2, czk: 50 },
    instantTask: { eur: 5, czk: 120 },
    longTermChallenge: { eur: 10, czk: 240 },
    pexesoInstantTask: { eur: 2, czk: 50 }
};

const LEGACY_MODE = {
    [String.fromCharCode(113, 117, 105, 99, 107, 95, 113)]: 'quickQuestions',
    [String.fromCharCode(112, 105, 99, 107)]: 'pickCards'
};

const MODE_I18N_KEY = {
    quickQuestions: 'modeQuickQuestions',
    wheel: 'modeWheel',
    pickCards: 'modePickCards',
    pexeso: 'modePexeso'
};

const MODE_DESC_I18N_KEY = {
    quickQuestions: 'descQuickQuestions',
    wheel: 'descWheel',
    pickCards: 'descPickCards',
    pexeso: 'descPexeso'
};

const PACK_I18N_KEY = {
    basic: 'pkgBasic',
    advanced: 'pkgAdvanced',
    collaboration: 'pkgCollaboration'
};

const DONATION_MODE_I18N_KEY = {
    all: 'donationModeAll',
    tasks_only: 'donationModeTasksOnly',
    long_only: 'donationModeLongOnly',
    off: 'donationModeOff'
};

function normalizeCardType(cardType) {
    return LEGACY_CARD_TYPE[cardType] || cardType || CARD_TYPE.question;
}

function normalizeMode(mode) {
    return LEGACY_MODE[mode] || mode;
}

function normalizeCard(card) {
    if (!card) return card;
    const legacyType = card[String.fromCharCode(116)];
    card.cardType = normalizeCardType(card.cardType || legacyType);
    delete card[String.fromCharCode(116)];
    return card;
}

function normalizeCards(cards = []) {
    return cards.map(normalizeCard);
}

function getCardTopics(card) {
    const rawTopics = card?.topics || card?.ideas || card?.inspiration;
    if (!rawTopics) return [];

    const topics = Array.isArray(rawTopics) ? rawTopics : (rawTopics[state.lang] || rawTopics.en || rawTopics.sk || rawTopics.cz || []);
    return Array.isArray(topics) ? topics.filter(Boolean) : [];
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeDonationAmounts(amounts = {}) {
    if (isLegacyDonationAmountDefaults(amounts)) {
        return { ...DONATION_AMOUNT_DEFAULTS };
    }

    return {
        ...DONATION_AMOUNT_DEFAULTS,
        question: amounts.question || amounts[String.fromCharCode(113)] || DONATION_AMOUNT_DEFAULTS.question,
        instantTask: amounts.instantTask || amounts[String.fromCharCode(116)] || DONATION_AMOUNT_DEFAULTS.instantTask,
        longTermChallenge: amounts.longTermChallenge || amounts[String.fromCharCode(108)] || DONATION_AMOUNT_DEFAULTS.longTermChallenge,
        pexesoInstantTask: amounts.pexesoInstantTask || amounts[`pexeso_${String.fromCharCode(116)}`] || DONATION_AMOUNT_DEFAULTS.pexesoInstantTask
    };
}

function isSameDonationAmount(a, b) {
    return Number(a?.eur) === b.eur && Number(a?.czk) === b.czk;
}

function isLegacyDonationAmountDefaults(amounts = {}) {
    const normalizedAmounts = {
        question: amounts.question || amounts[String.fromCharCode(113)],
        instantTask: amounts.instantTask || amounts[String.fromCharCode(116)],
        longTermChallenge: amounts.longTermChallenge || amounts[String.fromCharCode(108)],
        pexesoInstantTask: amounts.pexesoInstantTask || amounts[`pexeso_${String.fromCharCode(116)}`]
    };

    return Object.keys(LEGACY_DONATION_AMOUNT_DEFAULTS).every(key =>
        isSameDonationAmount(normalizedAmounts[key], LEGACY_DONATION_AMOUNT_DEFAULTS[key])
    );
}

function amountKeySuffix(key) {
    return key.charAt(0).toUpperCase() + key.slice(1);
}

function normalizeSessionData(data) {
    if (!data) return data;
    data.mode = normalizeMode(data.mode);
    data.appStyle = normalizeAppStyle(data.appStyle || localStorage.getItem('ib_app_style'));
    data.pool = normalizeCards(data.pool || []);
    data.history = normalizeCards(data.history || []);
    data.donationAmounts = normalizeDonationAmounts(data.donationAmounts || {});
    data.collaborationParticipants = data.collaborationParticipants || [];
    data.collaborationRemainingParticipants = data.collaborationRemainingParticipants || [];
    data.collaborationFlipped = data.collaborationFlipped || [];
    data.collaborationUsage = data.collaborationUsage || {};
    data.collaborationPairUsage = data.collaborationPairUsage || {};
    data.collaborationPairDeck = data.collaborationPairDeck || [];
    data.collaborationPendingPair = data.collaborationPendingPair || null;
    data.collaborationLastPairKey = data.collaborationLastPairKey || '';
    data.collaborationLastPair = data.collaborationLastPair || [];
    return data;
}
const storedDonationAmounts = JSON.parse(localStorage.getItem('ib_donation_amounts') || '{}');

let state = {
    lang: localStorage.getItem('ib_lang') || 'cz',
    theme: localStorage.getItem('ib_theme') || 'dark',
    appStyle: normalizeAppStyle(localStorage.getItem('ib_app_style')),
    orgName: localStorage.getItem('ib_org_name') || APP_STYLE_CONFIG.normal.orgName,
    donationMode: localStorage.getItem('ib_donation_mode') || 'all',
    donationAmounts: normalizeDonationAmounts(storedDonationAmounts),
    mode: null,
    cardStyle: null,
    pool: [],
    history: [],
    historyIndex: -1,
    answered: 0,
    sessionId: null,
    note: "",
    lastStyles: [],
    quickQCursor: 0,
    collaborationParticipants: [],
    collaborationRemainingParticipants: [],
    collaborationFlipped: [],
    collaborationUsage: {},
    collaborationPairUsage: {},
    collaborationPairDeck: [],
    collaborationPendingPair: null,
    collaborationLastPairKey: '',
    collaborationLastPair: [],
    isSpinning: false
};

if (isLegacyDonationAmountDefaults(storedDonationAmounts)) {
    localStorage.setItem('ib_donation_amounts', JSON.stringify(state.donationAmounts));
}

if (!localStorage.getItem('ib_app_style')) {
    localStorage.setItem('ib_app_style', state.appStyle);
    if (!localStorage.getItem('ib_org_name') || localStorage.getItem('ib_org_name') === APP_STYLE_CONFIG.unicorn.orgName) {
        state.orgName = APP_STYLE_CONFIG.normal.orgName;
        localStorage.setItem('ib_org_name', state.orgName);
    }
} else if (localStorage.getItem('ib_app_style') !== state.appStyle) {
    localStorage.setItem('ib_app_style', state.appStyle);
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTick() {
    try {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.frequency.value = 400; gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
        osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) { }
}

function playCardReveal() {
    try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToTimeValue(1200, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(now + 0.4);
    } catch (e) { }
}

window.onload = () => {
    applyTheme(state.theme || 'dark');
    applyAppStyle(state.appStyle || 'normal', { updateOrg: false });
    renderPacks();
    renderHomeHistory();
    document.getElementById('langSelect').value = state.lang;
    updateLang();
};

let activeModalConfig = null;

function getOrgName() {
    const config = getAppStyleConfig();
    return (localStorage.getItem('ib_org_name') || state.orgName || config.orgName).trim() || config.orgName;
}

function normalizeAppStyle(style) {
    if (style === 'classic') return 'normal';
    return APP_STYLE_CONFIG[style] ? style : 'normal';
}

function getAppStyleConfig(style = state.appStyle) {
    return APP_STYLE_CONFIG[normalizeAppStyle(style)] || APP_STYLE_CONFIG.normal;
}

function getAppCardStyles() {
    return getAppStyleConfig().cardStyles || APP_STYLE_CONFIG.normal.cardStyles;
}

function getQuestionCardMarks() {
    const textMarks = getAppCardStyles()
        .filter(style => style.type === 'text' && Array.isArray(style.items))
        .flatMap(style => style.items)
        .filter(Boolean);
    return textMarks.length ? textMarks : ['❓'];
}

function applyAppStyle(style, options = {}) {
    const nextStyle = normalizeAppStyle(style);
    const shouldUpdateOrg = options.updateOrg !== false;
    state.appStyle = nextStyle;
    localStorage.setItem('ib_app_style', nextStyle);
    document.body.dataset.appStyle = nextStyle;

    if (shouldUpdateOrg) {
        const orgName = getAppStyleConfig(nextStyle).orgName;
        state.orgName = orgName;
        localStorage.setItem('ib_org_name', orgName);
    }
}

function applyTheme(theme) {
    state.theme = theme === 'light' ? 'light' : 'dark';
    document.body.dataset.theme = state.theme;
    localStorage.setItem('ib_theme', state.theme);
    updateThemeToggle();
}

function updateThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const isLight = state.theme === 'light';
    btn.innerHTML = isLight
        ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>`
        : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"/></svg>`;
    btn.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    btn.setAttribute('aria-label', btn.title);
}

function toggleTheme() {
    applyTheme(state.theme === 'light' ? 'dark' : 'light');
    if (state.screen === 'mode') renderModeSelection();
    if (state.screen === 'settings') renderSettingsView();
    if (state.screen === 'history') renderHistoryList();
    renderPacks();
    renderHomeHistory();
    if (document.getElementById('result-area').style.display === 'flex' && state.historyIndex >= 0) {
        renderResult();
    }
    if (state.mode && document.getElementById('game-area').style.display === 'block') {
        renderGameView({ preservePickStyle: true });
    }
}

function renderSettingsView() {
    const appStyleSelect = document.getElementById('settings-app-style-select');
    if (appStyleSelect) {
        appStyleSelect.value = normalizeAppStyle(state.appStyle);
        Array.from(appStyleSelect.options).forEach(option => {
            option.text = i18nText(`appStyle${amountKeySuffix(option.value)}`);
        });
    }
    const valueEl = document.getElementById('settings-org-value');
    if (valueEl) valueEl.innerText = getOrgName();
    const donationModeSelect = document.getElementById('settings-donation-mode-select');
    if (donationModeSelect) {
        donationModeSelect.value = state.donationMode || 'all';
        Array.from(donationModeSelect.options).forEach(option => {
            option.text = i18nText(DONATION_MODE_I18N_KEY[option.value]);
        });
    }
    const amountKeys = ['question', 'instantTask', 'longTermChallenge', 'pexesoInstantTask'];
    amountKeys.forEach(key => {
        const el = document.getElementById(`settings-amount-${key.replace('_', '-')}-value`);
        if (el) {
            const amount = getDonationAmount(key);
            el.innerText = `${amount.eur}€ / ${amount.czk} CZK`;
        }
    });
}

function i18nText(key, vars = {}) {
    let text = I18N[state.lang][key] || '';
    Object.keys(vars).forEach(varKey => {
        text = text.replaceAll(`{${varKey}}`, vars[varKey]);
    });
    return text;
}

function resolveI18nValue(value) {
    if (!value) return "";
    if (typeof value === 'string') return value;
    if (value.i18nKey) return i18nText(value.i18nKey, value.vars || {});
    return "";
}

function renderVisualItem(item, className = '') {
    const normalized = typeof item === 'object' ? item : { type: 'text', value: item };
    if (normalized.type === 'image') {
        const label = normalized.label || '';
        return `<img class="${className}" src="${escapeHtml(normalized.value)}" alt="${escapeHtml(label)}">`;
    }
    return escapeHtml(normalized.value);
}

function getVisualItemKey(item) {
    const normalized = typeof item === 'object' ? item : { type: 'text', value: item };
    return `${normalized.type}:${normalized.value}`;
}

function generateUniqueNumbers(count, min = 1, max = 99) {
    const numbers = new Set();
    while (numbers.size < count) {
        numbers.add(String(Math.floor(Math.random() * (max - min + 1)) + min));
    }
    return [...numbers];
}

function instantiateCardStyle(style) {
    if (style.type !== 'numbers') return style;
    return {
        type: 'text',
        sourceType: 'numbers',
        items: generateUniqueNumbers(3)
    };
}

function shuffleItems(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

function getCollaborationTotalPairs(data = state) {
    return (data.answered || 0) + (data.pool ? data.pool.length : 0);
}

function getCollaborationAnsweredPairs(data = state) {
    return data.answered || 0;
}

function isCollaborationPexeso(data = state) {
    return data.packKey === 'collaboration' && normalizeMode(data.mode) === 'pexeso';
}

function getCollaborationPairKey(pair) {
    return [...pair].sort((a, b) => a.localeCompare(b)).join('||');
}

function getCollaborationUsage(name) {
    return Number(state.collaborationUsage?.[name] || 0);
}

function getCollaborationPairUsage(pair) {
    return Number(state.collaborationPairUsage?.[getCollaborationPairKey(pair)] || 0);
}

function makeCollaborationPairs(names) {
    const pairs = [];
    for (let i = 0; i < names.length; i++) {
        for (let j = i + 1; j < names.length; j++) {
            pairs.push([names[i], names[j]]);
        }
    }
    return pairs;
}

function parseCollaborationPairKey(key) {
    return String(key || '').split('||').filter(Boolean);
}

function refreshCollaborationPairDeck() {
    const pairs = makeCollaborationPairs(state.collaborationParticipants || []);
    const lastPairKey = state.collaborationLastPairKey || '';
    const unusedPairs = pairs.filter(pair => getCollaborationPairUsage(pair) === 0);
    let deck = shuffleItems((unusedPairs.length ? unusedPairs : pairs).map(pair => getCollaborationPairKey(pair)));

    if (deck.length > 1 && deck[0] === lastPairKey) {
        deck.push(deck.shift());
    }

    state.collaborationPairDeck = deck;
}

function getNextCollaborationPair() {
    const participantSet = new Set(state.collaborationParticipants || []);
    let deck = (state.collaborationPairDeck || []).filter(key => {
        const pair = parseCollaborationPairKey(key);
        return pair.length === 2 && pair.every(name => participantSet.has(name));
    });

    if (!deck.length) {
        refreshCollaborationPairDeck();
        deck = state.collaborationPairDeck || [];
    }

    if (!deck.length) return [];

    const pairKey = pickNextCollaborationPairKey(deck);
    state.collaborationPairDeck = deck.filter(key => key !== pairKey);
    return parseCollaborationPairKey(pairKey);
}

function getRecentCollaborationPairs(limit = 2) {
    return (state.history || [])
        .slice()
        .reverse()
        .filter(card => Array.isArray(card.assignees) && card.assignees.length === 2)
        .slice(0, limit)
        .map(card => card.assignees);
}

function pickNextCollaborationPairKey(deck) {
    const recentPairs = getRecentCollaborationPairs(2);
    const lastPairKey = state.collaborationLastPairKey || '';
    const scored = deck.map(key => {
        const pair = parseCollaborationPairKey(key);
        const lastOverlap = recentPairs[0] ? pair.filter(name => recentPairs[0].includes(name)).length : 0;
        const previousOverlap = recentPairs[1] ? pair.filter(name => recentPairs[1].includes(name)).length : 0;
        const recentAppearances = pair.reduce((total, name) => {
            return total + recentPairs.flat().filter(recentName => recentName === name).length;
        }, 0);
        const score =
            (key === lastPairKey ? 10000 : 0) +
            (lastOverlap * 120) +
            (previousOverlap * 35) +
            (recentAppearances * 20) +
            (pair.reduce((total, name) => total + getCollaborationUsage(name), 0) * 2);

        return { key, score };
    });
    const minScore = Math.min(...scored.map(item => item.score));
    const best = scored.filter(item => item.score === minScore);
    return best[Math.floor(Math.random() * best.length)].key;
}

function moveCollaborationNameToIndex(name, targetIdx) {
    const board = state.collaborationBoard || [];
    const sourceIdx = board.findIndex((item, index) => item === name && index !== targetIdx);
    if (sourceIdx >= 0) {
        [board[targetIdx], board[sourceIdx]] = [board[sourceIdx], board[targetIdx]];
    } else {
        board[targetIdx] = name;
    }

    return targetIdx;
}

function getStyleHistoryKey(style) {
    return style.sourceType || style.type;
}

function isDonationEnabledForCard(card) {
    const type = normalizeCardType(card?.cardType || card?.[String.fromCharCode(116)]);
    const mode = state.donationMode || 'all';

    if (mode === 'off') return false;
    if (mode === 'all') return [CARD_TYPE.question, CARD_TYPE.instantTask, CARD_TYPE.longTermChallenge].includes(type);
    if (mode === 'tasks_only') return [CARD_TYPE.instantTask, CARD_TYPE.longTermChallenge].includes(type);
    if (mode === 'long_only') return type === CARD_TYPE.longTermChallenge;
    return true;
}

function updateAppStyleFromSelect() {
    const select = document.getElementById('settings-app-style-select');
    if (!select) return;
    applyAppStyle(select.value, { updateOrg: true });
    state.cardStyle = null;
    state.pexesoBoard = [];
    saveCurrentState();
    renderSettingsView();
    renderPacks();
    renderHomeHistory();
    if (state.mode && document.getElementById('game-area').style.display === 'block') {
        renderGameView();
    }
    if (state.historyIndex >= 0 && document.getElementById('result-area').style.display === 'flex') {
        renderResult();
    }
}

function getDonationAmount(key) {
    const amounts = normalizeDonationAmounts(state.donationAmounts || {});
    return amounts[key] || DONATION_AMOUNT_DEFAULTS[key];
}

window.onclick = (event) => {
    if (!event.target.matches('.dot-btn')) {
        document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
        document.querySelectorAll('.history-card').forEach(c => c.classList.remove('menu-open'));
    }
    if (event.target.id === 'modal') closeModal();
};

function showModal({ title, type, value, desc, onConfirm, isDanger, customHtml }) {
    activeModalConfig = { title, type, value, desc, onConfirm, isDanger, customHtml };
    const modal = document.getElementById('modal');
    const inputT = document.getElementById('modal-input-text');
    const inputA = document.getElementById('modal-input-area');
    const descEl = document.getElementById('modal-desc');
    const confirmBtn = document.getElementById('modal-confirm');
    const modalBody = document.getElementById('modal-body');

    // Vymazať predchádzajúci vlastný obsah (ak nejaký bol)
    const customEl = document.getElementById('modal-custom-content');
    if (customEl) customEl.remove();

    document.getElementById('modal-title').innerText = resolveI18nValue(title);
    inputT.style.display = type === 'text' ? 'block' : 'none';
    inputA.style.display = type === 'area' ? 'block' : 'none';
    descEl.style.display = desc ? 'block' : 'none';
    if (desc) descEl.innerText = resolveI18nValue(desc);

    if (type === 'text') inputT.value = value || '';
    if (type === 'area') inputA.value = value || '';

    if (customHtml) {
        const div = document.createElement('div');
        div.id = 'modal-custom-content';
        div.innerHTML = customHtml;
        modalBody.appendChild(div);
    }

    confirmBtn.style.background = isDanger ? 'var(--accent)' : 'var(--primary)';
    confirmBtn.onclick = () => {
        const result = type === 'text' ? inputT.value : (type === 'area' ? inputA.value : true);
        onConfirm(result);
        closeModal();
    };

    modal.classList.add('active');
    if (type === 'text') setTimeout(() => inputT.focus(), 100);
    if (type === 'area') setTimeout(() => inputA.focus(), 100);
}

function closeModal() {
    activeModalConfig = null;
    document.getElementById('modal').classList.remove('active');
}

function getSessionKeys() {
    return Object.keys(localStorage).filter(k => k.startsWith('S-')).sort().reverse();
}

function getSessionData(key) {
    return normalizeSessionData(JSON.parse(localStorage.getItem(key)));
}

function getSessionMeta(data) {
    const isQuickQuestions = data.mode === 'quickQuestions';
    const isCollaboration = isCollaborationPexeso(data);
    const historyQuestions = isQuickQuestions ? (data.history || []).filter(card => card.cardType === 'question').length : 0;
    const poolQuestions = isQuickQuestions ? (data.pool || []).filter(card => card.cardType === 'question').length : 0;
    const total = isCollaboration ? getCollaborationTotalPairs(data) : (isQuickQuestions ? historyQuestions + poolQuestions : data.answered + (data.pool ? data.pool.length : 0));
    const answered = isCollaboration ? getCollaborationAnsweredPairs(data) : (isQuickQuestions ? historyQuestions : data.answered);
    const packKey = (data.packKey || 'basic').toLowerCase().replace(' ', '_');
    return {
        total,
        answered,
        title: data.title || data.date || I18N[state.lang].session,
        packName: I18N[state.lang][PACK_I18N_KEY[packKey]] || I18N[state.lang][packKey] || data.packKey || '...',
        modeName: I18N[state.lang][MODE_I18N_KEY[normalizeMode(data.mode)]] || '',
        modeIcon: ICONS[data.mode] || ''
    };
}

function closeAllMenus() {
    document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
    document.querySelectorAll('.history-card').forEach(c => c.classList.remove('menu-open'));
}

function refreshHistoryViews() {
    renderHomeHistory();
    if (state.screen === 'history') renderHistoryList();
}

function getHistoryMenuHtml(key, data) {
    return `
                <div class="dropdown-item" onclick="event.stopPropagation(); renameHistoryItem('${key}')">${I18N[state.lang].rename}</div>
                ${data.packKey !== 'collaboration'
                    ? `<div class="dropdown-item" onclick="event.stopPropagation(); changeHistoryMode('${key}')">${I18N[state.lang].changeMode}</div>`
                    : `<div class="dropdown-item" onclick="event.stopPropagation(); editHistoryParticipants('${key}')">${I18N[state.lang].editParticipants}</div>`}
                <div class="dropdown-item" onclick="event.stopPropagation(); editHistoryNote('${key}')">${I18N[state.lang].editNote}</div>
                <div class="dropdown-item" onclick="event.stopPropagation(); deleteHistoryItem('${key}')">${I18N[state.lang].delete}</div>
            `;
}

function renderHomeHistory() {
    const list = document.getElementById('home-history-list');
    const keys = getSessionKeys();
    list.innerHTML = "";

    const counterEl = document.getElementById('history-counter');
    if (counterEl) counterEl.innerText = keys.length > 0 ? `(${keys.length})` : "";

    if (keys.length === 0) {
        list.innerHTML = `<p style="font-size:0.8rem; color:var(--text-dim); padding: 0 15px;">${I18N[state.lang].noHistory}</p>`;
        return;
    }

    keys.forEach(key => {
        const data = getSessionData(key);
        const meta = getSessionMeta(data);

        const card = document.createElement('div');
        card.className = 'history-card';
        card.id = `card-home-${key}`;
        card.style = 'padding: 15px; margin-bottom: 12px; cursor: pointer;';
        card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div onclick="loadFromHistory('${key}')" style="display:flex; align-items:center; gap:12px; flex-grow:1;">
                            <div style="color:var(--text-dim); opacity:0.6;">${meta.modeIcon}</div>
                            <div style="flex-grow:1;">
                                <div style="color:var(--primary); font-weight:700; margin-bottom:4px; text-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">${meta.title}</div>
                                <div style="font-size:0.7rem; opacity:0.6;">${meta.packName} • ${meta.modeName} • ${meta.answered}/${meta.total}</div>
                            </div>
                        </div>
                        <div class="dot-menu">
                            <button class="dot-btn" onclick="event.stopPropagation(); toggleMenu('${key}', true)">⋮</button>
                            <div id="menu-${key}" class="dropdown-content">${getHistoryMenuHtml(key, data)}</div>
                        </div>
                    </div>
                    ${data.note ? `<div style="margin-top:10px; font-size:0.75rem; opacity:0.5; border-top:1px solid var(--border); padding-top:8px;">${data.note}</div>` : ''}
                `;
        list.appendChild(card);
    });
}

function toggleMenu(key, isHome = false) {
    const menu = document.getElementById(`menu-${key}`);
    const isShowing = menu.classList.contains('show');

    closeAllMenus();

    if (!isShowing) {
        menu.classList.add('show');
        const card = isHome ? document.getElementById(`card-home-${key}`) : document.getElementById(`card-full-${key}`);
        if (card) card.classList.add('menu-open');
    }
}

function saveCurrentState() {
    localStorage.setItem('ib_current_session', JSON.stringify(state));
    if (state.sessionId && state.mode) {
        const data = JSON.parse(localStorage.getItem(state.sessionId)) || { date: new Date().toLocaleString() };
        localStorage.setItem(state.sessionId, JSON.stringify({ ...data, ...state }));
    }
}

function manualSaveNote() {
    state.note = document.getElementById('noteInput').value;
    saveCurrentState();
    const btn = document.getElementById('saveNoteBtn');
    const originalText = I18N[state.lang].saveNote;
    btn.innerText = I18N[state.lang].noteSaved;
    setTimeout(() => btn.innerText = originalText, 2000);
}

function calculateDonations() {
    // Pred spustením uložíme aktuálny stav poznámok
    state.note = document.getElementById('noteInput').value;
    saveCurrentState();

    const lines = state.note.split('\n');
    const data = {}; // { "Meno Priezvisko": { eur: 0, czk: 0 } }
    const orgName = getOrgName();

    lines.forEach(line => {
        const hasCurrentOrg = line.includes(`➕ ${orgName}`) || line.includes(`📌 ${orgName}`);
        const hasLegacyOrg = line.includes("➕ GeeGee") || line.includes("📌 GeeGee");
        if (!hasCurrentOrg && !hasLegacyOrg) return;

        let eur = 0, czk = 0;
        const configuredAmounts = Object.values(state.donationAmounts || {});
        const matchedAmount = configuredAmounts.find(amount =>
            line.includes(`${amount.eur}€`) && line.includes(`${amount.czk} CZK`)
        );
        if (matchedAmount) {
            eur = matchedAmount.eur;
            czk = matchedAmount.czk;
        }

        const lastOpen = line.lastIndexOf('(');
        const lastClose = line.lastIndexOf(')');
        if (lastOpen === -1 || lastClose === -1 || lastOpen > lastClose) return;

        const namesStr = line.substring(lastOpen + 1, lastClose);
        const names = namesStr.split(',')
            .map(n => n.replace('...', '').trim())
            .filter(n => n &&
                !n.includes("Meno Priezvisko") &&
                !n.includes("Jméno Příjmení") &&
                !n.includes("Name Surname")
            );

        names.forEach(fullName => {
            if (!data[fullName]) data[fullName] = { eur: 0, czk: 0 };
            data[fullName].eur += eur;
            data[fullName].czk += czk;
        });
    });

    const sortedNames = Object.keys(data).sort();

    if (sortedNames.length === 0) {
        showModal({
            title: { i18nKey: 'calcResultsTitle' },
            desc: { i18nKey: 'calcResultsEmpty', vars: { org: orgName } },
            onConfirm: () => { }
        });
        return;
    }

    let tableHtml = `
                <div style="max-height: 350px; overflow-y: auto; margin-bottom: 20px; padding-right: 5px;">
                    <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left; color:var(--modal-table-text);">
                        <thead>
                            <tr style="border-bottom:2px solid var(--border); color:var(--text-dim);">
                                <th style="padding:10px 5px;">${I18N[state.lang].colName}</th>
                                <th style="padding:10px 5px;">${I18N[state.lang].colSurname}</th>
                                <th style="padding:10px 5px; text-align:right;">${I18N[state.lang].colTotal}</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

    sortedNames.forEach(fullName => {
        const parts = fullName.split(/\s+/);
        const name = parts[0];
        const surname = parts.slice(1).join(' ') || "-";
        tableHtml += `
                    <tr style="border-bottom:1px solid var(--border);">
                        <td style="padding:10px 5px; font-weight:600;">${name}</td>
                        <td style="padding:10px 5px;">${surname}</td>
                        <td style="padding:10px 5px; text-align:right; color:var(--primary); font-weight:700; white-space:nowrap;">
                            ${data[fullName].eur}€ / ${data[fullName].czk} CZK
                        </td>
                    </tr>
                `;
    });

    tableHtml += `</tbody></table></div>`;

    showModal({
        title: { i18nKey: 'calcResultsTitle' },
        customHtml: tableHtml,
        onConfirm: () => { }
    });
}

function getAvailableModes(packKey) {
    return packKey === 'collaboration' ? ['pexeso'] : ['quickQuestions', 'wheel', 'pickCards'];
}

function renderModeSelection() {
    const container = document.getElementById('modes-container');
    if (!container) return;
    container.innerHTML = "";

    const modes = getAvailableModes(state.packKey);
    modes.forEach(m => {
        const icon = ICONS[m].replace('width="22"', 'width="28"').replace('height="22"', 'height="28"');

        const div = document.createElement('div');
        div.className = 'glass';
        div.style = 'padding: 20px; margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 18px;';
        div.onclick = () => selectMode(m);
        div.innerHTML = `
                        <div style="color: var(--text-dim); opacity: 0.75; flex-shrink: 0; width: 32px; display: flex; align-items: center; justify-content: center;">${icon}</div>
                    <div style="flex-grow: 1;">
                        <div style="color: var(--text); font-weight: 700; font-size: 1.1rem; margin-bottom: 4px;">
            ${I18N[state.lang][MODE_I18N_KEY[m]]}
                        </div>
                        <div style="font-size: 0.75rem; opacity: 0.6; line-height: 1.4;">
                            ${I18N[state.lang][MODE_DESC_I18N_KEY[m]]}
                        </div>
                    </div>
                    <div style="background: var(--primary); width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); flex-shrink: 0;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                `;
        container.appendChild(div);
    });
}

function showScreen(id, direction = 'forward') {
    if (id === 'mode') {
        renderModeSelection();
    }
    if (id === 'settings') {
        renderSettingsView();
    }
    const target = document.getElementById(`screen-${id}`);
    if (!target) return;

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    target.style.animation = direction === 'forward' ? 'slideInRight 0.4s ease-out' : 'slideInLeft 0.4s ease-out';

    setTimeout(() => {
        target.classList.add('active');
        state.screen = id;
        if (id === 'start') {
            renderHomeHistory();
        }
    }, 50);
}

function handleGameBack() {
    if (state.packKey === 'collaboration') {
        state.collaborationEditingParticipants = true;
        renderGameView();
        return;
    }
    showScreen('mode', 'back');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
    document.getElementById('active-notes-section').style.display = state.sessionId ? 'block' : 'none';
}



function updateLang() {
    state.lang = document.getElementById('langSelect').value;
    localStorage.setItem('ib_lang', state.lang);

    // Preklad statických prvkov rozhrania
    document.querySelectorAll('[data-i18n]').forEach(el => el.innerText = I18N[state.lang][el.dataset.i18n]);
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = I18N[state.lang][el.dataset.i18nPlaceholder]);

    // Ak je zobrazený výsledok (otázka/úloha), okamžite ho preložíme
    const resArea = document.getElementById('result-area');
    if (resArea && resArea.style.display === 'flex' && state.historyIndex >= 0) {
        renderResult();
    }

    // Ak je zobrazená hra (napr. gratulácia), okamžite ju preložíme
    const gameArea = document.getElementById('game-area');
    if (gameArea && gameArea.style.display === 'block') {
        renderGameView({ preservePickStyle: true });
    }

    // Aktualizujeme aj štatistiky (názov módu)
    if (state.mode) updateStats();

    // Aktualizujeme balíčky na domovskej obrazovke
    renderPacks();

    // Aktualizujeme históriu na domovskej obrazovke
    renderHomeHistory();

    // Ak je zobrazený výber módu, aktualizujeme ho
    if (state.screen === 'mode') renderModeSelection();

    if (state.screen === 'settings') renderSettingsView();

    // Ak je zobrazená celá história, aktualizujeme ju
    if (state.screen === 'history') renderHistoryList();

    if (document.getElementById('result-area').style.display === 'flex' && state.historyIndex >= 0) {
        renderResult();
    }

    const modal = document.getElementById('modal');
    if (modal && modal.classList.contains('active') && activeModalConfig) {
        const inputT = document.getElementById('modal-input-text');
        const inputA = document.getElementById('modal-input-area');
        if (activeModalConfig.type === 'text') activeModalConfig.value = inputT.value;
        if (activeModalConfig.type === 'area') activeModalConfig.value = inputA.value;
        showModal(activeModalConfig);
    }
}

function renderPacks() {
    const container = document.getElementById('packs-container');
    if (!container) return;
    container.innerHTML = "";

    Object.keys(PACKS).forEach(key => {
        const questions = PACKS[key];
        const counts = {
            question: 0,
            instantTask: 0,
            longTermChallenge: 0
        };
        questions.forEach(item => counts[normalizeCardType(item.cardType)]++);

        const name = I18N[state.lang][PACK_I18N_KEY[key]] || key;
        let subParts = [];
        if (counts.question > 0) subParts.push(`${counts.question} ${I18N[state.lang].countQuestion}`);
        if (counts.instantTask > 0) subParts.push(`${counts.instantTask} ${I18N[state.lang].countInstantTask}`);
        if (counts.longTermChallenge > 0) subParts.push(`${counts.longTermChallenge} ${I18N[state.lang].countLongTermChallenge}`);
        const sub = subParts.join(' • ');

        const isCollab = key === 'collaboration';
        const modeList = getAvailableModes(key);
        const modeHtml = modeList.map(m => {
            const icon = ICONS[m].replace('width="22"', 'width="14"').replace('height="22"', 'height="14"');
            return `<span style="display:inline-flex; align-items:center; gap:4px; vertical-align:middle;">${icon} ${I18N[state.lang][MODE_I18N_KEY[m]]}</span>`;
        }).join('<span style="opacity:0.2; margin:0 6px;">|</span>');

        const div = document.createElement('div');
        div.className = 'glass';
        div.style = 'cursor: pointer; margin-bottom: 20px; border-left: 4px solid var(--primary); padding: 25px;';
        div.onclick = () => startNewSession(key);
        div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="flex-grow: 1;">
                            <h3 style="margin-bottom: 5px; font-size: 1.25rem;">${name}</h3>
                            <p style="font-size: 0.88rem; color: var(--text-dim); line-height: 1.4;">${sub}</p>
                            <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 4px; line-height: 1.4;">${modeHtml}</p>
                        </div>
                        <div style="background: var(--primary); width: 48px; height: 48px; border-radius: 16px; display:flex; align-items:center; justify-content:center; color: white; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); flex-shrink:0; margin-left:15px;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                `;
        container.appendChild(div);
    });
}

function startNewSession(packKey) {
    state.sessionId = 'S-' + Date.now();
    state.packKey = packKey;
    state.date = new Date().toLocaleString();
    state.title = "";
    state.pool = shuffleItems(normalizeCards([...PACKS[packKey]]));
    state.history = [];
    state.historyIndex = -1;
    state.answered = 0;
    state.note = "";
    state.quickQCursor = 0;
    state.cardStyle = null;
    state.pexesoBoard = [];
    state.pexesoFlipped = [];
    state.pexesoResult = null;
    state.collaborationParticipants = [];
    state.collaborationRemainingParticipants = [];
    state.collaborationFlipped = [];
    state.collaborationUsage = {};
    state.collaborationPairUsage = {};
    state.collaborationPairDeck = [];
    state.collaborationPendingPair = null;
    state.collaborationLastPairKey = '';
    state.collaborationLastPair = [];
    document.getElementById('noteInput').value = "";

    saveCurrentState();
    if (packKey === 'collaboration') {
        selectMode('pexeso');
    } else {
        showScreen('mode');
    }
}

function resumeSession() {
    state = normalizeSessionData(JSON.parse(localStorage.getItem('ib_current_session')));
    applyAppStyle(state.appStyle || localStorage.getItem('ib_app_style') || 'normal', { updateOrg: false });
    document.getElementById('noteInput').value = state.note || "";
    showScreen(state.mode ? 'game' : 'mode');
    if (state.mode) { updateStats(); renderGameView(); }
}
function selectMode(mode) {
    state.mode = normalizeMode(mode);
    saveCurrentState();
    showScreen('game');
    updateStats();
    renderGameView();
}

function showNextQuestionCard() {
    const questionIdx = state.pool.findIndex(c => c.cardType === 'question');
    if (questionIdx !== -1) {
        revealCard(questionIdx);
        return;
    }
    renderGameView();
}

function updateStats() {
    const packKey = (state.packKey || 'basic').toLowerCase().replace(' ', '_');
    const packName = I18N[state.lang][PACK_I18N_KEY[packKey]] || state.packKey;
    const modeName = I18N[state.lang][MODE_I18N_KEY[normalizeMode(state.mode)]];
    const total = isCollaborationPexeso()
        ? getCollaborationTotalPairs()
        : (state.mode === 'quickQuestions'
            ? (state.history ? state.history.filter(card => card.cardType === 'question').length : 0) + (state.pool ? state.pool.filter(card => card.cardType === 'question').length : 0)
            : state.answered + (state.pool ? state.pool.length : 0));
    const answered = isCollaborationPexeso()
        ? getCollaborationAnsweredPairs()
        : (state.mode === 'quickQuestions'
            ? (state.history ? state.history.filter(card => card.cardType === 'question').length : 0)
            : state.answered);
    const title = state.title || state.date || I18N[state.lang].session;

    document.getElementById('header-pack').innerText = title;
    document.getElementById('header-progress').innerText = `${packName} • ${modeName} • ${answered} / ${total}`;
}

function renderGameView(options = {}) {
    const preservePickStyle = Boolean(options.preservePickStyle);
    const area = document.getElementById('game-area');
    const res = document.getElementById('result-area');
    area.style.display = 'block'; res.style.display = 'none';
    area.innerHTML = "";

    updateStats();

    const remainingQuestions = state.pool ? state.pool.filter(card => card.cardType === 'question').length : 0;

    if (isCollaborationPexeso()) {
        renderCollaborationPexeso(area);
        return;
    }

    if (state.mode === 'quickQuestions' && remainingQuestions === 0) {
        area.innerHTML = `<div style="text-align:center; padding: 40px 20px; color: var(--text-dim);"><h3 style="margin-bottom:10px;">${I18N[state.lang].congratsTitle}</h3><p>${I18N[state.lang].congratsDesc}</p></div>`;
        return;
    }

    if (state.pool.length === 0) {
        area.innerHTML = `<div style="text-align:center; padding: 40px 20px; color: var(--text-dim);"><h3 style="margin-bottom:10px;">${I18N[state.lang].congratsTitle}</h3><p>${I18N[state.lang].congratsDesc}</p></div>`;
        return;
    }

    if (state.mode === 'wheel') {
        let slots = getWheelSlots();
        let lines = '';
        let labels = '';
        const segments = 8;

        for (let i = 0; i < segments; i++) {
            const angle = (i * 360 / segments);
            const x = 50 + 48 * Math.cos(Math.PI * angle / 180);
            const y = 50 + 48 * Math.sin(Math.PI * angle / 180);
            lines += `<line x1="50" y1="50" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.2)" stroke-width="0.3"/>`;

            const midAngle = angle + 22.5;
            const radius = 32;
            const textX = 50 + radius * Math.cos(Math.PI * midAngle / 180);
            const textY = 50 + radius * Math.sin(Math.PI * midAngle / 180);

            const wTxt = {
                sk: {
                    question: ["Otázka", ""],
                    instantTask: ["Okamžitá", "úloha"],
                    longTermChallenge: ["Dlhodobá", "výzva"]
                },
                cz: {
                    question: ["Otázka", ""],
                    instantTask: ["Okamžitý", "úkol"],
                    longTermChallenge: ["Dlouhodobá", "výzva"]
                },
                en: {
                    question: ["Question", ""],
                    instantTask: ["Instant", "Task"],
                    longTermChallenge: ["Long-term", "Challenge"]
                }
            };
            const langTxt = wTxt[state.lang] || wTxt['sk'];

            let label1 = "";
            let label2 = "";
            if (slots[i] === CARD_TYPE.question) { label1 = langTxt.question[0]; label2 = langTxt.question[1]; }
            else if (slots[i] === CARD_TYPE.instantTask) { label1 = langTxt.instantTask[0]; label2 = langTxt.instantTask[1]; }
            else if (slots[i] === CARD_TYPE.longTermChallenge) { label1 = langTxt.longTermChallenge[0]; label2 = langTxt.longTermChallenge[1]; }

            let rotation = midAngle + 90;
            if (rotation > 90 && rotation <= 270) {
                rotation -= 180;
            }

            labels += `<text x="${textX}" y="${textY}" fill="white" font-size="3.5" font-weight="bold" text-anchor="middle" dominant-baseline="central" transform="rotate(${rotation}, ${textX}, ${textY})">`;
            if (label2) {
                labels += `<tspan x="${textX}" dy="-2.2">${label1}</tspan>`;
                labels += `<tspan x="${textX}" dy="4.4">${label2}</tspan>`;
            } else {
                labels += `<tspan x="${textX}" dy="0">${label1}</tspan>`;
            }
            labels += `</text>`;
        }

        let lights = '';
        for (let i = 0; i < 24; i++) {
            const ang = (i * 360 / 24);
            const lx = 50 + 46.5 * Math.cos(Math.PI * ang / 180);
            const ly = 50 + 46.5 * Math.sin(Math.PI * ang / 180);
            lights += `<circle cx="${lx}" cy="${ly}" r="0.6" class="wheel-light"/>`;
        }

        area.innerHTML = `
                    <div class="wheel-container" onclick="spinWheel()" style="cursor: pointer;">
                        <div class="wheel-pointer" style="left: auto; right: -25px; top: 47%; transform: translateY(-50%);">${getAppStyleConfig().wheelPointer}</div>
                        <svg id="wheel-svg" viewBox="0 0 100 100" style="overflow: visible;">
                            <defs>
                                <radialGradient id="wheel-grad" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" style="stop-color:#4f46e5"/>
                                    <stop offset="100%" style="stop-color:#7c3aed"/>
                                </radialGradient>
                            </defs>
                            <circle cx="50" cy="50" r="48" fill="url(#wheel-grad)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                            <g id="wheel-main-group">
                                ${lines}
                                ${labels}
                                ${lights}
                            </g>
                        </svg>
                    </div>
                    <button id="spin-btn" class="btn" onclick="spinWheel()">${I18N[state.lang].spin}</button>`;
    } else if (state.mode === 'quickQuestions') {
        const questions = (state.pool || [])
            .map((card, index) => ({ card, index }))
            .filter(item => item.card.cardType === 'question');

        if (!questions.length) {
            area.innerHTML = `<div style="text-align:center; padding: 40px 20px; color: var(--text-dim);"><h3 style="margin-bottom:10px;">${I18N[state.lang].congratsTitle}</h3><p>${I18N[state.lang].congratsDesc}</p></div>`;
            return;
        }

        state.quickQCursor = Number.isFinite(state.quickQCursor)
            ? ((state.quickQCursor % questions.length) + questions.length) % questions.length
            : 0;

        const cardMarks = getQuestionCardMarks();

        const cardsHtml = questions.map((item, order) => `
    <div class="question-fan-card"
        data-question-index="${item.index}"
        data-question-order="${order}"
        data-rotate="${order % 2 === 0 ? '-1' : '1'}"
        onclick="selectQuickQuestion(${item.index}, ${order})">

        <div class="question-card-mark">${cardMarks[order % cardMarks.length]}</div>

        <div class="question-fan-card-inner">
            <div class="question-fan-badge">${I18N[state.lang].question}</div>
        </div>
    </div>
`).join('');

        area.innerHTML = `
                    <div class="question-fan-wrap">
                        <div class="question-fan-help">${I18N[state.lang].descQuickQuestions}</div>
                        <div class="question-fan-shell">
                            <button class="question-fan-arrow left" onclick="stepQuickQuestionFan(-1)">◀</button>
                            <button class="question-fan-arrow right" onclick="stepQuickQuestionFan(1)">▶</button>
                            <div class="question-fan-stage">
                                <div id="question-fan" class="question-fan" data-total="${questions.length}">${cardsHtml}</div>
                            </div>
                        </div>
                    </div>
                `;

        setupQuickQuestionFan();
    } else if (state.mode === 'pickCards') {
        if (!preservePickStyle || !state.cardStyle) {
            // Vygenerujeme náhodný vizuál, ktorý nie je rovnaký ako posledné dva
            let newStyle;
            const cardStyles = getAppCardStyles();
            do {
                newStyle = instantiateCardStyle(cardStyles[Math.floor(Math.random() * cardStyles.length)]);
            } while (state.lastStyles && state.lastStyles.includes(getStyleHistoryKey(newStyle)));

            state.cardStyle = newStyle;

            // Uložíme si históriu posledných dvoch štýlov
            if (!state.lastStyles) state.lastStyles = [];
            state.lastStyles = [getStyleHistoryKey(newStyle), ...state.lastStyles].slice(0, 2);

            saveCurrentState();
            playCardReveal();
        }

        const style = state.cardStyle;
        let html = '<div class="card-grid">';
        let slots = getWheelSlots();
        for (let i = 0; i < Math.min(3, state.pool.length); i++) {
            const content = style.items[i];
            const isColor = style.type === 'color';
            const displayText = isColor
                ? `<div class="card-color-swatch" style="background-color: ${content}; box-shadow: 0 0 20px ${content}55;"></div>`
                : renderVisualItem({ type: style.type, value: content }, 'card-item-image');

            const action = slots[Math.floor(Math.random() * slots.length)];
            html += `<div class="card-item" onclick="handleWheelAction('${action}')">${displayText}</div>`;
        }
        html += '</div>';
        area.innerHTML = html;
    } else if (state.mode === 'pexeso') {
        if (!state.pexesoBoard || state.pexesoBoard.length === 0) {
            let selectedItems = getAppStyleConfig().pexesoItems.slice(0, 3);
            let board = [...selectedItems, ...selectedItems];
            board.sort(() => Math.random() - 0.5);
            state.pexesoBoard = board;
            state.pexesoFlipped = [];
            state.pexesoResult = null;
            saveCurrentState();
        }

        let html = '<div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 300px; margin: 0 auto;">';
        for (let i = 0; i < state.pexesoBoard.length; i++) {
            const isFlipped = state.pexesoFlipped.includes(i);
            const content = isFlipped ? renderVisualItem(state.pexesoBoard[i], 'pexeso-card-image') : '?';
            const bg = isFlipped ? 'var(--primary)' : 'var(--glass-bg)';
            const color = isFlipped ? 'white' : 'var(--text)';

            html += `
                        <div onclick="flipPexesoCard(${i})" 
                             style="background: ${bg}; color: ${color}; 
                                    height: 80px; display:flex; align-items:center; justify-content:center; 
                                    font-size: 2rem; border-radius: 12px; cursor: pointer; transition: 0.3s;
                                    border: 1px solid var(--border); box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            ${content}
                        </div>
                    `;
        }
        html += '</div>';
        area.innerHTML = html;
    }
}

function renderCollaborationPexeso(area) {
    if (state.collaborationEditingParticipants || !state.collaborationParticipants || state.collaborationParticipants.length < 2) {
        renderCollaborationParticipantsEditor(area, state.collaborationParticipants || []);
        return;
    }

    const participants = state.collaborationParticipants || [];

    if (!state.pool || state.pool.length === 0) {
        area.innerHTML = `<div class="collab-finished"><h3>${I18N[state.lang].congratsTitle}</h3><p>${I18N[state.lang].congratsDesc}</p></div>`;
        return;
    }

    if (!state.collaborationBoard || state.collaborationBoard.length !== participants.length) {
        state.collaborationBoard = shuffleItems(participants);
        state.collaborationFlipped = [];
        saveCurrentState();
    }

    const selectedCount = state.collaborationFlipped?.length || 0;
    const columns = getCollaborationGridColumns(state.collaborationBoard.length);
    let html = `
        <div class="collab-board-wrap">
            <div class="collab-board" style="grid-template-columns: repeat(${columns}, minmax(0, 1fr));">
    `;

    state.collaborationBoard.forEach((name, index) => {
        const isFlipped = state.collaborationFlipped.includes(index);
        html += `
            <button class="collab-name-card ${isFlipped ? 'is-flipped' : ''}" onclick="flipPexesoCard(${index})" type="button">
                <span>${isFlipped ? escapeHtml(name) : '?'}</span>
            </button>
        `;
    });

    html += `
            </div>
        </div>
    `;
    area.innerHTML = html;
}

function renderCollaborationParticipantsEditor(area, names = []) {
    const sample = I18N[state.lang].participantSample || '';
    const currentNames = names.length ? names.join('\n') : '';
    area.innerHTML = `
        <div class="collab-setup glass">
            <div class="collab-setup-title">${I18N[state.lang].participantsTitle}</div>
            <p class="collab-setup-desc">${I18N[state.lang].participantsDesc}</p>
            <textarea id="participants-input" class="collab-participants-input" placeholder="${escapeHtml(sample)}">${escapeHtml(currentNames)}</textarea>
            <button class="btn collab-continue-btn" onclick="startCollaborationParticipants()">${I18N[state.lang].continue}</button>
        </div>
    `;
    setTimeout(() => document.getElementById('participants-input')?.focus(), 60);
}

function getCollaborationGridColumns(count) {
    if (count <= 2) return count;
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    return 4;
}

window.startCollaborationParticipants = function () {
    const input = document.getElementById('participants-input');
    const uniqueNames = normalizeCollaborationParticipantNames(input?.value || '');

    if (uniqueNames.length < 2) {
        showModal({
            title: I18N[state.lang].participantsNeedTwoTitle,
            desc: I18N[state.lang].participantsNeedTwoDesc,
            onConfirm: () => { }
        });
        return;
    }

    updateCollaborationParticipantsForState(state, uniqueNames, { resetStats: !state.collaborationParticipants?.length });
    state.collaborationEditingParticipants = false;
    saveCurrentState();
    renderGameView();
};

function normalizeCollaborationParticipantNames(rawValue) {
    let names = String(rawValue || '')
        .split(/\n|,/)
        .map(name => name.trim())
        .filter(Boolean);

    if (names.length === 0) {
        names = [I18N[state.lang].defaultParticipantOne, I18N[state.lang].defaultParticipantTwo];
    }

    if (names.length === 1) {
        names.push(I18N[state.lang].defaultParticipantTwo);
    }

    const uniqueNames = [...new Set(names)];
    if (uniqueNames.length === 1) {
        const fallback = uniqueNames[0] === I18N[state.lang].defaultParticipantTwo
            ? I18N[state.lang].defaultParticipantOne
            : I18N[state.lang].defaultParticipantTwo;
        uniqueNames.push(fallback);
    }

    return uniqueNames;
}

function updateCollaborationParticipantsForState(target, names, options = {}) {
    const participantSet = new Set(names);
    target.collaborationParticipants = names;
    target.collaborationRemainingParticipants = shuffleItems(names);
    target.collaborationBoard = [];
    target.collaborationFlipped = [];
    target.collaborationPendingPair = null;

    if (options.resetStats) {
        target.collaborationUsage = {};
        target.collaborationPairUsage = {};
        target.collaborationLastPairKey = '';
        target.collaborationLastPair = [];
        target.answered = 0;
    } else {
        target.collaborationUsage = Object.fromEntries(
            Object.entries(target.collaborationUsage || {}).filter(([name]) => participantSet.has(name))
        );
        target.collaborationPairUsage = Object.fromEntries(
            Object.entries(target.collaborationPairUsage || {}).filter(([key]) => {
                const pair = parseCollaborationPairKey(key);
                return pair.length === 2 && pair.every(name => participantSet.has(name));
            })
        );
        target.collaborationLastPair = (target.collaborationLastPair || []).filter(name => participantSet.has(name));
        if (parseCollaborationPairKey(target.collaborationLastPairKey).some(name => !participantSet.has(name))) {
            target.collaborationLastPairKey = '';
        }
    }

    const previousState = state;
    state = target;
    refreshCollaborationPairDeck();
    state = previousState;
}

function getQuickQuestionDelta(index, activeIndex, total) {
    let delta = index - activeIndex;
    if (delta > total / 2) delta -= total;
    if (delta < -total / 2) delta += total;
    return delta;
}

function updateQuickQuestionFanLayout() {
    const fan = document.getElementById('question-fan');
    if (!fan) return;

    const cards = Array.from(fan.querySelectorAll('.question-fan-card'));
    const total = cards.length;
    if (!total) return;

    const activeIndex = ((state.quickQCursor % total) + total) % total;

    cards.forEach((card, index) => {
        const delta = getQuickQuestionDelta(index, activeIndex, total);
        const offset = Math.abs(delta);

        card.classList.remove('active', 'near', 'far', 'hidden', 'left', 'right');
        if (delta < 0) card.classList.add('left');
        if (delta > 0) card.classList.add('right');

        if (offset === 0) card.classList.add('active');
        else if (offset === 1) card.classList.add('near');
        else if (offset === 2) card.classList.add('far');
        else card.classList.add('hidden');
    });
}
function setupQuickQuestionFan() {
    const fan = document.getElementById('question-fan');
    if (!fan) return;

    const total = Number(fan.dataset.total || 0);
    if (!total) return;

    state.quickQCursor = ((state.quickQCursor % total) + total) % total;
    updateQuickQuestionFanLayout();

    let pointerStartX = null;
    let lastStepX = null;
    let isSwiping = false;

    const stepSize = 52;
    const swipeThreshold = 14;

    fan.addEventListener('pointerdown', (event) => {
        pointerStartX = event.clientX;
        lastStepX = event.clientX;
        isSwiping = false;
    });

    fan.addEventListener('pointermove', (event) => {
        if (pointerStartX === null || lastStepX === null) return;

        const totalDelta = event.clientX - pointerStartX;

        if (Math.abs(totalDelta) < swipeThreshold) return;

        isSwiping = true;
        event.preventDefault();

        const deltaFromLastStep = event.clientX - lastStepX;

        if (Math.abs(deltaFromLastStep) >= stepSize) {
            const steps = Math.trunc(deltaFromLastStep / stepSize);
            stepQuickQuestionFan(steps > 0 ? -Math.abs(steps) : Math.abs(steps));
            lastStepX += steps * stepSize;
        }
    }, { passive: false });

    fan.addEventListener('pointerup', () => {
        pointerStartX = null;
        lastStepX = null;

        setTimeout(() => {
            isSwiping = false;
        }, 0);
    });

    fan.addEventListener('pointercancel', () => {
        pointerStartX = null;
        lastStepX = null;
        isSwiping = false;
    });

    fan.addEventListener('click', (event) => {
        if (!isSwiping) return;

        event.preventDefault();
        event.stopPropagation();
    }, true);

    fan.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        event.preventDefault();
        stepQuickQuestionFan(event.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    setTimeout(() => {
        fan.closest('.question-fan-stage')?.classList.add('hint-swipe');

        setTimeout(() => {
            fan.closest('.question-fan-stage')?.classList.remove('hint-swipe');
        }, 900);
    }, 80);
}
window.stepQuickQuestionFan = function (direction) {
    const fan = document.getElementById('question-fan');
    if (!fan) return;

    const total = Number(fan.dataset.total || 0);
    if (!total) return;

    // Ensure transitions are enabled for smooth stepping
    const cards = Array.from(fan.querySelectorAll('.question-fan-card'));
    cards.forEach(card => {
        card.style.transition = 'transform 0.28s ease, opacity 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, filter 0.28s ease';
    });

    state.quickQCursor = ((state.quickQCursor + direction) % total + total) % total;
    updateQuickQuestionFanLayout();
    // Reset drag offset to 0, as we are now in a snapped state
    fan.style.setProperty('--drag-offset', '0px');
};

window.selectQuickQuestion = function (idx, order) {
    state.quickQCursor = Number.isFinite(order) ? order : state.quickQCursor;

    const fan = document.getElementById('question-fan');
    const pickedCard = fan?.querySelector(`.question-fan-card[data-question-order="${order}"]`);

    if (!fan || !pickedCard) {
        revealCard(idx);
        return;
    }

    fan.classList.add('is-picking');
    pickedCard.classList.add('is-picked');

    setTimeout(() => {
        revealCard(idx);

        const resultArea = document.getElementById('result-area');
        if (resultArea) {
            resultArea.classList.remove('result-enter');
            void resultArea.offsetWidth;
            resultArea.classList.add('result-enter');
        }
    }, 190);
};

window.flipPexesoCard = function (idx) {
    if (isCollaborationPexeso()) {
        flipCollaborationCard(idx);
        return;
    }

    if (state.pexesoFlipped.includes(idx)) return;
    if (state.pexesoFlipped.length >= 2) return;

    state.pexesoFlipped.push(idx);
    renderGameView();

    if (state.pexesoFlipped.length === 2) {
        const [i1, i2] = state.pexesoFlipped;
        if (getVisualItemKey(state.pexesoBoard[i1]) === getVisualItemKey(state.pexesoBoard[i2])) {
            state.pexesoResult = 'match';
        } else {
            state.pexesoResult = 'mismatch';
        }

        const slots = getWheelSlots();
        const action = slots[Math.floor(Math.random() * slots.length)];
        saveCurrentState();

        setTimeout(() => {
            state.pexesoBoard = [];
            saveCurrentState();
            requestAnimationFrame(() => handleWheelAction(action));
        }, 350);
    }
};

function flipCollaborationCard(idx) {
    if (!state.collaborationBoard || !state.collaborationBoard[idx]) return;
    if (state.collaborationFlipped.includes(idx)) return;
    if (state.collaborationFlipped.length >= 2) return;

    if (state.collaborationFlipped.length === 0) {
        idx = prepareFirstCollaborationPick(idx);
    } else if (state.collaborationFlipped.length === 1) {
        idx = prepareSecondCollaborationPick(idx);
    }

    state.collaborationFlipped.push(idx);
    renderGameView();

    if (state.collaborationFlipped.length === 2) {
        const [i1, i2] = state.collaborationFlipped;
        const pair = [state.collaborationBoard[i1], state.collaborationBoard[i2]];
        saveCurrentState();

        setTimeout(() => {
            revealCollaborationTask(pair);
        }, 350);
    }
}

function prepareFirstCollaborationPick(clickedIdx) {
    let pair = state.collaborationPendingPair;
    if (!Array.isArray(pair) || pair.length !== 2) {
        pair = getNextCollaborationPair();
        if (pair.length !== 2) return clickedIdx;
        state.collaborationPendingPair = pair;
    }

    const firstName = Math.random() < 0.5 ? pair[0] : pair[1];
    return moveCollaborationNameToIndex(firstName, clickedIdx);
}

function prepareSecondCollaborationPick(clickedIdx) {
    const board = state.collaborationBoard || [];
    const firstIdx = state.collaborationFlipped[0];
    const firstName = board[firstIdx];
    const pair = state.collaborationPendingPair;

    if (!Array.isArray(pair) || pair.length !== 2 || !firstName) {
        return getBalancedSecondCollaborationIndex(firstIdx, clickedIdx);
    }

    const secondName = pair[0] === firstName ? pair[1] : pair[0];
    if (!secondName || secondName === firstName) {
        return getBalancedSecondCollaborationIndex(firstIdx, clickedIdx);
    }

    return moveCollaborationNameToIndex(secondName, clickedIdx);
}

function getBalancedFirstCollaborationIndex(clickedIdx) {
    const board = state.collaborationBoard || [];
    const candidates = board.map((name, index) => ({ name, index }));
    const previousPeople = state.collaborationLastPair || [];
    const freshCandidates = candidates.filter(item => !previousPeople.includes(item.name));
    const usableCandidates = freshCandidates.length ? freshCandidates : candidates;
    const minUsage = Math.min(...usableCandidates.map(item => getCollaborationUsage(item.name)));
    const fairest = usableCandidates.filter(item => getCollaborationUsage(item.name) === minUsage);
    return moveCollaborationCandidateToClickedIndex(clickedIdx, fairest);
}

function getBalancedSecondCollaborationIndex(firstIdx, clickedIdx) {
    const board = state.collaborationBoard || [];
    const firstName = board[firstIdx];
    const clickedName = board[clickedIdx];
    if (!firstName || !clickedName) return clickedIdx;

    const candidates = board
        .map((name, index) => ({ name, index }))
        .filter(item => item.index !== firstIdx && item.name !== firstName);

    if (!candidates.length) return clickedIdx;

    const previousPeople = state.collaborationLastPair || [];
    const scoredCandidates = candidates.map(item => {
        const pair = [firstName, item.name];
        const isLastPair = getCollaborationPairKey(pair) === (state.collaborationLastPairKey || '');
        const score =
            (isLastPair ? 10000 : 0) +
            (getCollaborationPairUsage(pair) * 100) +
            (getCollaborationUsage(item.name) * 8) +
            (previousPeople.includes(item.name) ? 2 : 0);

        return { ...item, score };
    });
    const minScore = Math.min(...scoredCandidates.map(item => item.score));
    const fairest = scoredCandidates.filter(item => item.score === minScore);
    const clickedCandidate = fairest.find(item => item.index === clickedIdx);

    return moveCollaborationCandidateToClickedIndex(clickedIdx, clickedCandidate ? [clickedCandidate] : fairest);
}

function moveCollaborationCandidateToClickedIndex(clickedIdx, candidates) {
    if (!candidates.length) return clickedIdx;

    const selected = candidates.find(item => item.index === clickedIdx) || candidates[Math.floor(Math.random() * candidates.length)];
    if (selected.index !== clickedIdx) {
        const board = state.collaborationBoard;
        [board[clickedIdx], board[selected.index]] = [board[selected.index], board[clickedIdx]];
    }

    return clickedIdx;
}

function getWheelSlots() {
    let hasInstantTask = state.pool.some(c => normalizeCardType(c.cardType) === CARD_TYPE.instantTask);
    let hasLongTermChallenge = state.pool.some(c => normalizeCardType(c.cardType) === CARD_TYPE.longTermChallenge);
    let hasQuestion = state.pool.some(c => normalizeCardType(c.cardType) === CARD_TYPE.question);

    // 8 segmentov: 75% otázky, 12.5% okamžité úlohy, 12.5% dlhodobé výzvy
    let slots = [
        CARD_TYPE.question,
        CARD_TYPE.question,
        CARD_TYPE.question,
        CARD_TYPE.question,
        CARD_TYPE.question,
        CARD_TYPE.question,
        CARD_TYPE.instantTask,
        CARD_TYPE.longTermChallenge
    ];
    if (!hasInstantTask) { slots[6] = CARD_TYPE.question; }
    if (!hasLongTermChallenge) { slots[7] = CARD_TYPE.question; }

    if (!hasQuestion) {
        for (let i = 0; i < 8; i++) {
            if (slots[i] === CARD_TYPE.question) {
                if (hasInstantTask) slots[i] = CARD_TYPE.instantTask;
                else if (hasLongTermChallenge) slots[i] = CARD_TYPE.longTermChallenge;
            }
        }
    }
    return slots;
}

function spinWheel() {
    if (state.isSpinning) return;
    state.isSpinning = true;

    const btn = document.getElementById('spin-btn');
    if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
    }

    const wheel = document.getElementById('wheel-svg');
    const deg = 1440 + Math.random() * 720;
    wheel.style.transform = `rotate(${deg}deg)`;

    const R = deg % 360;
    const normalizedAngle = (360 - R) % 360;
    const selectedIndex = Math.floor(normalizedAngle / 45);
    const slots = getWheelSlots();
    const action = slots[selectedIndex];

    const unicorn = document.getElementById('unicorn-wrapper');
    const hub = document.getElementById('hub-circle');
    if (unicorn) unicorn.classList.add('dancing-unicorn');
    if (hub) hub.style.opacity = "0";

    // Synchronizovaný tikajúci zvuk
    let startTime = performance.now();
    const duration = 3000;
    const playTicks = () => {
        let elapsed = performance.now() - startTime;
        if (elapsed > duration) {
            state.isSpinning = false;
            return;
        }

        playTick();

        let progress = elapsed / duration;
        // Exponenciálne spomaľovanie tikotu
        let nextDelay = 60 + (Math.pow(progress, 2.5) * 600);
        setTimeout(playTicks, nextDelay);
    };
    playTicks();

    setTimeout(() => {
        if (unicorn) unicorn.classList.remove('dancing-unicorn');
        if (hub) hub.style.opacity = "1";
        handleWheelAction(action);
    }, 3200);
}

function handleWheelAction(action) {
    const idx = state.pool.findIndex(c => c.cardType === action);
    if (idx !== -1) {
        revealCard(idx);
    } else {
        revealCard(0);
    }
}

function revealCard(idx) {
    const card = state.pool.splice(idx, 1)[0];
    state.history.push(card);
    state.historyIndex = state.history.length - 1;
    state.answered++;
    renderResult();
}

function revealCollaborationTask(pair) {
    const taskIndex = state.pool.findIndex(c => normalizeCardType(c.cardType) === CARD_TYPE.instantTask);
    const sourceCard = taskIndex >= 0 ? state.pool.splice(taskIndex, 1)[0] : normalizeCards([...PACKS.collaboration])[Math.floor(Math.random() * PACKS.collaboration.length)];
    const card = {
        ...sourceCard,
        assignees: pair
    };

    state.collaborationUsage = state.collaborationUsage || {};
    state.collaborationPairUsage = state.collaborationPairUsage || {};
    pair.forEach(name => {
        state.collaborationUsage[name] = getCollaborationUsage(name) + 1;
    });
    state.collaborationLastPairKey = getCollaborationPairKey(pair);
    state.collaborationPairUsage[state.collaborationLastPairKey] = getCollaborationPairUsage(pair) + 1;
    state.collaborationLastPair = [...pair];
    state.collaborationRemainingParticipants = shuffleItems(state.collaborationParticipants || []);
    state.collaborationBoard = [];
    state.collaborationFlipped = [];
    state.collaborationPendingPair = null;
    state.pexesoResult = null;
    state.history.push(card);
    state.historyIndex = state.history.length - 1;
    state.answered++;
    renderResult();
}

function getDonationConfig(card) {
    const cardType = normalizeCardType(card?.cardType || card?.[String.fromCharCode(116)]);
    const isPexesoInstantTask = state.mode === 'pexeso' && cardType === CARD_TYPE.instantTask;
    const effectiveType = isPexesoInstantTask ? CARD_TYPE.question : cardType;

    const configMap = {
        question: {
            amount: `${getDonationAmount('question').eur}€ / ${getDonationAmount('question').czk} CZK`,
            btn: 'pinBtnQuestion',
            remove: 'pinRemoveQuestion'
        },
        instantTask: {
            amount: `${getDonationAmount('instantTask').eur}€ / ${getDonationAmount('instantTask').czk} CZK`,
            btn: 'pinBtnInstantTask',
            remove: 'pinRemoveInstantTask'
        },
        longTermChallenge: {
            amount: `${getDonationAmount('longTermChallenge').eur}€ / ${getDonationAmount('longTermChallenge').czk} CZK`,
            btn: 'pinBtnLongTermChallenge',
            remove: 'pinRemoveLongTermChallenge'
        }
    };

    const config = { ...(configMap[effectiveType] || configMap.instantTask) };

    if (isPexesoInstantTask) {
        config.amount = `${getDonationAmount('pexesoInstantTask').eur}€ / ${getDonationAmount('pexesoInstantTask').czk} CZK`;
        config.btn = 'pinBtnPexesoInstantTask';
        config.remove = 'pinRemovePexesoInstantTask';
    }

    return config;
}

function renderResult() {
    const card = state.history[state.historyIndex];
    document.getElementById('game-area').style.display = 'none';
    const res = document.getElementById('result-area');
    res.style.display = 'flex';
    res.dataset.cardType = card.cardType;

    const resTypeEl = document.getElementById('res-type');
    const resTextEl = document.getElementById('res-text');
    const resGeeEl = document.getElementById('res-geegee');
    const inspirationBtn = document.getElementById('inspiration-btn');
    const inspirationStage = document.getElementById('inspiration-stage');

    const hasCollaborationPair = isCollaborationPexeso() && card.assignees?.length === 2;
    resTypeEl.innerText = I18N[state.lang][card.cardType];
    resTypeEl.style.color = '';
    resTypeEl.style.display = 'inline-flex';

    if (hasCollaborationPair) {
        resGeeEl.innerText = i18nText('collaborationPairBanner', {
            first: card.assignees[0],
            second: card.assignees[1]
        });
        resGeeEl.classList.add('banner');
        resGeeEl.classList.add('collab-pair-banner');
    } else if (state.mode === 'pexeso' && state.pexesoResult) {
        const isMatch = state.pexesoResult === 'match';
        const pMsg = isMatch
            ? I18N[state.lang].pexesoMatchBanner
            : I18N[state.lang].pexesoMismatchBanner;
        resGeeEl.innerText = pMsg;
        resGeeEl.style.color = isMatch ? '#10b981' : '#f59e0b';
        resGeeEl.classList.add('banner');
    } else {
        resGeeEl.innerText = "";
        resGeeEl.classList.remove('banner');
        resGeeEl.classList.remove('collab-pair-banner');
        resGeeEl.style.color = '';
    }

    resTextEl.innerText = card[state.lang];
    const topics = getCardTopics(card);
    inspirationBtn.classList.toggle('is-hidden-display', topics.length === 0);
    inspirationBtn.title = I18N[state.lang].inspirationButton;
    inspirationBtn.setAttribute('aria-label', I18N[state.lang].inspirationButton);
    renderInspirationStage(card, inspirationStage, topics);

    // Sticker logic
    const stickerCont = document.getElementById('sticker-container');
    const orgName = getOrgName();
    const donationsEnabled = isDonationEnabledForCard(card);
    if (!donationsEnabled && card.isPinned) card.isPinned = false;
    const logoUrl = getAppStyleConfig().logoUrl;
    stickerCont.innerHTML = donationsEnabled && card.isPinned ? `<div class="geegee-sticker" onclick="togglePin()" style="background-image: url('${escapeHtml(logoUrl)}')">${orgName}</div>` : '';

    // Pin button logic
    const pinBtn = document.getElementById('pin-btn-el');
    pinBtn.style.display = donationsEnabled ? 'flex' : 'none';
    pinBtn.className = card.isPinned ? 'pin-btn active' : 'pin-btn';

    if (donationsEnabled) {
        const donationConfig = getDonationConfig(card);
        pinBtn.innerText = i18nText(card.isPinned ? donationConfig.remove : donationConfig.btn, {
            org: orgName,
            amount: donationConfig.amount
        });
    }

    const prevBtn = document.getElementById('btn-prev');
    const hasPrev = state.historyIndex > 0;
    prevBtn.style.visibility = hasPrev ? 'visible' : 'hidden';
    prevBtn.disabled = !hasPrev;
    prevBtn.style.pointerEvents = hasPrev ? 'auto' : 'none';

    const btnNext = document.getElementById('btn-next');
    prevBtn.innerText = `← ${I18N[state.lang].prev}`;
    btnNext.innerText = `${I18N[state.lang].next} →`;
    btnNext.onclick = state.mode === 'quickQuestions' ? nextQuickQuestion : nextRound;

    updateStats();
    saveCurrentState();
}

function showInspirationIdea() {
    const card = state.history[state.historyIndex];
    const topics = getCardTopics(card);
    if (!topics.length) return;

    const stage = document.getElementById('inspiration-stage');
    const previous = Number(card.inspirationTopicIndex ?? stage.dataset.topicIndex ?? -1);
    let next = Math.floor(Math.random() * topics.length);
    if (topics.length > 1 && next === previous) next = (next + 1) % topics.length;
    card.inspirationTopicIndex = next;
    renderInspirationStage(card, stage, topics);
    saveCurrentState();
}

function renderInspirationStage(card, stage, topics = getCardTopics(card)) {
    const topicIndex = Number(card?.inspirationTopicIndex);

    if (!stage || !topics.length || !Number.isInteger(topicIndex) || topicIndex < 0 || topicIndex >= topics.length) {
        if (stage) {
            stage.className = 'inspiration-stage is-hidden-display';
            stage.innerHTML = '';
            delete stage.dataset.topicIndex;
        }
        return;
    }

    stage.dataset.topicIndex = String(topicIndex);
    stage.className = 'inspiration-stage';
    stage.innerHTML = `
        <div class="magic-hat" aria-hidden="true">
            <div class="magic-hat-top"></div>
            <div class="magic-hat-brim"></div>
        </div>
        <div class="idea-paper">${escapeHtml(topics[topicIndex])}</div>
    `;
}

function togglePin() {
    const card = state.history[state.historyIndex];
    if (!isDonationEnabledForCard(card)) return;
    card.isPinned = !card.isPinned;

    const langText = card[state.lang];
    const amount = getDonationConfig(card).amount;
    const prefix = `➕ ${getOrgName()} ${amount}: `;
    const placeholder = I18N[state.lang].noteNamePlaceholder;
    const noteEntry = prefix + langText + " " + placeholder;

    if (card.isPinned) {
        // Pridať do poznámok
        if (!state.note.includes(langText)) {
            state.note = (state.note ? state.note + "\n" : "") + noteEntry;
        }
    } else {
        // Odstrániť z poznámok
        state.note = state.note.split('\n')
            .filter(line => !line.includes(langText))
            .join('\n')
            .trim();
    }

    document.getElementById('noteInput').value = state.note;
    saveCurrentState();
    renderResult();
}

function prevRound() {
    if (state.historyIndex > 0) {
        state.historyIndex--;
        renderResult();
    }
}

function nextRound() {
    if (state.mode === 'pickCards') {
        state.cardStyle = null;
    }
    renderGameView();
}
function nextQuickQuestion() {
    renderGameView();

    requestAnimationFrame(() => {
        const fan = document.getElementById('question-fan');
        const stage = fan?.closest('.question-fan-stage');
        if (!stage) return;

        stage.classList.remove('hint-swipe');
        void stage.offsetWidth;

        setTimeout(() => {
            stage.classList.add('hint-swipe');
        }, 80);
    });
}

function goHome() {
    location.reload();
}

function showHistory() {
    toggleSidebar();
    showScreen('history', 'forward');
    renderHistoryList();
}

function renderHistoryList() {
    const list = document.getElementById('historyList');
    list.innerHTML = "";
    let keys = getSessionKeys();

    keys.forEach(key => {
        const data = getSessionData(key);
        const meta = getSessionMeta(data);

        list.innerHTML += `
                    <div class="history-card" id="card-full-${key}">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div style="display:flex; align-items:center; gap:12px; flex-grow: 1;">
                                <div style="color:var(--text-dim); opacity:0.6;">${meta.modeIcon}</div>
                                <div style="flex-grow: 1;">
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <h5 style="color:var(--primary); cursor:pointer; text-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);" onclick="renameHistoryItem('${key}')">${meta.title}</h5>
                                    </div>
                                    <p style="font-size:0.7rem; opacity:0.6">${meta.packName} • ${meta.modeName} • ${meta.answered}/${meta.total}</p>
                                </div>
                            </div>
                            <div class="dot-menu">
                                <button class="dot-btn" onclick="event.stopPropagation(); toggleMenu('${key}', false)">⋮</button>
                                <div id="menu-${key}" class="dropdown-content">${getHistoryMenuHtml(key, data)}</div>
                            </div>
                        </div>
                        <p style="margin: 12px 0; font-size: 0.9rem;">${data.note || '...'}</p>
                    </div>
                `;
    });
}

function renameHistoryItem(key) {
    const data = getSessionData(key);
    showModal({
        title: I18N[state.lang].renameTitle,
        type: "text",
        value: data.title || data.date,
        onConfirm: (newTitle) => {
            if (newTitle.trim()) {
                data.title = newTitle;
                localStorage.setItem(key, JSON.stringify(data));
                refreshHistoryViews();
            }
        }
    });
}

function editHistoryNote(key) {
    const data = getSessionData(key);
    showModal({
        title: I18N[state.lang].editNoteTitle,
        type: "area",
        value: data.note || "",
        onConfirm: (newNote) => {
            data.note = newNote;
            localStorage.setItem(key, JSON.stringify(data));
            refreshHistoryViews();
        }
    });
}

function editHistoryParticipants(key) {
    closeAllMenus();
    const data = getSessionData(key);
    const names = (data.collaborationParticipants || []).join('\n');

    showModal({
        title: I18N[state.lang].editParticipants,
        customHtml: `
            <p class="modal-desc" style="display:block; margin-bottom: 12px;">${escapeHtml(I18N[state.lang].participantsEditDesc)}</p>
            <textarea id="history-participants-input" class="modal-input modal-textarea">${escapeHtml(names)}</textarea>
        `,
        onConfirm: () => {
            const input = document.getElementById('history-participants-input');
            const uniqueNames = normalizeCollaborationParticipantNames(input?.value || '');
            updateCollaborationParticipantsForState(data, uniqueNames, { resetStats: false });
            localStorage.setItem(key, JSON.stringify(data));

            if (state.sessionId === key) {
                state = normalizeSessionData(data);
                saveCurrentState();
                if (state.screen === 'game') {
                    updateStats();
                    renderGameView();
                }
            }

            refreshHistoryViews();
        }
    });
}

function deleteHistoryItem(key) {
    showModal({
        title: I18N[state.lang].deleteTitle,
        desc: I18N[state.lang].deleteDesc,
        isDanger: true,
        onConfirm: () => {
            localStorage.removeItem(key);
            refreshHistoryViews();
        }
    });
}

function changeHistoryMode(key) {
    closeAllMenus();
    const data = getSessionData(key);
    const modes = getAvailableModes(data.packKey);
    const currentMode = data.mode;

    let btnsHtml = modes.map(m => {
        const label = I18N[state.lang][MODE_I18N_KEY[m]];
        const isActive = m === currentMode;
        const style = isActive
            ? 'background: var(--primary); color: white; border: 1px solid var(--primary);'
            : 'background: rgba(255,255,255,0.05); color: var(--text); border: 1px solid var(--border);';
        return `<div onclick="confirmModeChange('${key}', '${m}')" style="${style} padding: 14px; border-radius: 14px; cursor: pointer; text-align: center; font-weight: 600; font-size: 0.9rem; transition: 0.2s;">
                    <span style="display:block; margin-bottom: 4px;">${ICONS[m]}</span>${label}
                </div>`;
    }).join('');

    const gridCols = modes.length === 1 ? '1fr' : (modes.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr');

    showModal({
        title: I18N[state.lang].changeMode,
        customHtml: `<div style="display:grid; grid-template-columns:${gridCols}; gap:10px; margin-bottom:15px;">${btnsHtml}</div>`,
        onConfirm: () => { }
    });
}

function confirmModeChange(key, newMode) {
    const data = getSessionData(key);
    data.mode = newMode;
    localStorage.setItem(key, JSON.stringify(data));
    closeModal();
    refreshHistoryViews();
}

function renameCurrentSession() {
    showModal({
        title: I18N[state.lang].renameTitle,
        type: "text",
        value: state.title || state.date,
        onConfirm: (newTitle) => {
            if (newTitle.trim()) {
                state.title = newTitle;
                saveCurrentState();
                updateStats();
            }
        }
    });
}

function clearAllHistory() {
    showModal({
        title: I18N[state.lang].clearAllTitle,
        desc: I18N[state.lang].clearAllDesc,
        isDanger: true,
        onConfirm: () => {
            Object.keys(localStorage).forEach(k => { if (k.startsWith('S-')) localStorage.removeItem(k); });
            refreshHistoryViews();
            closeAllMenus();
        }
    });
}

function loadFromHistory(key) {
    state = normalizeSessionData(JSON.parse(localStorage.getItem(key)));
    applyAppStyle(state.appStyle || localStorage.getItem('ib_app_style') || 'normal', { updateOrg: false });
    document.getElementById('noteInput').value = state.note || "";
    showScreen('game');
    updateStats();
    renderGameView();
}

function showAbout() { toggleSidebar(); showScreen('about', 'forward'); }

function openSettings() {
    toggleSidebar();
    showScreen('settings', 'forward');
}

function editOrgName() {
    showModal({
        title: I18N[state.lang].settingsOrgTitle,
        type: "text",
        value: getOrgName(),
        desc: I18N[state.lang].settingsOrgDesc,
        onConfirm: (newOrgName) => {
            const cleaned = (newOrgName || '').trim() || getAppStyleConfig().orgName;
            state.orgName = cleaned;
            localStorage.setItem('ib_org_name', cleaned);
            renderSettingsView();
            if (state.historyIndex >= 0) renderResult();
        }
    });
}

function confirmDonationMode(newMode) {
    state.donationMode = newMode;
    localStorage.setItem('ib_donation_mode', newMode);
    saveCurrentState();
    renderSettingsView();
    if (state.historyIndex >= 0) renderResult();
}

function updateDonationModeFromSelect() {
    const select = document.getElementById('settings-donation-mode-select');
    if (!select) return;
    confirmDonationMode(select.value);
}

function editDonationAmount(key) {
    const amount = getDonationAmount(key);
    showModal({
        title: I18N[state.lang][`settingsAmount${amountKeySuffix(key)}Title`],
        customHtml: `
                    <div class="currency-grid">
                        <div class="currency-field">
                            <input type="number" id="donation-eur-input" class="modal-input" min="0" step="0.01" value="${amount.eur}">
                            <span class="currency-badge">EUR</span>
                        </div>
                        <div class="currency-field">
                            <input type="number" id="donation-czk-input" class="modal-input" min="0" step="1" value="${amount.czk}">
                            <span class="currency-badge">CZK</span>
                        </div>
                    </div>
                `,
        desc: I18N[state.lang].settingsAmountModalDesc,
        onConfirm: () => {
            const eurInput = document.getElementById('donation-eur-input');
            const czkInput = document.getElementById('donation-czk-input');
            const eur = Number(eurInput?.value);
            const czk = Number(czkInput?.value);
            if (!Number.isFinite(eur) || !Number.isFinite(czk) || eur < 0 || czk < 0) return;
            state.donationAmounts = {
                ...(state.donationAmounts || {}),
                [key]: { eur, czk }
            };
            localStorage.setItem('ib_donation_amounts', JSON.stringify(state.donationAmounts));
            saveCurrentState();
            renderSettingsView();
            if (state.historyIndex >= 0) renderResult();
        }
    });

    const eurInput = document.getElementById('donation-eur-input');
    const czkInput = document.getElementById('donation-czk-input');
    const confirmBtn = document.getElementById('modal-confirm');
    const syncValidity = () => {
        const hasEur = eurInput && eurInput.value.trim() !== '';
        const hasCzk = czkInput && czkInput.value.trim() !== '';
        const enabled = hasEur && hasCzk;
        confirmBtn.disabled = !enabled;
        confirmBtn.style.opacity = enabled ? '1' : '0.45';
        confirmBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
    };

    if (eurInput && czkInput && confirmBtn) {
        eurInput.addEventListener('input', syncValidity);
        czkInput.addEventListener('input', syncValidity);
        syncValidity();
        setTimeout(() => eurInput.focus(), 100);
    }
}

function endSession() {
    showModal({
        title: I18N[state.lang].exitTitle,
        desc: I18N[state.lang].exitDesc,
        isDanger: true,
        onConfirm: () => {
            const finalData = { ...state, date: new Date().toLocaleString() };
            localStorage.setItem(state.sessionId, JSON.stringify(finalData));
            localStorage.removeItem('ib_current_session');
            state.sessionId = null;
            showScreen('start', 'back');
        }
    });
}

function updateLangFromSettings() {
    const val = document.getElementById('langSelectSettings').value;
    document.getElementById('langSelect').value = val;
    updateLang();
}






