(function () {
  var exhibitorDirectoryUrl = "https://events.specialtyfood.com/event/winter-fancyfaire-2027/exhibitors/RXZlbnRWaWV3XzE1NzYyNjM=";

  function escapeXml(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function makeWordmark(name, initials, color, accent) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180"><rect width="380" height="180" rx="22" fill="#fff"/><circle cx="85" cy="90" r="49" fill="' + color + '"/><circle cx="85" cy="90" r="39" fill="none" stroke="' + accent + '" stroke-width="2"/><text x="85" y="101" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-size="32" font-weight="700">' + initials + '</text><text x="151" y="84" fill="#241b35" font-family="Georgia,serif" font-size="24" font-weight="700">' + escapeXml(name) + '</text><text x="153" y="112" fill="' + color + '" font-family="Arial,sans-serif" font-size="10" letter-spacing="2">A FANCY FIND</text></svg>';
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function ingredientArt(motif, accent, ink) {
    var base = ' stroke="' + ink + '" stroke-opacity=".25" stroke-width="2" ';
    var center = ' transform="translate(200 238) scale(.72)" ';
    var art = {
      jerky: '<path d="M-57 27-49-27Q-46-39-34-31L-28-26 15-42Q29-45 30-32L54-17 47 27Q43 40 31 33L12 27-32 42Q-47 45-49 33Z" fill="#bd7951"' + base + '/><path d="M-36-18l63 35m-69-13 49 28m9-55 21 18" fill="none" stroke="#f2cf98" stroke-width="5" stroke-linecap="round"/>',
      chips: '<g transform="rotate(-12)"><ellipse cx="-29" cy="3" rx="31" ry="22" fill="#f5cb75"' + base + '/><ellipse cx="17" cy="-14" rx="29" ry="20" fill="#e9b958"' + base + '/><ellipse cx="35" cy="22" rx="30" ry="19" fill="#f1c86b"' + base + '/><path d="M-46 4q14-10 28-2m12-18q12-8 21-5m6 43q12-9 20-3" fill="none" stroke="#fff0c3" stroke-width="3" opacity=".8"/></g>',
      chili: '<path d="M-46 26C-73-20-34-37-2-5 18 16 43 13 61-13 52 22 29 48-5 40c-14-3-25-12-35-14Z" fill="' + accent + '"' + base + '/><path d="M42-19q0-17 15-20m-15 20q14-10 23-5" fill="none" stroke="#63804d" stroke-width="9" stroke-linecap="round"/><path d="M-36 5q24 12 41 17" fill="none" stroke="#ffc57e" stroke-width="4" stroke-linecap="round" opacity=".75"/>',
      honey: '<path d="M0-49c-18 25-38 43-38 64a38 38 0 0 0 76 0c0-21-20-39-38-64Z" fill="#e5a931"' + base + '/><path d="M-17 5q18-14 33 1t-2 29q-16 9-30-5" fill="none" stroke="#fff1bd" stroke-width="6" stroke-linecap="round"/><path d="M-46-20l12-7m76 60 16 3" stroke="#759158" stroke-width="7" stroke-linecap="round"/>',
      chocolate: '<g transform="rotate(-10)"><rect x="-43" y="-38" width="86" height="76" rx="8" fill="#6f3f37"' + base + '/><path d="M-14-38v76M15-38v76M-43-12h86M-43 13h86" fill="none" stroke="#ddab76" stroke-width="4" opacity=".83"/><circle cx="-28" cy="-26" r="5" fill="#f2d1a3"/></g>',
      olives: '<g><ellipse cx="-24" cy="14" rx="17" ry="24" transform="rotate(-29 -24 14)" fill="#89934e"' + base + '/><ellipse cx="19" cy="-4" rx="17" ry="24" transform="rotate(23 19 -4)" fill="#637842"' + base + '/><ellipse cx="36" cy="30" rx="14" ry="20" transform="rotate(33 36 30)" fill="#9ea45a"' + base + '/><path d="M-42-38Q0-46 48-30M-20-28q15 10 11 25M22-41q-13 15-11 31" fill="none" stroke="#50735b" stroke-width="4" stroke-linecap="round"/></g>',
      tea: '<g fill="none" stroke="#63805a" stroke-linecap="round" stroke-linejoin="round"><path d="M0 38Q-4 2 3-40m0 45Q-38 18-39-9q31 1 42 27m-1-10Q30-4 38-29q-29 3-38 25" stroke-width="5"/><path d="M-20 24Q-9 0-5-14m9 36Q20 7 29-8" stroke-width="3"/></g><circle cx="-26" cy="-34" r="5" fill="' + accent + '"/><circle cx="38" cy="29" r="4" fill="' + accent + '"/>',
      crackers: '<g transform="rotate(-12)"><rect x="-43" y="-27" width="52" height="49" rx="8" fill="#dcae6b"' + base + '/><rect x="-8" y="-9" width="53" height="48" rx="8" fill="#efcb8a"' + base + '/><path d="M-29-15v3m17-3v3M-27 1v3m18-3v3m23-6v3m16 8v3M7 21v3m20 2v3" stroke="#986d3e" stroke-width="4" stroke-linecap="round"/></g>',
      gummies: '<g' + base + '><circle cx="-33" cy="-15" r="20" fill="#df5b65"/><circle cx="7" cy="-31" r="18" fill="#f0bc53"/><circle cx="34" cy="2" r="22" fill="#8b689f"/><path d="M-27 22h41q13 0 13 13t-13 14h-28q-13 0-13-14Z" fill="#64a18c"/></g><g fill="#fff" opacity=".58"><circle cx="-39" cy="-21" r="4"/><circle cx="0" cy="-38" r="4"/><circle cx="27" cy="-5" r="5"/><circle cx="-15" cy="30" r="4"/></g>',
      oats: '<path d="M0 42V-38m0 16L-32-42m32 32L32-41m-32 7L-40-11m40 6 38-25m-38 8L-30 5m30 14 36-21m-36 4L-34 38m34-5 39 7" fill="none" stroke="#b08a55" stroke-width="4" stroke-linecap="round"/><g fill="#e5c78f">' +
        '<ellipse cx="-30" cy="-42" rx="7" ry="13" transform="rotate(-35 -30 -42)"/><ellipse cx="32" cy="-41" rx="7" ry="13" transform="rotate(30 32 -41)"/><ellipse cx="-40" cy="-11" rx="7" ry="13" transform="rotate(-50 -40 -11)"/><ellipse cx="38" cy="-20" rx="7" ry="13" transform="rotate(44 38 -20)"/><ellipse cx="-30" cy="4" rx="7" ry="13" transform="rotate(-40 -30 4)"/><ellipse cx="36" cy="-8" rx="7" ry="13" transform="rotate(40 36 -8)"/><ellipse cx="-34" cy="38" rx="7" ry="13" transform="rotate(-45 -34 38)"/><ellipse cx="40" cy="39" rx="7" ry="13" transform="rotate(40 40 39)"/></g>',
      citrus: '<circle cx="-19" cy="0" r="31" fill="#f1cb73"' + base + '/><circle cx="-19" cy="0" r="23" fill="#fff0c4"/><circle cx="-19" cy="0" r="18" fill="#f5cd76"/><path d="M-19-18v36m-18-18h36m-31-13 26 26m1-26-27 26" stroke="#fff4d6" stroke-width="3"/><circle cx="32" cy="19" r="23" fill="#ec9c86"' + base + '/><path d="M32 0v38m-19-19h38m-33-14 28 28m1-28L18 33" stroke="#ffe7cc" stroke-width="3"/><path d="M8-42q20-22 40-11" fill="none" stroke="#678259" stroke-width="7" stroke-linecap="round"/>',
      salmon: '<path d="M-48-22Q-29-46-8-28q18-21 39-4 29-10 34 13l-13 38-56 18q-26 0-36-25Z" fill="#e88d74"' + base + '/><path d="M-31-23q20 12 24 37m2-52q19 12 22 37m6-33q17 14 18 34m-5-25q16 9 22 20" fill="none" stroke="#ffe0b7" stroke-width="5" stroke-linecap="round"/>',
      mushroom: '<g><path d="M-47-8a47 37 0 0 1 94 0Z" fill="#d9b99a"' + base + '/><path d="M-28-7v28q0 19 28 19t28-19V-7Z" fill="#f3e5d0"' + base + '/><path d="M-31 4q31-10 62 0" fill="none" stroke="#bb9472" stroke-width="4"/><circle cx="-19" cy="-9" r="3" fill="#fff4e3"/><circle cx="12" cy="-22" r="4" fill="#fff4e3"/><circle cx="31" cy="-9" r="3" fill="#fff4e3"/></g>',
      butter: '<path d="m-41-23 64-15 21 14-61 17Z" fill="#ffe394"' + base + '/><path d="m-17-7 58-11v41l-58 15Z" fill="#f3c64f"' + base + '/><path d="m-41-23 24 16v42l-24-16Z" fill="#e2ac3e"' + base + '/><path d="m-34-18 11 8v27m11-33 10 7v24" fill="none" stroke="#fff0b8" stroke-width="3" opacity=".82"/>',
      pancakes: '<g><ellipse cx="0" cy="25" rx="45" ry="14" fill="#cc9251"/><ellipse cx="0" cy="12" rx="43" ry="14" fill="#f0c276"/><ellipse cx="0" cy="-1" rx="42" ry="14" fill="#dfaa65"/><ellipse cx="0" cy="-14" rx="40" ry="14" fill="#f2cb82"/><rect x="-10" y="-33" width="24" height="17" rx="5" fill="#ffebad" transform="rotate(12)"/><path d="M12-15q7 19-3 35" fill="none" stroke="#b86e31" stroke-width="3" stroke-linecap="round"/></g>',
      pepper: '<path d="M-48 18Q-57-21-27-27q22-2 29 15 6-19 30-14 33 11 11 48-21 29-45 31-29-5-46-35Z" fill="#b94836"' + base + '/><path d="M-1-12q-1-27 18-39m-17 39q11-18 28-20" fill="none" stroke="#718652" stroke-width="8" stroke-linecap="round"/><circle cx="-27" cy="1" r="4" fill="#f4b87a"/><circle cx="32" cy="22" r="4" fill="#f4b87a"/>',
      ginger: '<path d="m-34-19 19-13 17 12 19-11 18 16-11 19 13 18-19 18-18-13-18 14-22-12 8-19-17-16Z" fill="#d9a559"' + base + '/><path d="m-24-16 13 1m15 16 17-5m-37 22 14-6m32-24-7 13" fill="none" stroke="#f6dfae" stroke-width="4" stroke-linecap="round"/>',
      blueberry: '<g><circle cx="-26" cy="9" r="20" fill="#5472a5"' + base + '/><circle cx="16" cy="-20" r="22" fill="#677fae"' + base + '/><circle cx="31" cy="26" r="19" fill="#47618f"' + base + '/><circle cx="-2" cy="31" r="16" fill="#8094bb"' + base + '/><path d="m-35 0 9-5 9 5-2 9-7 5-7-4Zm32-28 10-6 9 6-2 10-8 5-8-4Zm24 49 9-6 8 6-2 9-7 5-7-4Z" fill="#c9d7eb"/></g><path d="M-28-25q18-24 32-11" fill="none" stroke="#617f54" stroke-width="6" stroke-linecap="round"/>'
    };
    return '<g' + center + '>' + (art[motif] || art.citrus) + '</g>';
  }

  function makeProductImage(item) {
    var colors = item.palette;
    var ingredients = ingredientArt(item.motif, colors[1], colors[2]);
    var packageArt;
    if (item.format === "bottle") {
      packageArt = '<g filter="url(#shadow)"><path d="M180 57h36v42q0 13 12 22l25 20q16 13 16 34v166q0 22-21 29H112q-21-7-21-29V175q0-21 16-34l25-20q12-9 12-22V57h36Z" fill="url(#glass)" stroke="#ffffff" stroke-opacity=".8" stroke-width="3"/><path d="M148 108h64m-88 56q57 17 112 0m-112 153q57 15 112 0" fill="none" stroke="#ffffff" stroke-opacity=".48" stroke-width="4"/><path d="M146 57h70V99h-70Z" fill="url(#cap)" stroke="#ffffff" stroke-opacity=".75" stroke-width="2"/><path d="M151 69h60m-60 12h60m-60 12h60" stroke="#ffffff" stroke-opacity=".48" stroke-width="2"/></g>';
    } else if (item.format === "jar" || item.format === "honey") {
      packageArt = '<g filter="url(#shadow)"><path d="M118 148q0-17 19-20h126q19 3 19 20l-8 178q-2 22-24 27h-98q-22-5-24-27Z" fill="url(#glass)" stroke="#ffffff" stroke-opacity=".82" stroke-width="3"/><path d="M124 204h152v104q-76 22-152 0Z" fill="' + (item.format === "honey" ? "#dfa43c" : colors[1]) + '" fill-opacity=".64"/><path d="M125 157h149m-145 169q71 17 141 0" fill="none" stroke="#ffffff" stroke-opacity=".55" stroke-width="4"/><rect x="126" y="107" width="148" height="48" rx="8" fill="url(#cap)" stroke="#ffffff" stroke-opacity=".8" stroke-width="3"/><path d="M133 119h134m-134 10h134m-134 10h134" stroke="#ffffff" stroke-opacity=".46" stroke-width="2"/></g>';
    } else if (item.format === "can") {
      packageArt = '<g filter="url(#shadow)"><path d="M123 104q77-17 154 0v230q-77 18-154 0Z" fill="url(#material)" stroke="#ffffff" stroke-opacity=".85" stroke-width="3"/><ellipse cx="200" cy="104" rx="77" ry="17" fill="#d4d1cc" stroke="#ffffff" stroke-width="3"/><ellipse cx="200" cy="105" rx="61" ry="10" fill="#86827b"/><path d="M129 119v207m142-207v207" stroke="#ffffff" stroke-opacity=".44" stroke-width="5"/><ellipse cx="200" cy="334" rx="77" ry="17" fill="#b1ada6" stroke="#ffffff" stroke-width="3"/></g>';
    } else if (item.format === "box") {
      packageArt = '<g filter="url(#shadow)"><path d="m119 124 81-32 81 32v215l-81 29-81-29Z" fill="url(#material)" stroke="#ffffff" stroke-opacity=".82" stroke-width="3"/><path d="m119 124 81 34 81-34m-81 34v219" fill="none" stroke="#ffffff" stroke-opacity=".55" stroke-width="3"/><path d="m132 119 68-26 68 26" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="4"/></g>';
    } else if (item.format === "tub") {
      packageArt = '<g filter="url(#shadow)"><path d="M117 145h166l-14 181q-69 23-138 0Z" fill="url(#material)" stroke="#ffffff" stroke-opacity=".83" stroke-width="3"/><ellipse cx="200" cy="145" rx="83" ry="19" fill="#faf8f3" stroke="#ffffff" stroke-width="3"/><path d="M123 164q77 17 154 0m-146 157q69 18 138 0" fill="none" stroke="#ffffff" stroke-opacity=".54" stroke-width="4"/><rect x="111" y="119" width="178" height="31" rx="8" fill="url(#cap)" stroke="#ffffff" stroke-opacity=".8" stroke-width="3"/><path d="M121 130h158m-158 9h158" stroke="#ffffff" stroke-opacity=".55" stroke-width="2"/></g>';
    } else {
      packageArt = '<g filter="url(#shadow)"><path d="M126 91h148l15 39-10 225q-79 24-158 0l-10-225Z" fill="url(#material)" stroke="#ffffff" stroke-opacity=".84" stroke-width="3"/><path d="M126 91h148l-12 37H138Zm-5 44h158m-155 9h152" fill="url(#cap)" stroke="#ffffff" stroke-opacity=".64" stroke-width="2"/><path d="M134 169v165m132-165v165m-120 12q54 14 108 0" fill="none" stroke="#ffffff" stroke-opacity=".4" stroke-width="4"/><path d="M142 145h116" stroke="#ffffff" stroke-opacity=".55" stroke-width="2"/></g>';
    }
    var titleWords = item.productName.toUpperCase().split(/\s+/);
    var titleLines = [];
    var titleLine = "";
    titleWords.forEach(function (word) {
      var nextLine = titleLine ? titleLine + " " + word : word;
      if (titleLine && nextLine.length > 17 && titleLines.length < 2) {
        titleLines.push(titleLine);
        titleLine = word;
      } else {
        titleLine = nextLine;
      }
    });
    if (titleLine) titleLines.push(titleLine);
    titleLines = titleLines.slice(0, 3);
    var titleArt = titleLines.map(function (line, index) {
      return '<text x="200" y="' + (301 + index * 13) + '" text-anchor="middle" fill="' + colors[2] + '" font-family="Georgia,serif" font-size="10" font-weight="700" textLength="126" lengthAdjust="spacingAndGlyphs">' + escapeXml(line) + '</text>';
    }).join("");
    var label = '<g><rect x="126" y="150" width="148" height="197" rx="4" fill="url(#label)" stroke="#d4c9b7" stroke-width="2"/><path d="M135 159h130v178H135Z" fill="none" stroke="' + colors[1] + '" stroke-opacity=".42"/><text x="200" y="178" text-anchor="middle" fill="' + colors[2] + '" font-family="Arial,sans-serif" font-size="9" font-weight="700" letter-spacing="1.5">SMALL BATCH</text><path d="M158 186h84" stroke="' + colors[1] + '" stroke-opacity=".5"/></g>';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 420"><defs><linearGradient id="material" x1="0" y1="0" x2="1" y2=".2"><stop stop-color="' + colors[2] + '"/><stop offset=".18" stop-color="' + colors[0] + '"/><stop offset=".5" stop-color="' + colors[1] + '"/><stop offset=".82" stop-color="' + colors[0] + '"/><stop offset="1" stop-color="' + colors[2] + '"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="' + colors[2] + '"/><stop offset=".2" stop-color="' + colors[0] + '"/><stop offset=".52" stop-color="' + colors[1] + '"/><stop offset=".82" stop-color="' + colors[0] + '"/><stop offset="1" stop-color="' + colors[2] + '"/></linearGradient><linearGradient id="cap" x1="0" y1="0" x2="0" y2="1"><stop stop-color="' + colors[1] + '"/><stop offset=".5" stop-color="' + colors[0] + '"/><stop offset="1" stop-color="' + colors[2] + '"/></linearGradient><linearGradient id="label" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffdf8"/><stop offset="1" stop-color="#e9e0d2"/></linearGradient><radialGradient id="backdrop"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#efede8"/></radialGradient><filter id="shadow" x="-.3" y="-.2" width="1.6" height="1.6"><feGaussianBlur in="SourceAlpha" stdDeviation="9"/><feOffset dy="8"/><feComponentTransfer><feFuncA type="linear" slope=".24"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="420" fill="url(#backdrop)"/><ellipse cx="200" cy="378" rx="112" ry="15" fill="#302c34" fill-opacity=".12"/>' + packageArt + label + ingredients + titleArt + '<path d="M157 292h86" stroke="' + colors[1] + '" stroke-width="1.5"/></svg>';
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  var entries = [
    {
      id: "galactic-granola", companyName: "Galactic Granola Co.", brand: "GALACTIC PANTRY",
      productName: "Granola Clusters",
      boothNumber: "B-1421", category: "Breakfast & cereal",
      sponsorLevel: "Silver", color: "#5b87aa", accent: "#d9ecf7", format: "pouch", motif: "blueberry",
      palette: ["#132e4d", "#467bb0", "#172435"], tagline: "BLUEBERRY · ALMOND · CHIA"
    },
    {
      id: "juniper-rye", companyName: "Juniper & Rye", brand: "JUNIPER & RYE",
      productName: "Sourdough Crackers", boothNumber: "C-1840", category: "Bakery & grains",
      sponsorLevel: "Gold", color: "#796596",
      accent: "#e2d5ef", format: "box", motif: "crackers", palette: ["#63506b", "#b99570", "#494050"], tagline: "SMALL BATCH · SEA SALT"
    },
    {
      id: "little-bay", companyName: "Little Bay Preserves", brand: "LITTLE BAY",
      productName: "Blueberry Bay Jam", boothNumber: "B-1038", category: "Pantry & preserves",
      sponsorLevel: "Silver", color: "#5b8172",
      accent: "#d9e9dc", format: "jar", motif: "blueberry", palette: ["#415d50", "#88a989", "#e5cfaa"], tagline: "WILD FRUIT · SLOW MADE"
    },
    {
      id: "northstar-nut", companyName: "Northstar Nut Co.", brand: "NORTHSTAR",
      productName: "Sweet Heat Beef Jerky", boothNumber: "D-2216", category: "Snacks & sweets",
      sponsorLevel: "Platinum", color: "#ad7650",
      accent: "#f0dfc8", format: "pouch", motif: "jerky", palette: ["#783d3c", "#bc7258", "#402b30"], tagline: "GRASS-FED · SLOW CRAFTED"
    },
    {
      id: "wildflower-honey", companyName: "Wildflower Honey", brand: "WILDFLOWER",
      productName: "Wildflower Honey", boothNumber: "C-1377", category: "Seasonings & sweeteners",
      sponsorLevel: "Gold", color: "#b49240",
      accent: "#f4eccd", format: "honey", motif: "honey", palette: ["#805220", "#d69b39", "#583b26"], tagline: "RAW · BRIGHT · GOLDEN"
    },
    {
      id: "stone-mill", companyName: "Stone Mill Provisions", brand: "STONE MILL",
      productName: "Heritage Harvest Oats", boothNumber: "B-1903", category: "Breakfast & cereal",
      sponsorLevel: "Silver", color: "#66738b",
      accent: "#dce3ef", format: "pouch", motif: "oats", palette: ["#5f4b39", "#ab9270", "#55463d"], tagline: "WHOLE GRAIN · STONE MILLED"
    },
    {
      id: "bluebird-botanicals", companyName: "Bluebird Botanicals", brand: "BLUEBIRD",
      productName: "Ginger Lemon Tonic", boothNumber: "A-1614", category: "Beverages",
      sponsorLevel: "Gold", color: "#4d8291",
      accent: "#d6edf0", format: "bottle", motif: "ginger", palette: ["#355f70", "#61a0a0", "#274850"], tagline: "GINGER · LEMON · BRIGHT"
    },
    {
      id: "hearthside", companyName: "Hearthside Dairy", brand: "HEARTHSIDE",
      productName: "Cultured Creamery Butter", boothNumber: "D-1096", category: "Dairy & alternatives",
      sponsorLevel: "Silver", color: "#a16068",
      accent: "#f0dce0", format: "tub", motif: "butter", palette: ["#9c694b", "#e2bb70", "#6c4941"], tagline: "CULTURED · FARM CHURNED"
    },
    {
      id: "golden-hour", companyName: "Golden Hour Olive Oil", brand: "GOLDEN HOUR",
      productName: "First Press Olive Oil", boothNumber: "C-2017", category: "Oils & vinegars",
      sponsorLevel: "Platinum", color: "#888442",
      accent: "#ece9cb", format: "bottle", motif: "olives", palette: ["#6f6132", "#a2934f", "#514b35"], tagline: "EXTRA VIRGIN · FIRST PRESS"
    },
    {
      id: "moonrise-chocolate", companyName: "Moonrise Chocolate", brand: "MOONRISE",
      productName: "Midnight Dark Chocolate", boothNumber: "A-1328", category: "Chocolate & confectionery",
      sponsorLevel: "Gold", color: "#76545d",
      accent: "#efdee2", format: "box", motif: "chocolate", palette: ["#442938", "#86505d", "#29212d"], tagline: "CACAO · SEA SALT · SLOW MADE"
    },
    {
      id: "fern-field", companyName: "Fern & Field", brand: "FERN & FIELD",
      productName: "Wild Shiitake Crisps", boothNumber: "B-1745", category: "Plant-based",
      sponsorLevel: "Silver", color: "#5b8061",
      accent: "#deebdc", format: "pouch", motif: "mushroom", palette: ["#4c674e", "#83a269", "#34433b"], tagline: "SAVORY · CRUNCHY · FORAGED"
    },
    {
      id: "bright-coast", companyName: "Bright Coast Seafood", brand: "BRIGHT COAST",
      productName: "Coastal Smoked Salmon", boothNumber: "D-1652", category: "Seafood",
      sponsorLevel: "Gold", color: "#4f7899",
      accent: "#d9e9f4", format: "can", motif: "salmon", palette: ["#456779", "#81aab1", "#344751"], tagline: "SMOKE · SALT · SEA"
    },
    {
      id: "paper-crane-tea", companyName: "Paper Crane Tea", brand: "PAPER CRANE",
      productName: "Midnight Garden Tea", boothNumber: "A-2008", category: "Tea & infusions",
      sponsorLevel: "Silver", color: "#9b775d",
      accent: "#f1e4d5", format: "box", motif: "tea", palette: ["#6d5965", "#9b8177", "#4a4751"], tagline: "WHOLE LEAF · QUIET MOMENTS"
    },
    {
      id: "little-sparrow", companyName: "Little Sparrow Snacks", brand: "LITTLE SPARROW",
      productName: "Orchard Fruit Gummies", boothNumber: "C-1539", category: "Snacks & sweets",
      sponsorLevel: "Gold", color: "#9a647e",
      accent: "#efdeea", format: "pouch", motif: "gummies", palette: ["#82556d", "#bd8191", "#4f4154"], tagline: "FRUIT FORWARD · SOFT & SUNNY"
    },
    {
      id: "cinder-spice", companyName: "Cinder & Spice", brand: "CINDER & SPICE",
      productName: "Firelight Chili Sauce", boothNumber: "B-1205", category: "Spices & seasonings",
      sponsorLevel: "Silver", color: "#b16a49",
      accent: "#f1dfd1", format: "bottle", motif: "chili", palette: ["#754031", "#b45b39", "#462d2c"], tagline: "SLOW HEAT · BIG FLAVOR"
    },
    {
      id: "good-morning", companyName: "Good Morning Granola", brand: "GOOD MORNING",
      productName: "Maple Stack Pancake Mix", boothNumber: "D-1883", category: "Breakfast",
      sponsorLevel: "Gold", color: "#8c7650",
      accent: "#efe6d1", format: "pouch", motif: "pancakes", palette: ["#846541", "#d1a45e", "#524736"], tagline: "JUST ADD SUNDAY"
    },
    {
      id: "snowcap-sparkling", companyName: "Snowcap Sparkling", brand: "SNOWCAP",
      productName: "Citrus Cloud Sparkling Water", boothNumber: "A-1154", category: "Beverages",
      sponsorLevel: "Platinum", color: "#668ba5",
      accent: "#dcecf6", format: "can", motif: "citrus", palette: ["#436e94", "#70a9c0", "#354d69"], tagline: "BRIGHT CITRUS · BUBBLY"
    },
    {
      id: "wild-fig", companyName: "Wild Fig Kitchen", brand: "WILD FIG",
      productName: "Ember Chili Crunch", boothNumber: "C-1772", category: "Pantry & provisions",
      sponsorLevel: "Silver", color: "#78608a",
      accent: "#e8ddf0", format: "jar", motif: "pepper", palette: ["#684a44", "#a86049", "#40323b"], tagline: "CRUNCHY · SPICY · SAVORY"
    }
  ];

  window.WFF_EXHIBITORS = entries.map(function (item) {
    var productImage = makeProductImage(item);
    return {
      id: item.id,
      companyName: item.companyName,
      logo: makeWordmark(item.companyName, item.brand.split(/\s+/).map(function (word) { return word.charAt(0); }).join("").slice(0, 2), item.color, item.accent),
      productName: item.productName,
      productImage: productImage,
      boothNumber: item.boothNumber,
      category: item.category,
      profileUrl: exhibitorDirectoryUrl,
      sponsorLevel: item.sponsorLevel
    };
  });
})();
