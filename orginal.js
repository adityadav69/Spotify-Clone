let currentsong = new Audio();
let songs;
let currfolder;
function convertSecondsToMinuteSecond(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let respose = await a.text();
  let div = document.createElement("div");
  div.innerHTML = respose;
  let an = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < an.length; index++) {
    const element = an[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1].split(".mp3")[0]);
    }
  }

  //Show all the songs in the playlist
  let songul = document.querySelector(".songsList") .getElementsByTagName("ul")[0];
  songul.innerHTML="";

  for (const song of songs) {
    songul.innerHTML =
      songul.innerHTML +
      ` <li> 
     <div class="music-name">
     <img class="small invert" src="./music.svg" alt="music">
       <div class="songName"> ${song.replaceAll("%20", " ")} </div>
       </div>
       <img class="playw " src="./oplay.svg" alt=""></div>
     </li> `;
  }

  //Attach an event listner to each song;
  Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      let track = e.querySelector(".songName").innerHTML.trim();
      console.log(e.querySelector(".songName").innerHTML);
      playMusic(track);
    });
  });
}
const playMusic = (Track, pause = false) => {
  let otrack = `/${currfolder}/` + Track + ".mp3";
  currentsong.src = otrack;
  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songInfo").innerHTML =
    Track.replaceAll("%", " ").replaceAll("20", "") + ".mp3";
};

async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
let respose = await a.text();
let div = document.createElement("div");
div.innerHTML = respose;



let an = div.getElementsByTagName("a");
console.log(an);
an=Array.from(an).slice(3);
let namesss=[];
for(let i=0;i<an.length;i++){
  namesss.push(an[i].href.split("/songs/")[1])
  console.log(an[i].href.split("/songs/")[1]);
}
console.log(an);
console.log(namesss);
  // for (let index = 0; index < an.length; index++) {
  //   const element = an[index];
  //   console.log(element.href.split("/").split(".mp3"))
  //   // if (element.href.endsWith(".mp3")) {
  //   //   names.push(element.href.split(`/${folder}/`)[1].split(".mp3")[0]);
  //   // }
  // }
  // console.log(names);




// console.log(div);
// let lis = div.getElementsByTagName("li");
// console.log(lis);
// lis = Array.from(lis);
// lis.splice(0, 1);
// let anchors=lis.getElementsByTagName(a);
// console.log(anchors);


  
  // Array.from(anchors).forEach(async e=>{
  //   if(e.href.includes("/songs")){
  //     let folder=(e.href.split("/").slice(-1)[0]);
  //     console.log(folder);
  //   }
  // })
}

async function main() {
  await getsongs("songs/ncs");
  playMusic(songs[0], true);


  //Display all the song on the page
  displayAlbums();

  //Attach an event to playbutton
  let play = document.querySelector("#play");
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play2.svg";
    }
  });

  //listen for time update
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(
      ".songTime"
    ).innerHTML = `${convertSecondsToMinuteSecond(
      currentsong.currentTime
    )}/${convertSecondsToMinuteSecond(currentsong.duration)}`;
    document.querySelector(".seekcircle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  //Add an event listner to seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".seekcircle").style.left =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  //Add an event listner for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  //Add an event listner for close;
  document.querySelector(".close").addEventListener("click", () => {
    console.log("clicked");
    document.querySelector(".left").style.left = "-100%";
  });

  //Add an event listner to previous
  let prev = document.querySelector("#prev");

  prev.addEventListener("click", () => {
    console.log("previos button is clicked");
    let index = songs.indexOf(currentsong.src.split("/")[4].split(".mp3")[0]);

    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //Add an event listner to next
  let next = document.querySelector("#next");
  next.addEventListener("click", () => {
    console.log("next is clicked");
    let index = songs.indexOf(currentsong.src.split("/")[4].split(".mp3")[0]);
    console.log(index);

    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //Add an event listner on Volume button
  document.querySelector(".input").addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value);
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  //Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card-items")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}
main();

let cardItems = document.querySelectorAll(".card-items");

cardItems.forEach((item) => {
  let svg = item.querySelector(".svg");

  item.addEventListener("mouseenter", () => {
    svg.style.animation = "none";
    void svg.offsetWidth; // Trigger reflow
    svg.style.animation = "rotatingball 0.4s ease forwards";
    svg.style.opacity = "1";
    svg.style.cursor = "pointer";
    svg.style.backgroundColor = "#1ed760";
  });

  item.addEventListener("mouseleave", () => {
    svg.style.opacity = "0";
  });
});
