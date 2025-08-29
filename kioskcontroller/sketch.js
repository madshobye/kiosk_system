var scrollValueTextSize = new uiFloat(40);
var state = 0;

var peer = new Peer();
var input;
var conn;
let connected = false;
let lastConnections = {};
let conID = "connections11";
let urls = null;

function setup() {
  noStroke();
  noScrolling();
  createCanvas(windowWidth, windowHeight);
  loadGoogleFont("Droid Sans");
  textFont("Droid Sans");
  frameRate(30);
  input = createInput("https://editor.p5js.org/hobye/full/T0Sa3gqqo");
  input.position(45, 30);
  input.size(width - 100, 40);
  input.hide();
  //window.localStorage.removeItem("connections");
  storedConnections = window.localStorage.getItem(conID);
  if (storedConnections != null ) {
    lastConnections = JSON.parse(storedConnections);
  }


}



var toggleValue = false;

function getUrlParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function draw() {
  background(200);
  uiUpdateSimple();
  uiContainerStart(50, 100, width - 100);
  if (getUrlParam("id") !=null && !connected && uiButton("Connect").clicked) {
    peerConnect(getUrlParam("id"));
  }
  /*
if(uiButton("Connect").clicked) {
    peerConnect("Uereafle_270e7963-78ab-467f-8eb5-c01757857f16");
}*/
  
  for (const key in lastConnections) {
    if (!connected && uiButton(key.split("_")[0] + " (" + lastConnections[key] +  ")").clicked ) {
     peerConnect(key);
    }
  }
  if (connected) {
    input.size(width - 100, 40);
    if (uiButton("Send").clicked) {
      conn.send({
        url: "https://editor.p5js.org/hobye/full/T0Sa3gqqo",
      });
    }
   
    if(urls !=null)
    {
      print(urls.urls);
  for (const key in urls.urls) {
    if ( uiButton(key.replace("https://editor.p5js.org/", "P5: ") ).clicked ) {
     conn.send({
        url: "https://editor.p5js.org/hobye/full/T0Sa3gqqo",
      });
    }
  }
  }

    if (uiButton("Clear").clicked) {
      conn.send({
        clear: true,
      });
    }

    if (uiButton("Refresh").clicked) {
      conn.send({
        refresh: true,
      });
    }
    if (uiButton("Clear ID (!!!)", 255).clicked) {
      conn.send({
        clearId: true,
      });
    }
    if (uiButton("Disconnect", 255).clicked) {
      conn.close();
      connected = false;
    }
  }
  uiContainerEnd();
}

function peerConnect(id) {
  if (lastConnections.hasOwnProperty(id)) {
    lastConnections[id]++;
  } else {
    lastConnections[id] = 0;
  }
  
  window.localStorage.setItem(conID, JSON.stringify(lastConnections));
  
  peer.on("error", function (err) {
    print(err);
  });
  peer.on("disconnected", function () {
    print("disconnected");
  });

  conn = peer.connect(id);
 
  conn.on("data", function (data) {
   
    if(data.hasOwnProperty("urls"))
       {
          urls = data;
         print(urls);
  
        }}
  );
  conn.on("open", function () {
    print("connected");

    connected = true;
    input.show();
  });
}

function keyReleased() {
  if (key == "f") {
    fullScreenToggle();
  }

  if (key == "c") {
  }
}
