let peer;
let myStream;

// Fonction pour ajouter une vidéo à l'écran
function ajoutVideo(stream) {
    try {
        const video = document.createElement('video');
        document.getElementById('participants').appendChild(video);
        video.autoplay = true;
        video.controls = true;
        video.srcObject = stream;
    } catch (error) {
        console.error("Erreur lors de l'ajout de la vidéo :", error);
    }
}

// Fonction pour enregistrer un utilisateur
function register() {
    const name = document.getElementById('name').value;
    try {
        peer = new Peer(name);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                myStream = stream;
                ajoutVideo(stream);

                // Masquer le formulaire d'enregistrement et afficher les autres options
                document.getElementById('register').style.display = 'none';
                document.getElementById('userAdd').style.display = 'block';
                document.getElementById('userShare').style.display = 'block';

                peer.on('call', (call) => {
                    call.answer(myStream);
                    call.on('stream', (remoteStream) => {
                        ajoutVideo(remoteStream);
                    });
                });
            })
            .catch((err) => {
                console.error("Échec de l'accès au flux local :", err);
            });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
    }
}

// Fonction pour appeler un utilisateur
function appelUser() {
    try {
        const name = document.getElementById('add').value;
        document.getElementById('add').value = "";
        const call = peer.call(name, myStream);
        call.on('stream', (remoteStream) => {
            ajoutVideo(remoteStream);
        });
    } catch (error) {
        console.error("Erreur lors de l'appel :", error);
    }
}

// Fonction pour partager son écran
function addScreenShare() {
    const name = document.getElementById('share').value;
    document.getElementById('share').value = "";
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then((stream) => {
            const call = peer.call(name, stream);
        })
        .catch((err) => {
            console.error("Erreur lors du partage d'écran :", err);
        });
}
