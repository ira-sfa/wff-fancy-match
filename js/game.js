(function () {
  var MODES = {
    easy: { label: "Easy", columns: 4, rows: 4, pairs: 8 },
    medium: { label: "Medium", columns: 5, rows: 4, pairs: 10 },
    hard: { label: "Hard", columns: 6, rows: 6, pairs: 18 }
  };

  function shuffle(items) {
    var shuffled = items.slice();
    for (var i = shuffled.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var current = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = current;
    }
    return shuffled;
  }

  function createDeck(mode, exhibitors) {
    var settings = MODES[mode];
    if (!settings) throw new Error("Unknown game mode: " + mode);
    if (!Array.isArray(exhibitors) || exhibitors.length < settings.pairs) {
      throw new Error("Not enough exhibitors to build the " + mode + " game.");
    }
    var selected = shuffle(exhibitors).slice(0, settings.pairs);
    var cards = [];
    selected.forEach(function (exhibitor) {
      cards.push({ id: exhibitor.id + "-a", exhibitor: exhibitor });
      cards.push({ id: exhibitor.id + "-b", exhibitor: exhibitor });
    });
    return { settings: settings, cards: shuffle(cards) };
  }

  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainder = seconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(remainder).padStart(2, "0");
  }

  window.WFFGame = {
    modes: MODES,
    createDeck: createDeck,
    formatTime: formatTime
  };
})();
