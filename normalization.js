function showNormalization(i) {
  return ["NFC", "NFD", "NFKC", "NFKD"].map(n => {
    let a = new String(i.normalize(n));
    return "String [" + a.length + "] \u200e" + a + "\u200e (" + Array.prototype.map.call(a, c => {
      return "U+" + c.charCodeAt(0).toString(16)
    }).join(" ") + ") " + n;
  }).join("\n");
}

// console.log(showNormalization("\u03d4"));
// Expected output:
// String [1] ‎ϔ‎ (U+3d4) NFC
// String [2] ‎ϔ‎ (U+3d2 U+308) NFD
// String [1] ‎Ϋ‎ (U+3ab) NFKC
// String [2] ‎Ϋ‎ (U+3a5 U+308) NFKD
