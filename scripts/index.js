// console.log("index.html loaded");

const loadLessons = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((info) => displayLessons(info.data));
};

const displayLessons = (lessons) => {
  // console.log(lessons);
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary"><i class="fa-brands fa-leanpub"></i> Lesson -${lesson.level_no}</button>
        `;
    levelContainer.appendChild(btnDiv);
  }
};

const loadLevelWord = (id) => {
  // console.log(id);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  // console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((lvl) => displayLevelWord(lvl.data));
};

const displayLevelWord = (words) => {
  console.log(words);
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
                <button class="btn bg-slate-100 hover:bg-slate-200"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-slate-100 hover:bg-slate-200"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
    `;
    wordContainer.append(card);
  });
};

loadLessons();
