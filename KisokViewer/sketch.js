var scrollValueTextSize = new uiFloat(40);
var state = 0;
let conn;
let peerID;
let showingFrame = false;
let frameURL = "";

let qrCode;
let showTimeOut = 0;
let showTimeOutEnabled = false;
let showTimeOutTime = 10000;
let qrSize = 300;
let cnv;
let frame;
let frameOffset = false;
let peer;
let lastUrls = { urls: {} };
let justConnected = false;

function setup() {
  noStroke();
  noScrolling();

  storedUrls = window.localStorage.getItem("storedUrls1");
  if (storedUrls != null) {
    lastUrls = JSON.parse(storedUrls);
  }

  let storedURL = window.localStorage.getItem("frameURL");

  if (storedURL != null) {
    frameURL = storedURL;
    showTimeOutEnabled = true;
    print(frameURL);
  }

  let storedID = window.localStorage.getItem("peerID2");
  print(storedID);
  if (storedID != null) {
    peerID = storedID;
  } else {
    peerID = generateID() + "_" + crypto.randomUUID();
    window.localStorage.setItem("peerID2", peerID);
  }
  print(peerID);
  peer = new Peer(peerID);
  peer.on("open", function (id) {
    console.log("My peer ID is: " + id);
  });
  peer.on("error", function (err) {
    print(err);
  });
  peer.on("disconnected", function () {
    print("disconnected");
  });
  peer.on("connection", function (c) {
    if (conn) {
      conn.close();
      
    }
    conn = c;

    conn.on("data", function (data) {
      print(data);
      if (data.url != undefined) {
        frameSetUrl(data.url);
        frameShow(true);
        //  print("hep");
      }
      if (data.refresh != undefined && data.refresh) {
        frameSetUrl(frameURL);
        frameShow(true);
      }
      if (data.clear != undefined && data.clear) {
        frameSetUrl("");
        window.localStorage.removeItem("frameURL");
        frameShow(false);
      }
      if (data.getUrls != undefined && data.getUrls) {
      
        conn.send(lastUrls);
        print("hep");
      }
    });

    console.log("conn to " + conn.peer);
  });

  frame = document.getElementById("frame");

  cnv = createCanvas(windowWidth, windowHeight);
  frameShow(false);

  loadGoogleFont("Droid Sans");
  textFont("Droid Sans");
  qrcodegenSetup();
  qrCode = qrcodegen.QrCode.encodeText(
    "https://madshobye.github.io/kioskcontroller_1/kioskcontroller/index.html?id=" +
      peerID,
    qrcodegen.QrCode.Ecc.MEDIUM
  );
  frameRate(30);
  textSize(100);
}

var toggleValue = false;

function draw() {
  background(255);

  if (showTimeOutEnabled) {
    if (millis() < showTimeOutTime) {
      text(
        round((showTimeOut + showTimeOutTime - millis()) / 1000),
        windowWidth / 2 - 100 / 2,
        120
      );
    } else {
      frameSetUrl(frameURL);
      showTimeOutEnabled = false;
      frameShow(true);
    }
  }

  uiUpdateSimple();

  drawQRCode(
    qrCode,
    windowWidth / 2 - qrSize / 16,
    windowHeight / 2 - qrSize / 16,
    qrSize
  );
}

function keyReleased() {
  if (key == "f") {
    fullScreenToggle();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function frameShow(show) {
  if (show) {
    frame.style.display = "block";
    cnv.hide();
  } else {
    frame.style.display = "none";
    cnv.show();
  }
  showingFrame = show;
  windowResized();
}

function frameSetUrl(url) {
  frame.src = url;
  frameURL = url;

  if (lastUrls.hasOwnProperty(url)) {
    lastUrls.urls[url]++;
  } else {
    lastUrls.urls[url] = 0;
  }

  window.localStorage.setItem("storedUrls1", JSON.stringify(lastUrls));

  var classList = frame.classList;
  while (classList.length > 0) {
    classList.remove(classList.item(0));
  }
  if (frameURL.includes("editor.p5js.org/")) {
    classList.add("fullP5");
  } else {
    classList.add("full");
  }
  window.localStorage.setItem("frameURL", frameURL);
}

function generateID() {
  let length = Math.floor(Math.random() * 6) + 5;
  const consonants = [
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "qu",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z",
    "bl",
    "cl",
    "fl",
    "gl",
    "pl",
    "sl",
    "br",
    "cr",
    "dr",
    "fr",
    "gr",
    "pr",
    "tr",
    "ch",
    "sh",
    "th",
    "wh",
    "wr",
  ];

  const vowels = [
    "a",
    "e",
    "i",
    "o",
    "u",
    "ae",
    "ai",
    "ea",
    "ee",
    "ie",
    "oa",
    "oo",
    "ou",
    "ue",
  ];

  let word = "";
  let useConsonant = Math.random() > 0.5; // random start with consonant or vowel

  while (word.length < length) {
    if (useConsonant) {
      word += consonants[Math.floor(Math.random() * consonants.length)];
    } else {
      word += vowels[Math.floor(Math.random() * vowels.length)];
    }
    useConsonant = !useConsonant; // alternate consonant/vowel
  }

  // Capitalize first letter for realism
  return word.charAt(0).toUpperCase() + word.slice(1, length);
}
