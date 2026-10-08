(function () {
  var BEST_KEY = "wff-fancy-match-best";
  var SOUND_KEY = "wff-fancy-match-sound";
  var selectedMode = "medium";
  var activeGame = null;
  var soundEnabled = false;
  var audioContext = null;
  var elements = {};

  function readBestScores() {
    try {
      var value = window.localStorage.getItem(BEST_KEY);
      return value ? JSON.parse(value) : {};
    } catch (error) {
      console.error("Could not read saved best scores.", error);
      return {};
    }
  }

  function saveBestScore(mode, score) {
    var scores = readBestScores();
    scores[mode] = score;
    try {
      window.localStorage.setItem(BEST_KEY, JSON.stringify(scores));
    } catch (error) {
      console.error("Could not save the best score.", error);
    }
  }

  function currentBest(mode) {
    return readBestScores()[mode] || null;
  }

  function scoreIsBetter(next, previous) {
    return !previous || next.moves < previous.moves || (next.moves === previous.moves && next.seconds < previous.seconds);
  }

  function bestLabel(score) {
    return score ? score.moves + " moves · " + window.WFFGame.formatTime(score.seconds) : "—";
  }

  function updateBestLabels() {
    elements.homeBest.textContent = currentBest(selectedMode)
      ? "Your best: " + bestLabel(currentBest(selectedMode))
      : "Your best: —";
    elements.gameBest.textContent = bestLabel(currentBest(selectedMode));
  }

  function playTone(frequency, duration, type) {
    if (!soundEnabled) return;
    var AudioApi = window.AudioContext || window.webkitAudioContext;
    if (!AudioApi) return;
    if (!audioContext) audioContext = new AudioApi();
    if (audioContext.state === "suspended") audioContext.resume();
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    oscillator.type = type || "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  function resetTimer() {
    if (activeGame && activeGame.timerHandle) {
      window.clearInterval(activeGame.timerHandle);
      activeGame.timerHandle = null;
    }
  }

  function updateTimer() {
    if (!activeGame || !activeGame.startedAt || activeGame.finished) return;
    activeGame.seconds = Math.floor((Date.now() - activeGame.startedAt) / 1000);
    elements.timer.textContent = window.WFFGame.formatTime(activeGame.seconds);
  }

  function startTimer() {
    if (activeGame.startedAt) return;
    activeGame.startedAt = Date.now();
    activeGame.timerHandle = window.setInterval(updateTimer, 250);
  }

  function renderBoard() {
    elements.board.innerHTML = "";
    elements.board.style.setProperty("--board-columns", activeGame.settings.columns);
    elements.board.dataset.mode = activeGame.mode;
    activeGame.cards.forEach(function (card, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "memory-card";
      button.dataset.cardId = card.id;
      button.dataset.index = index;
      button.setAttribute("aria-label", "Face-down card " + (index + 1));
      button.setAttribute("aria-pressed", "false");
      var inner = document.createElement("span");
      inner.className = "card-inner";
      var front = document.createElement("span");
      front.className = "card-face card-front";
      var logo = document.createElement("img");
      logo.src = card.exhibitor.productImage || card.exhibitor.logo;
      logo.alt = card.exhibitor.productName + " by " + card.exhibitor.companyName;
      front.appendChild(logo);
      var back = document.createElement("span");
      back.className = "card-face card-back";
      back.setAttribute("aria-hidden", "true");
      var backLogo = document.createElement("img");
      backLogo.className = "card-back-logo";
      backLogo.src = "assets/brand/sfa-logo-white.png";
      backLogo.alt = "";
      var backSnow = document.createElement("span");
      backSnow.className = "card-back-snow";
      backSnow.textContent = "✳";
      back.appendChild(backLogo);
      back.appendChild(backSnow);
      inner.appendChild(front);
      inner.appendChild(back);
      button.appendChild(inner);
      button.addEventListener("click", onCardClick);
      elements.board.appendChild(button);
    });
    var remainingCells = activeGame.settings.rows * activeGame.settings.columns - activeGame.cards.length;
    for (var index = 0; index < remainingCells; index += 1) {
      var snowflakeSpace = document.createElement("div");
      snowflakeSpace.className = "board-spacer";
      snowflakeSpace.setAttribute("aria-hidden", "true");
      snowflakeSpace.innerHTML = '<span class="spacer-ring"></span><span class="spacer-mark">✳</span>';
      elements.board.appendChild(snowflakeSpace);
    }
  }

  function startGame(mode) {
    selectedMode = mode || selectedMode;
    resetTimer();
    var deck = window.WFFGame.createDeck(selectedMode, window.WFF_EXHIBITORS);
    activeGame = {
      mode: selectedMode,
      settings: deck.settings,
      cards: deck.cards,
      openCards: [],
      matchedIds: [],
      moves: 0,
      seconds: 0,
      startedAt: null,
      timerHandle: null,
      locked: false,
      finished: false,
      found: []
    };
    elements.home.hidden = true;
    elements.game.hidden = false;
    document.querySelector(".closing-note").hidden = true;
    elements.gameMode.textContent = deck.settings.label.toUpperCase() + " MODE";
    elements.moves.textContent = "00";
    elements.pairs.textContent = "00";
    elements.pairsTotal.textContent = " / " + deck.settings.pairs;
    elements.timer.textContent = "00:00";
    elements.gameBest.textContent = bestLabel(currentBest(selectedMode));
    elements.finds.innerHTML = "";
    elements.findsCount.textContent = "0";
    elements.findsEmpty.hidden = false;
    renderBoard();
    window.FancyAnalytics.record("game_started", { mode: selectedMode, pairs: deck.settings.pairs });
    elements.game.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function flipCard(button, card) {
    button.classList.add("is-flipped");
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", card.exhibitor.companyName);
    playTone(440, 0.07, "sine");
    window.FancyAnalytics.record("card_flipped", { mode: activeGame.mode, exhibitorId: card.exhibitor.id });
  }

  function onCardClick(event) {
    var button = event.currentTarget;
    var index = Number(button.dataset.index);
    var card = activeGame.cards[index];
    if (!activeGame || activeGame.locked || activeGame.finished || button.classList.contains("is-flipped") || button.classList.contains("is-matched")) return;
    startTimer();
    flipCard(button, card);
    activeGame.openCards.push({ button: button, card: card });
    if (activeGame.openCards.length === 2) {
      activeGame.moves += 1;
      elements.moves.textContent = String(activeGame.moves).padStart(2, "0");
      resolveTurn();
    }
  }

  function resolveTurn() {
    var first = activeGame.openCards[0];
    var second = activeGame.openCards[1];
    if (first.card.exhibitor.id === second.card.exhibitor.id) {
      first.button.classList.add("is-matched");
      second.button.classList.add("is-matched");
      first.button.setAttribute("aria-label", "Matched: " + first.card.exhibitor.companyName);
      second.button.setAttribute("aria-label", "Matched: " + second.card.exhibitor.companyName);
      activeGame.matchedIds.push(first.card.exhibitor.id);
      elements.pairs.textContent = String(activeGame.matchedIds.length).padStart(2, "0");
      activeGame.openCards = [];
      window.FancyAnalytics.record("match_found", {
        mode: activeGame.mode,
        exhibitorId: first.card.exhibitor.id,
        sponsorLevel: first.card.exhibitor.sponsorLevel
      });
      addFancyFind(first.card.exhibitor);
      playTone(660, 0.14, "triangle");
      if (activeGame.matchedIds.length === activeGame.settings.pairs) finishGame();
      return;
    }
    activeGame.locked = true;
    first.button.classList.add("is-mismatch");
    second.button.classList.add("is-mismatch");
    window.setTimeout(function () {
      first.button.classList.remove("is-flipped", "is-mismatch");
      second.button.classList.remove("is-flipped", "is-mismatch");
      first.button.setAttribute("aria-pressed", "false");
      second.button.setAttribute("aria-pressed", "false");
      first.button.setAttribute("aria-label", "Face-down card " + (Number(first.button.dataset.index) + 1));
      second.button.setAttribute("aria-label", "Face-down card " + (Number(second.button.dataset.index) + 1));
      activeGame.openCards = [];
      activeGame.locked = false;
    }, 820);
  }

  function addFancyFind(exhibitor) {
    activeGame.found.push(exhibitor);
    elements.findsEmpty.hidden = true;
    elements.findsCount.textContent = String(activeGame.found.length);
    var card = document.createElement("article");
    card.className = "find-card";
    var logo = document.createElement("img");
    logo.className = "find-logo";
    logo.src = exhibitor.productImage || exhibitor.logo;
    logo.alt = exhibitor.productName + " by " + exhibitor.companyName;
    var details = document.createElement("div");
    details.className = "find-details";
    var company = document.createElement("h4");
    company.textContent = exhibitor.companyName;
    var product = document.createElement("p");
    product.className = "find-product";
    product.textContent = exhibitor.productName;
    var metadata = document.createElement("p");
    metadata.textContent = "BOOTH " + exhibitor.boothNumber + " · " + exhibitor.category;
    var sponsor = document.createElement("span");
    sponsor.className = "sponsor-pill";
    sponsor.textContent = exhibitor.sponsorLevel + " SPONSOR";
    var link = document.createElement("button");
    link.type = "button";
    link.className = "find-link";
    link.textContent = "Learn more";
    link.addEventListener("click", function () {
      window.FancyAnalytics.record("exhibitor_clicked", {
        mode: activeGame ? activeGame.mode : selectedMode,
        exhibitorId: exhibitor.id,
        sponsorLevel: exhibitor.sponsorLevel
      });
      window.open(exhibitor.profileUrl, "_blank", "noopener,noreferrer");
    });
    details.appendChild(company);
    details.appendChild(product);
    details.appendChild(metadata);
    details.appendChild(sponsor);
    card.appendChild(logo);
    card.appendChild(details);
    card.appendChild(link);
    elements.finds.prepend(card);
  }

  function finishGame() {
    updateTimer();
    resetTimer();
    activeGame.finished = true;
    var score = { moves: activeGame.moves, seconds: activeGame.seconds };
    var previous = currentBest(activeGame.mode);
    var isRecord = scoreIsBetter(score, previous);
    if (isRecord) saveBestScore(activeGame.mode, score);
    window.FancyAnalytics.record("game_completed", {
      mode: activeGame.mode,
      durationSeconds: score.seconds,
      moves: score.moves,
      pairs: activeGame.settings.pairs,
      newBest: isRecord
    });
    elements.completionScore.innerHTML = "";
    var resultItems = [
      ["TIME", window.WFFGame.formatTime(score.seconds)],
      ["MOVES", String(score.moves)],
      ["BEST", isRecord ? "NEW RECORD" : bestLabel(currentBest(activeGame.mode))]
    ];
    resultItems.forEach(function (item) {
      var stat = document.createElement("div");
      stat.className = "completion-stat";
      var label = document.createElement("span");
      label.textContent = item[0];
      var value = document.createElement("strong");
      value.textContent = item[1];
      stat.appendChild(label);
      stat.appendChild(value);
      elements.completionScore.appendChild(stat);
    });
    updateBestLabels();
    playTone(784, 0.24, "triangle");
    elements.completeDialog.showModal();
  }

  function showLeaderboard() {
    var scores = readBestScores();
    elements.leaderboard.innerHTML = "";
    ["easy", "medium", "hard"].forEach(function (mode) {
      var row = document.createElement("div");
      row.className = "leaderboard-row";
      var name = document.createElement("span");
      name.textContent = window.WFFGame.modes[mode].label;
      var score = document.createElement("strong");
      score.textContent = bestLabel(scores[mode]);
      row.appendChild(name);
      row.appendChild(score);
      elements.leaderboard.appendChild(row);
    });
    elements.leaderboardDialog.showModal();
  }

  function setMode(mode) {
    if (!window.WFFGame.modes[mode]) return;
    selectedMode = mode;
    document.querySelectorAll(".mode-card").forEach(function (button) {
      var selected = button.dataset.mode === mode;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    updateBestLabels();
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    try {
      window.localStorage.setItem(SOUND_KEY, String(soundEnabled));
    } catch (error) {
      console.error("Could not save sound preference.", error);
    }
    elements.soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    elements.soundToggle.innerHTML = soundEnabled ? '<span aria-hidden="true">♫</span> Sound on' : '<span aria-hidden="true">♫</span> Sound off';
    if (soundEnabled) playTone(523, 0.08, "sine");
  }

  function closeDialog(dialog) {
    if (dialog && dialog.open) dialog.close();
  }

  function bindEvents() {
    elements.playButtons.forEach(function (button) {
      button.addEventListener("click", function () { startGame(selectedMode); });
    });
    document.querySelectorAll(".mode-card").forEach(function (button) {
      button.addEventListener("click", function () { setMode(button.dataset.mode); });
    });
    document.querySelectorAll("[data-open-dialog]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (button.dataset.openDialog === "leaderboard-dialog") showLeaderboard();
        else document.getElementById(button.dataset.openDialog).showModal();
      });
    });
    document.querySelectorAll("[data-close-dialog]").forEach(function (button) {
      button.addEventListener("click", function () {
        var dialog = button.closest("dialog");
        closeDialog(dialog);
        if (dialog === elements.howDialog && button.classList.contains("dialog-play")) elements.playButtons[0].focus();
      });
    });
    document.querySelectorAll("dialog").forEach(function (dialog) {
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) dialog.close();
      });
    });
    elements.backHome.addEventListener("click", showHome);
    elements.restart.addEventListener("click", function () { startGame(selectedMode); });
    elements.soundToggle.addEventListener("click", toggleSound);
    elements.playAgain.addEventListener("click", function () {
      closeDialog(elements.completeDialog);
      startGame(selectedMode);
    });
    elements.completionHome.addEventListener("click", function () {
      closeDialog(elements.completeDialog);
      showHome();
    });
    elements.headerPlay.addEventListener("click", function (event) {
      event.preventDefault();
      if (elements.home.hidden) startGame(selectedMode);
      else elements.playButtons[0].click();
    });
  }

  function showHome() {
    resetTimer();
    elements.game.hidden = true;
    elements.home.hidden = false;
    document.querySelector(".closing-note").hidden = false;
    updateBestLabels();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function initialize() {
    elements = {
      home: document.getElementById("home-screen"),
      game: document.getElementById("game-screen"),
      board: document.getElementById("game-board"),
      timer: document.getElementById("timer"),
      moves: document.getElementById("moves"),
      pairs: document.getElementById("pairs-found"),
      pairsTotal: document.querySelector("#pairs-found span"),
      gameMode: document.getElementById("game-mode-label"),
      gameBest: document.getElementById("game-best-score"),
      homeBest: document.getElementById("home-best-score"),
      finds: document.getElementById("finds-list"),
      findsCount: document.getElementById("finds-count"),
      findsEmpty: document.getElementById("finds-empty"),
      soundToggle: document.getElementById("sound-toggle"),
      backHome: document.getElementById("back-home"),
      restart: document.getElementById("restart-game"),
      playButtons: [document.getElementById("play-button"), document.getElementById("play-button-secondary")],
      completeDialog: document.getElementById("complete-dialog"),
      completionScore: document.getElementById("completion-score"),
      completionHome: document.getElementById("completion-home"),
      playAgain: document.getElementById("play-again"),
      howDialog: document.getElementById("how-dialog"),
      leaderboardDialog: document.getElementById("leaderboard-dialog"),
      leaderboard: document.getElementById("leaderboard-list"),
      headerPlay: document.getElementById("header-play")
    };
    try {
      soundEnabled = window.localStorage.getItem(SOUND_KEY) === "true";
    } catch (error) {
      console.error("Could not read sound preference.", error);
    }
    elements.soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    elements.soundToggle.innerHTML = soundEnabled ? '<span aria-hidden="true">♫</span> Sound on' : '<span aria-hidden="true">♫</span> Sound off';
    bindEvents();
    updateBestLabels();
    window.FancyAnalytics.recordVisit();
  }

  initialize();
})();
