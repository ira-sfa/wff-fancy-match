(function () {
  var EVENTS_KEY = "wff-fancy-match-events";
  var PLAYER_KEY = "wff-fancy-match-player";
  var VISIT_KEY = "wff-fancy-match-visited";
  var inMemoryEvents = [];
  var fallbackPlayerId = "local-" + Date.now().toString(36);

  function storageAvailable() {
    try {
      var testKey = "__wff_storage_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error("Local storage is unavailable; analytics will last only for this page visit.", error);
      return false;
    }
  }

  var canStore = storageAvailable();

  function getEvents() {
    if (!canStore) return inMemoryEvents.slice();
    try {
      var stored = window.localStorage.getItem(EVENTS_KEY);
      var parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Could not read saved game analytics.", error);
      return [];
    }
  }

  function getPlayerId() {
    if (!canStore) return fallbackPlayerId;
    try {
      var playerId = window.localStorage.getItem(PLAYER_KEY);
      if (!playerId) {
        playerId = window.crypto && window.crypto.randomUUID
          ? window.crypto.randomUUID()
          : "player-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
        window.localStorage.setItem(PLAYER_KEY, playerId);
      }
      return playerId;
    } catch (error) {
      console.error("Could not save the local player identifier.", error);
      return fallbackPlayerId;
    }
  }

  function record(eventName, properties) {
    var events = getEvents();
    events.push({
      eventName: eventName,
      playerId: getPlayerId(),
      timestamp: new Date().toISOString(),
      properties: properties || {}
    });
    if (events.length > 2500) events = events.slice(-2500);
    inMemoryEvents = events;
    if (canStore) {
      try {
        window.localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      } catch (error) {
        canStore = false;
        console.error("Could not save game analytics; future events will remain in memory only.", error);
      }
    }
  }

  function recordVisit() {
    if (!canStore) {
      record("first_visit", { source: "game" });
      return;
    }
    try {
      var hasVisited = window.localStorage.getItem(VISIT_KEY);
      record(hasVisited ? "returning_visit" : "first_visit", { source: "game" });
      window.localStorage.setItem(VISIT_KEY, "true");
    } catch (error) {
      console.error("Could not save visit status.", error);
    }
  }

  window.FancyAnalytics = {
    record: record,
    getEvents: getEvents,
    getPlayerId: getPlayerId,
    recordVisit: recordVisit,
    eventsKey: EVENTS_KEY
  };
})();
