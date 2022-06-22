const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressBar = wrapper.querySelector(".progress-bar"),
  progressArea = wrapper.querySelector(".progress-area"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreMusicBtn = wrapper.querySelector("#more-music"),
  hideMoreMusicBtn = wrapper.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow()
});
// load music

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `assets/imgs/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `assets/music/${allMusic[indexNumb - 1].src}.mp3`;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : musicIndex;
  loadMusic(musicIndex);
  playMusic();
}
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}
playPauseBtn.addEventListener("click", () => {
  const isMusicPause = wrapper.classList.contains("paused");
  isMusicPause ? pauseMusic() : playMusic();
});

nextBtn.addEventListener("click", () => {
  nextMusic();
});

prevBtn.addEventListener("click", () => {
  prevMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  mainAudio.addEventListener("loadeddata", () => {
    let musicDuration = wrapper.querySelector(".duration");

    // Update Total Duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  // Update Current time
  let musicCurrentTime = wrapper.querySelector(".current");
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;
  playMusic();
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song Looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "playback shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "playlist looped");
      break;

    default:
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;

  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      break;

    default:
      break;
  }
});

showMoreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
hideMoreMusicBtn.addEventListener("click", () => {
  showMoreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
  let liTag = `
        <li li-index="${i + 1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}"  src="assets/music/${allMusic[i].src}.mp3"></audio>
            <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
        </li>
   `;
   ulTag.insertAdjacentHTML("beforeend" , liTag)

   let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`)
   let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`)

   liAudioTag.addEventListener('loadeddata' , ()=> {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    if (totalMin < 10) {
        totalMin = `0${totalMin}`;
      }
    liAudioDuration.innerText = `${totalMin}:${totalSec}`;
   })
}

const allLitags = ulTag.querySelectorAll('li')
function playingNow() {
  for (let j = 0; j < allLitags.length; j++) {
    let audioTag = allLitags[j].querySelector('.audio-duration')
    if(allLitags[j].classList.contains("playing") ){
      allLitags[j].classList.remove('playing')
  }

    if(allLitags[j].getAttribute("li-index") == musicIndex) {
        allLitags[j].classList.add('playing')
        audioTag.innerText = 'Playing'
    }

    allLitags[j].setAttribute('onclick' , "clicked(this)")
    
}
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index")
  musicIndex = getLiIndex;
  loadMusic(musicIndex)
  playMusic()
  playingNow()
}