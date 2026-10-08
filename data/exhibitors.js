(function () {
  function makeDemoLogo(name, initials, color, accent) {
    var safeName = name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180"><rect width="380" height="180" rx="22" fill="#fff"/><circle cx="85" cy="90" r="49" fill="' + color + '"/><circle cx="85" cy="90" r="39" fill="none" stroke="' + accent + '" stroke-width="2"/><text x="85" y="101" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-size="32" font-weight="700">' + initials + '</text><text x="151" y="84" fill="#241b35" font-family="Georgia,serif" font-size="24" font-weight="700">' + safeName + '</text><text x="153" y="112" fill="' + color + '" font-family="Arial,sans-serif" font-size="10" letter-spacing="2">A FANCY FIND</text></svg>';
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  var brands = [
    ["alpine-orchard", "Alpine Orchard", "AO", "#5b87aa", "#d9ecf7", "B-1421", "Fruit & produce", "Silver"],
    ["juniper-rye", "Juniper & Rye", "JR", "#796596", "#e2d5ef", "C-1840", "Bakery & grains", "Gold"],
    ["little-bay", "Little Bay Preserves", "LB", "#5b8172", "#d9e9dc", "B-1038", "Pantry & preserves", "Silver"],
    ["northstar-nut", "Northstar Nut Co.", "NN", "#ad7650", "#f0dfc8", "D-2216", "Snacks & sweets", "Platinum"],
    ["wildflower-honey", "Wildflower Honey", "WH", "#b49240", "#f4eccd", "C-1377", "Sweeteners", "Gold"],
    ["stone-mill", "Stone Mill Provisions", "SM", "#66738b", "#dce3ef", "B-1903", "Pantry & provisions", "Silver"],
    ["bluebird-botanicals", "Bluebird Botanicals", "BB", "#4d8291", "#d6edf0", "A-1614", "Beverages", "Gold"],
    ["hearthside", "Hearthside Dairy", "HD", "#a16068", "#f0dce0", "D-1096", "Dairy & alternatives", "Silver"],
    ["golden-hour", "Golden Hour Olive Oil", "GH", "#888442", "#ece9cb", "C-2017", "Oils & vinegars", "Platinum"],
    ["moonrise-chocolate", "Moonrise Chocolate", "MC", "#76545d", "#efdee2", "A-1328", "Chocolate & confectionery", "Gold"],
    ["fern-field", "Fern & Field", "FF", "#5b8061", "#deebdc", "B-1745", "Plant-based", "Silver"],
    ["bright-coast", "Bright Coast Seafood", "BC", "#4f7899", "#d9e9f4", "D-1652", "Seafood", "Gold"],
    ["paper-crane-tea", "Paper Crane Tea", "PC", "#9b775d", "#f1e4d5", "A-2008", "Tea & infusions", "Silver"],
    ["little-sparrow", "Little Sparrow Snacks", "LS", "#9a647e", "#efdeea", "C-1539", "Snacks & sweets", "Gold"],
    ["cinder-spice", "Cinder & Spice", "CS", "#b16a49", "#f1dfd1", "B-1205", "Spices & seasonings", "Silver"],
    ["good-morning", "Good Morning Granola", "GM", "#8c7650", "#efe6d1", "D-1883", "Breakfast", "Gold"],
    ["snowcap-sparkling", "Snowcap Sparkling", "SS", "#668ba5", "#dcecf6", "A-1154", "Beverages", "Platinum"],
    ["wild-fig", "Wild Fig Kitchen", "WF", "#78608a", "#e8ddf0", "C-1772", "Pantry & provisions", "Silver"]
  ];

  window.WFF_EXHIBITORS = brands.map(function (item) {
    return {
      id: item[0],
      companyName: item[1],
      logo: makeDemoLogo(item[1], item[2], item[3], item[4]),
      boothNumber: item[5],
      category: item[6],
      profileUrl: "https://example.com/exhibitors/" + item[0],
      sponsorLevel: item[7]
    };
  });
})();
