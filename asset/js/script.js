// ----------  MODE JOUR/NUIT  -----------
const jourNuit = document.getElementById("jourNuit");
const body = document.querySelector("body");

jourNuit.addEventListener("click", () => {
  body.classList.toggle("darkMode");
});

// ----------  START & STOP VIDEO  -----------
// ----------  VIDEO  -----------
const resultsContainer = document.querySelector("#result");
const btnCamera = document.querySelector("#camera");
const containerVideo = document.querySelector("#videoContainer");
const dashboard = document.querySelector("#dashboard");
// const btnStop = document.querySelector("#stop");
const btnScreenshot = document.querySelector("#screenshot");
const video = document.querySelector("#emitter-video");
let stream; // Déclare une variable pour stocker le flux

/**
 * Fonction qui fait la capture d'écran et injecte l'image dans "resultsContainer".
 */
const screenShot = () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth; // Définir la largeur du canvas à la largeur de la vidéo
  canvas.height = video.videoHeight; // Définir la hauteur du canvas à la hauteur de la vidéo
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  resultsContainer.appendChild(canvas);
};

/**
 * Fonction pour arrêter la caméra.
 */
const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop()); // Arrêter toutes les pistes du flux
    video.srcObject = null; // Effacer la source de la vidéo
    // enlever les resultats
    resultsContainer.classList.add("d-none");
  }
};

/**
 * Ecouteur d'évènement sur le bouton "Démarer la caméra".
 */
btnCamera.addEventListener("click", () => {
  if (btnCamera.classList.contains("startCamera")) {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((mediaStream) => {
        stream = mediaStream;
        if ("srcObject" in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream);
        }
        video.play();

        // Changement sur le boutton
        btnCamera.classList.remove("startCamera");
        btnCamera.innerText = "Stop Camera";

        // Affichage des boutons d'action
        dashboard.classList.toggle("d-none");

        //
        resultsContainer.classList.remove("d-none");
      })
      .catch(() => {
        alert("ERROR: camera or video not available");
      });
  } else {
    stopCamera();
    // Changement sur le boutton
    btnCamera.classList.add("startCamera");
    btnCamera.innerText = "Start Camera";

    // Affichage des boutons d'action
    dashboard.classList.toggle("d-none");
  }
});

/**
 * Ecouteur d'évènment sur la capture d'écran
 */
btnScreenshot.addEventListener("click", () => {
  screenShot();
});

//  ---------  SCAN  ---------
const canvas = document.querySelector("#canvas");
const btnScan = document.querySelector("#start_scan");
const blockPrediction = document.querySelector("#predictions");
const writePredClass = document.querySelector("#predictionClass");
const writePredScore = document.querySelector("#predictionScore");
const context = canvas.getContext("2d");

let model;
await cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
});

btnScan.addEventListener("click", async (e) => {
  btnScan.classList.add("actived");
  video.classList.add("d-none");
  canvas.classList.remove("d-none");
  blockPrediction.classList.remove("d-none");

  const scan = async () => {
    const predictions = await model.detect(video);
    console.log(predictions);
    // Afficher les résultats
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Dessine les prédictions
    predictions.forEach((prediction) => {
      let predictionClass = prediction.class;
      let predictionScore = Math.round(prediction.score * 100);
      if (prediction.score > 0.6) {
        writePredClass.innerText = predictionClass;
        writePredScore.innerText = `${predictionScore}%`;

        context.beginPath();
        context.rect(...prediction.bbox);

        // Largeur du tracé
        context.lineWidth = 1;
        // Couleur du contours
        context.strokeStyle = "red";
        // Couleur du texte
        context.fillStyle = "red";
        // On trace le contour
        context.stroke();
        // Et on affiche le texte en haut a gauche du rectangle
        context.fillText(
          `${prediction.class}`,
          prediction.bbox[0],
          prediction.bbox[1]
        );
        console.log(prediction);

      } else {
        writePredClass.innerText = "";
        writePredScore.innerText = "";
      }
    });
    requestAnimationFrame(scan);
  };
  scan();
});
