let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // PLAY THE FIRST SONG
    // SHOW ALL THE SONGS IN THE PLAYLIST
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img class="invert" src="images/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
         </div>
         <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="images/play.svg" alt="">
          </div></li>`;
    }
    // ATTACH AN EVENT LISTENER TO EACH SONG
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener('click', () => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + encodeURIComponent(track)
    if (!pause) {
        currentSong.play()
        play.src = "images/pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00.00/00.00"


}
async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            // GET THE METADATA OF THE FOLDER
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="44" height="44">
                                <circle cx="14" cy="14" r="14" fill="white" />
                                <path d="M17.5 14L10 18.5V9.5L17.5 14Z" fill="black" />
                            </svg>

                        </div>
                        <img src="songs/${encodeURIComponent(folder)}/cover.jpg" alt="" >
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    // LOAD THE PLAYLIST WHEN THE CARD IS CLICKED
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}
document.addEventListener("DOMContentLoaded", function () {
    const loginModal = document.getElementById("loginModal");
    const loginButton = document.querySelector(".loginbtn");
    const signInButton = document.querySelector(".signupbtn");
    const closeButton = document.querySelector(".close-btn");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // Show modal on login button click
    loginButton.addEventListener("click", function () {
        resetForms(); // Reset forms before showing modal
        loginModal.style.display = "flex";
        document.getElementById('loginForm').style.display = 'block';  // Show login form
        document.getElementById('signupForm').style.display = 'none';  // Hide signup form
    });

    // Show modal on sign-in button click
    signInButton.addEventListener("click", function () {
        resetForms(); // Reset forms before showing modal
        loginModal.style.display = "flex";
        document.getElementById('loginForm').style.display = 'none';  // Hide login form
        document.getElementById('signupForm').style.display = 'block';  // Show signup form
    });

    // Hide modal on close button click and reset forms
    closeButton.addEventListener("click", closeModal);

    // Hide modal and reset forms when clicking outside of modal content
    window.addEventListener("click", function (event) {
        if (event.target === loginModal) {
            closeModal();
        }
    });

    // Clear forms and hide modal when user submits login or signup form
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission for demonstration
        closeModal(); // Reset and close modal after login
    });

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission for demonstration
        closeModal(); // Reset and close modal after signup
    });

    // Function to reset both forms and hide modal
    function closeModal() {
        loginForm.reset();
        signupForm.reset();
        loginModal.style.display = "none";
    }
    function resetForms() {
        loginForm.reset();
        signupForm.reset();
    }
});



function toggleForms(form) {
    if (form === 'signup') {
        // Hide the login form and show the signup form
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
    } else {
        // Hide the signup form and show the login form
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    }
}



async function main() {

    // GET THE LIST OF THE SONGS
    await getSongs("songs")
    // playMusic(songs[0],true);
    
    // DISPLAY ALBUM
    displayAlbums();

    // ATTACH AN EVENT LISTENER TO PLAY,NEXT AND PREVIOUS
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "images/play.svg"
        }
    })
    // LISTEN FOR TIME UPDATE EVENT
    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    // ADD AN EVENT LISTENER TO SEEKBAR
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100
    })
    // ADD AN EVENT LISTENER FOR HAMBURGER
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    // ADD AN EVENT LISTENER FOR close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // ADD AN EVENT LISTENER TO PREVIOUS AND NEXT
    previous.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]));
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        currentSong.pause()
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]));
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    // ADD AN EVENT TO VOLUME
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume>0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("images/mute.svg", "images/volume.svg")
        }
    })
    // ADD EVENT LISTENER TO MUTE THE VOLUME
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("images/volume.svg")) {
            e.target.src = e.target.src.replace("images/volume.svg", "images/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("images/mute.svg", "images/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
    
}

main()
