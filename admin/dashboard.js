(function () {
  var DAY_COUNT = 14;
  var exhibitors = window.WFF_EXHIBITORS;

  function randomGenerator(seed) {
    var value = seed;
    return function () {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  function addEvent(events, eventName, playerId, timestamp, properties) {
    events.push({ eventName: eventName, playerId: playerId, timestamp: timestamp.toISOString(), properties: properties || {} });
  }

  function createDemoEvents() {
    var events = [];
    var random = randomGenerator(8241);
    var now = new Date();
    for (var dayOffset = DAY_COUNT - 1; dayOffset >= 0; dayOffset -= 1) {
      var date = new Date(now);
      date.setDate(now.getDate() - dayOffset);
      var games = 3 + Math.floor(random() * 6);
      for (var gameNumber = 0; gameNumber < games; gameNumber += 1) {
        var playerNumber = 1 + Math.floor(random() * 31);
        var playerId = "demo-player-" + String(playerNumber).padStart(2, "0");
        var mode = ["easy", "medium", "hard"][Math.floor(random() * 3)];
        var pairCount = mode === "easy" ? 8 : mode === "medium" ? 10 : 18;
        var startedAt = new Date(date);
        startedAt.setHours(9 + Math.floor(random() * 10), Math.floor(random() * 60), Math.floor(random() * 60));
        var gameId = "demo-" + dayOffset + "-" + gameNumber;
        addEvent(events, "game_started", playerId, startedAt, { mode: mode, sessionId: gameId, pairs: pairCount });
        var complete = random() > 0.2;
        var duration = 80 + Math.floor(random() * 220);
        var moves = pairCount + 5 + Math.floor(random() * (pairCount + 8));
        var reveals = complete ? pairCount : Math.max(1, Math.floor(random() * pairCount));
        var chosen = [];
        for (var reveal = 0; reveal < reveals; reveal += 1) {
          var exhibitor = exhibitors[Math.floor(random() * exhibitors.length)];
          chosen.push(exhibitor);
          var revealTime = new Date(startedAt.getTime() + Math.floor((duration * (reveal + 1)) / reveals) * 1000);
          addEvent(events, "match_found", playerId, revealTime, { mode: mode, exhibitorId: exhibitor.id, sponsorLevel: exhibitor.sponsorLevel, sessionId: gameId });
          if (random() > 0.78) {
            addEvent(events, "exhibitor_clicked", playerId, new Date(revealTime.getTime() + 12000), { mode: mode, exhibitorId: exhibitor.id, sponsorLevel: exhibitor.sponsorLevel, sessionId: gameId });
          }
        }
        if (complete) {
          addEvent(events, "game_completed", playerId, new Date(startedAt.getTime() + duration * 1000), { mode: mode, durationSeconds: duration, moves: moves, pairs: pairCount, sessionId: gameId });
        }
      }
    }
    return events;
  }

  function getLiveEvents() {
    return window.FancyAnalytics.getEvents().filter(function (event) {
      return event && event.properties && typeof event.eventName === "string";
    });
  }

  function eventDate(event) {
    var date = new Date(event.timestamp);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function dateKey(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
  }

  function formatDuration(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainder = seconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(remainder).padStart(2, "0");
  }

  function inRange(event, dates) {
    var date = eventDate(event);
    return date && date >= dates.start && date < dates.end;
  }

  function makeDateRange() {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (DAY_COUNT - 1));
    var end = new Date();
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);
    return { start: start, end: end };
  }

  function renderKpis(events, playerCount) {
    var starts = events.filter(function (event) { return event.eventName === "game_started"; });
    var completions = events.filter(function (event) { return event.eventName === "game_completed"; });
    var avg = function (key) {
      if (!completions.length) return "—";
      var total = completions.reduce(function (sum, event) { return sum + Number(event.properties[key] || 0); }, 0);
      if (!total) return "—";
      return Math.round(total / completions.length);
    };
    var percent = starts.length ? Math.round(completions.length * 100 / starts.length) : 0;
    var kpis = [
      ["TOTAL PLAYS", starts.length.toLocaleString(), "Games started"],
      ["UNIQUE PLAYERS", playerCount.toLocaleString(), "Local player IDs"],
      ["GAMES COMPLETED", completions.length.toLocaleString(), "Finished sessions"],
      ["COMPLETION RATE", percent + "%", "Completed / started"],
      ["AVG. COMPLETION TIME", avg("durationSeconds") === "—" ? "—" : formatDuration(avg("durationSeconds")), "Completed games"],
      ["AVG. MOVES", avg("moves"), "Completed games"]
    ];
    var grid = document.getElementById("kpi-grid");
    grid.innerHTML = "";
    kpis.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "kpi-card";
      card.innerHTML = '<div class="kpi-label"></div><div class="kpi-value"></div><div class="kpi-note"></div>';
      card.querySelector(".kpi-label").textContent = item[0];
      card.querySelector(".kpi-value").textContent = item[1];
      card.querySelector(".kpi-note").textContent = item[2];
      grid.appendChild(card);
    });
  }

  function renderPlaysChart(events, dates) {
    var daily = {};
    for (var offset = DAY_COUNT - 1; offset >= 0; offset -= 1) {
      var day = new Date(dates.start);
      day.setDate(day.getDate() + (DAY_COUNT - 1 - offset));
      daily[dateKey(day)] = { date: day, plays: 0 };
    }
    events.forEach(function (event) {
      if (event.eventName !== "game_started" || !inRange(event, dates)) return;
      var date = eventDate(event);
      var key = dateKey(date);
      if (daily[key]) daily[key].plays += 1;
    });
    var data = Object.keys(daily).map(function (key) { return daily[key]; });
    var maximum = Math.max(1, data.reduce(function (max, item) { return Math.max(max, item.plays); }, 0));
    var chart = document.getElementById("plays-chart");
    var labels = document.createElement("div");
    labels.className = "day-labels";
    chart.innerHTML = "";
    data.forEach(function (item) {
      var bar = document.createElement("div");
      bar.className = "day-bar";
      var fill = document.createElement("div");
      fill.className = "day-bar-fill";
      fill.style.height = Math.max(4, item.plays / maximum * 100) + "%";
      fill.title = formatDate(item.date) + ": " + item.plays + " plays";
      var value = document.createElement("span");
      value.textContent = item.plays;
      fill.appendChild(value);
      bar.appendChild(fill);
      chart.appendChild(bar);
      var label = document.createElement("span");
      label.textContent = item.date.getDate();
      label.title = formatDate(item.date);
      labels.appendChild(label);
    });
    chart.insertAdjacentElement("afterend", labels);
  }

  function renderBarChart(elementId, entries, emptyText) {
    var container = document.getElementById(elementId);
    container.innerHTML = "";
    var maximum = Math.max(1, entries.length ? entries[0].value : 1);
    if (!entries.length || entries[0].value === 0) {
      var empty = document.createElement("p");
      empty.className = "empty-chart";
      empty.textContent = emptyText;
      container.appendChild(empty);
      return;
    }
    entries.slice(0, 5).forEach(function (entry) {
      var row = document.createElement("div");
      row.className = "bar-row";
      var name = document.createElement("span");
      name.className = "bar-name";
      name.textContent = entry.name;
      var track = document.createElement("div");
      track.className = "bar-track";
      var fill = document.createElement("div");
      fill.className = "bar-fill";
      fill.style.width = Math.max(3, entry.value / maximum * 100) + "%";
      track.appendChild(fill);
      var value = document.createElement("span");
      value.className = "bar-value";
      value.textContent = entry.value;
      row.appendChild(name);
      row.appendChild(track);
      row.appendChild(value);
      container.appendChild(row);
    });
  }

  function exhibitorMetrics(events, dates) {
    var metrics = {};
    exhibitors.forEach(function (brand) { metrics[brand.id] = { brand: brand, views: 0, clicks: 0 }; });
    events.forEach(function (event) {
      if (!inRange(event, dates)) return;
      var id = event.properties.exhibitorId;
      if (!metrics[id]) return;
      if (event.eventName === "match_found") metrics[id].views += 1;
      if (event.eventName === "exhibitor_clicked") metrics[id].clicks += 1;
    });
    return Object.keys(metrics).map(function (id) { return metrics[id]; });
  }

  function renderExhibitors(events, dates) {
    var metrics = exhibitorMetrics(events, dates);
    var clicked = metrics.map(function (item) {
      return { name: item.brand.companyName, value: item.clicks };
    }).sort(function (a, b) { return b.value - a.value || a.name.localeCompare(b.name); });
    var viewed = metrics.map(function (item) {
      return { name: item.brand.companyName, value: item.views };
    }).sort(function (a, b) { return b.value - a.value || a.name.localeCompare(b.name); });
    renderBarChart("clicks-chart", clicked, "No exhibitor profile clicks yet.");
    renderBarChart("sponsors-chart", viewed, "No matched brand reveals yet.");
    var body = document.getElementById("performance-body");
    body.innerHTML = "";
    metrics.sort(function (a, b) { return b.clicks - a.clicks || b.views - a.views || a.brand.companyName.localeCompare(b.brand.companyName); });
    metrics.forEach(function (item) {
      var row = document.createElement("tr");
      var rate = item.views ? Math.round(item.clicks / item.views * 100) + "%" : "—";
      var values = [
        item.brand.companyName,
        item.brand.sponsorLevel,
        item.views.toLocaleString(),
        item.clicks.toLocaleString(),
        rate
      ];
      values.forEach(function (value, index) {
        var cell = document.createElement("td");
        if (index === 1) {
          var tag = document.createElement("span");
          tag.className = "sponsor-level";
          tag.textContent = value;
          cell.appendChild(tag);
        } else {
          cell.textContent = value;
        }
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
  }

  function renderDailyTable(events, dates) {
    var daily = {};
    for (var offset = 0; offset < DAY_COUNT; offset += 1) {
      var date = new Date(dates.start);
      date.setDate(date.getDate() + offset);
      daily[dateKey(date)] = { date: date, plays: 0, completed: 0 };
    }
    events.forEach(function (event) {
      if (!inRange(event, dates)) return;
      var key = dateKey(eventDate(event));
      if (!daily[key]) return;
      if (event.eventName === "game_started") daily[key].plays += 1;
      if (event.eventName === "game_completed") daily[key].completed += 1;
    });
    var body = document.getElementById("activity-body");
    body.innerHTML = "";
    Object.keys(daily).reverse().forEach(function (key) {
      var item = daily[key];
      var row = document.createElement("tr");
      [formatDate(item.date), item.plays.toLocaleString(), item.completed.toLocaleString(), item.plays ? Math.round(item.completed / item.plays * 100) + "%" : "—"].forEach(function (value) {
        var cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
  }

  function render() {
    var dates = makeDateRange();
    var demo = createDemoEvents();
    var live = getLiveEvents();
    var combined = demo.concat(live).filter(function (event) { return inRange(event, dates); });
    var players = {};
    combined.forEach(function (event) { if (event.playerId) players[event.playerId] = true; });
    document.getElementById("date-range").textContent = formatDate(dates.start) + " — " + formatDate(new Date(dates.end.getTime() - 1)) + " · 14 DAYS";
    renderKpis(combined, Object.keys(players).length);
    renderPlaysChart(combined, dates);
    renderExhibitors(combined, dates);
    renderDailyTable(combined, dates);
  }

  render();
})();
