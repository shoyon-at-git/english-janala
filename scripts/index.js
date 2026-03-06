// console.log("index.html loaded");
const createSpans = (arr) =>{
    const htmlEl = arr.map(el => `<span class="btn">${el}</span>`);
    return htmlEl.join(" ");
};

const manageSpinner = (status) =>{
    if(status){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else{
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadLessons = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((info) => displayLessons(info.data));
};

const removeActive = () =>{
    const inactiveBtns = document.querySelectorAll(".lesson-btn")
    // console.log(inactiveBtns);
    inactiveBtns.forEach(btn => {
        btn.classList.remove("active");
    })
}

const displayLessons = (lessons) => {
  // console.log(lessons);
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-brands fa-leanpub"></i> Lesson -${lesson.level_no}</button>
        `;
    levelContainer.appendChild(btnDiv);
  }
};

const loadLevelWord = (id) => {
  // console.log(id);
  manageSpinner(true)
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  // console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((lvl) => {
        removeActive();
        const clickedBtn = document.getElementById(`lesson-btn-${id}`)
        // console.log(clickedBtn);
        clickedBtn.classList.add("active");
        displayLevelWord(lvl.data);
    });
};

const displayLevelWord = (words) => {
//   console.log(words);
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    // alert("no word!!");
    wordContainer.innerHTML = `
        <div class="text-center bg-sky-100 col-span-full rounded-xl py-10 space-y-6">
            <img class="mx-auto" src="assets/alert-error.png" alt="">
            <h2 class="font-bn text-xl font-medium text-gray-400">এই lesson এখনও কোনো vocabulary যুক্ত করা হয় নি</h2>
            <p class="font-bn font-bold text-4xl">অন্য
             একটি <span>Lesson select</span> করুন</p>
        </div>
        `;
        manageSpinner(false);

  }

  words.forEach((word) => {
    // console.log(word.pronunciation);
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-5">
            <h2 class="font-bold text-2xl">${word.word ? word.word : '<span class="text-red-500">শব্দ পাওয়া যায় নি</span>'}</h2>
            <p class="font-semibold">Meaning / Pronunciation</p>
            <div class="font-bn text-2xl font-medium">
                "${word.meaning ? word.meaning : `<span class="text-red-500">অর্থ পাওয়া যায় নি</span>`} / ${word.pronunciation ? word.pronunciation : '<span class="text-red-500">উচ্চারণ পাওয়া যায় নি</span>'}"
            </div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetails(${word.id})" class="btn bg-slate-100 hover:bg-slate-200"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-slate-100 hover:bg-slate-200"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
    `;
    wordContainer.append(card);
  });
    manageSpinner(false);

};

const loadWordDetails = async(id) =>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    // console.log(url);
    const res = await fetch(url);
    const json = await res.json();
    displayWordDetails(json.data);
};

const displayWordDetails = (details) =>{
    console.log(details);
    const detailBox = document.getElementById("details-container");
    // console.log(detailBox);
    detailBox.innerHTML = `
    <div>
            <h2 class="text-2xl font-bold">${details.word} (<i class="fa-solid fa-microphone-lines"></i>:${details.pronunciation})</h2>
        </div>
        <div>
            <h2 class="font-bold">Meaning</h2>
            <p class ="font-bn">${details.meaning}</p>
        </div>
        <div>
            <h2 class="font-bold">Example</h2>
            <p>${details.sentence}</p>
        </div>
        <div class="space-y-2">
            <h2 class="font-bold">Synonym</h2>
            <div>
                ${createSpans(details.synonyms)}
            </div>
        </div>
     `;
    document.getElementById("word_modal").showModal();
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () =>{
    removeActive();
    const input = document.getElementById("input-search");
    const inputValue = input.value.trim().toLowerCase();
    console.log(inputValue);
    const url = "https://openapi.programming-hero.com/api/words/all";
    fetch(url)
        .then(res => res.json())
        .then(data => {
            // console.log(data.data);
            const allWords = data.data;
            // console.log(allWords);
            const filteredWords = allWords.filter(word=> word.word.toLowerCase().includes(inputValue));
            displayLevelWord(filteredWords);
        });
});