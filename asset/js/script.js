// ----------  MODE JOUR/NUIT  -----------
const jourNuit = document.getElementById("jourNuit");
const body = document.querySelector("body");

jourNuit.addEventListener("click", () => {
  console.log("entrée");
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
const emitterVideo = document.querySelector("#emitter-video");
let stream; // Déclare une variable pour stocker le flux

/**
 * Fonction qui fait la capture d'écran et injecte l'image dans "resultsContainer".
 */
const snapshot = () => {
  const canvas = document.createElement("canvas");
  canvas.width = emitterVideo.videoWidth; // Définir la largeur du canvas à la largeur de la vidéo
  canvas.height = emitterVideo.videoHeight; // Définir la hauteur du canvas à la hauteur de la vidéo
  const context = canvas.getContext("2d");
  context.drawImage(emitterVideo, 0, 0, canvas.width, canvas.height);

  resultsContainer.appendChild(canvas);
};

/**
 * Fonction pour arrêter la caméra.
 */
const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop()); // Arrêter toutes les pistes du flux
    emitterVideo.srcObject = null; // Effacer la source de la vidéo
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
        if ("srcObject" in emitterVideo) {
          emitterVideo.srcObject = stream;
        } else {
          emitterVideo.src = window.URL.createObjectURL(stream);
        }
        emitterVideo.play();

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
  snapshot();
});


let model;

cocoSsd.load().then(loadedModel =>
{
  model = loadedModel;
});
