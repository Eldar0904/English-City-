export type Lesson = {
  id: string;
  number: string;
  title: string;
  kk: string;
  type: string;
  minutes: number;
};

export const lessons: Lesson[] = [
  {
    id: "start",
    number: "01",
    title: "Start here",
    kk: "Бастайық",
    type: "Lead-in",
    minutes: 5,
  },
  {
    id: "words",
    number: "02",
    title: "People & routines",
    kk: "Адамдар мен күн тәртібі",
    type: "Vocabulary",
    minutes: 12,
  },
  {
    id: "grammar",
    number: "03",
    title: "Stories in progress",
    kk: "Өткен шақтағы оқиғалар",
    type: "Grammar",
    minutes: 15,
  },
  {
    id: "read",
    number: "04",
    title: "A new beginning",
    kk: "Жаңа бастама",
    type: "Reading",
    minutes: 15,
  },
  {
    id: "listen",
    number: "05",
    title: "A voice from Almaty",
    kk: "Алматыдан бір дауыс",
    type: "Listening",
    minutes: 12,
  },
  {
    id: "speak",
    number: "06",
    title: "Tell your story",
    kk: "Өз оқиғаңды айт",
    type: "Speaking",
    minutes: 10,
  },
  {
    id: "write",
    number: "07",
    title: "An unforgettable day",
    kk: "Ұмытылмас күн",
    type: "Writing",
    minutes: 20,
  },
  {
    id: "review",
    number: "08",
    title: "Checkpoint",
    kk: "Білімді тексеру",
    type: "Review",
    minutes: 10,
  },
];

export const vocabulary = [
  ["settle in", "жаңа ортаға үйрену"],
  ["get to know", "танысып-білу"],
  ["keep in touch", "байланыста болу"],
  ["take up", "жаңа іспен айналыса бастау"],
  ["turning point", "бетбұрыс"],
  ["out of my comfort zone", "үйреншікті жайлылықтан тыс"],
];

export type Question = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  kk: string;
};

export const grammarQuestions: Question[] = [
  {
    question: "I ___ home when I ___ an old friend.",
    options: [
      "walked / was seeing",
      "was walking / saw",
      "was walking / was seeing",
    ],
    correct: 1,
    explanation:
      "Use past continuous for the background action and past simple for the event.",
    kk: "Ұзақ әрекетке past continuous, оны бөлген оқиғаға past simple қолданылады.",
  },
  {
    question: "While Amina ___ dinner, the lights ___.",
    options: [
      "made / were going out",
      "was making / went out",
      "made / went out",
    ],
    correct: 1,
    explanation:
      "The cooking was already in progress when the lights went out.",
    kk: "Тамақ дайындау жүріп жатқанда жарық өшті.",
  },
  {
    question: "Which sentence gives two actions in sequence?",
    options: [
      "I opened the email and called my sister.",
      "I was opening the email while I called.",
      "I opened the email when I was call.",
    ],
    correct: 0,
    explanation:
      "Use past simple for completed actions that happened one after another.",
    kk: "Бірінен кейін бірі аяқталған әрекеттерге past simple қолданылады.",
  },
  {
    question: "At 8 p.m. yesterday, we ___ for the train.",
    options: ["waited", "were waiting", "was waiting"],
    correct: 1,
    explanation:
      "Past continuous describes an action in progress at a specific past time.",
    kk: "Белгілі бір өткен уақытта жүріп жатқан әрекет past continuous болады.",
  },
];

export const readingQuestions: Question[] = [
  {
    question: "Why did Dana notice the photography poster?",
    options: [
      "She was looking for a new job.",
      "She saw it while waiting for a bus.",
      "Her colleague showed it to her.",
    ],
    correct: 1,
    explanation:
      "The story says she saw the poster while she was waiting for a bus.",
    kk: "Ол автобусты күтіп тұрғанда плакатты көрді.",
  },
  {
    question: "What nearly stopped Dana from joining?",
    options: [
      "She almost walked past the poster.",
      "She did not own a camera.",
      "The walk was in another city.",
    ],
    correct: 0,
    explanation:
      "“Nearly walked past it” shows that she almost ignored the opportunity.",
    kk: "“Nearly walked past it” — ол мүмкіндікті елемей кете жаздады.",
  },
  {
    question: "What does “turning point” mean in this story?",
    options: [
      "A difficult journey home",
      "A small event that changed her direction",
      "The place where the bus turned",
    ],
    correct: 1,
    explanation:
      "The evening changed how Dana used her free time and saw her city.",
    kk: "Бұл кеш Дананың бос уақытын және қаланы көру тәсілін өзгертті.",
  },
];

export const listeningTranscript = `When I arrived at the design studio in Almaty, everyone seemed busy. I was carrying my laptop and trying to remember five new names when I dropped my notebook. Papers went everywhere. I felt so embarrassed. Then a colleague called Asem helped me pick them up and invited me to lunch. While we were eating, she explained how the team worked and asked about my ideas. By the afternoon, I was still nervous, but I didn't feel alone. On my way home, I realised that asking for help wasn't a weakness. It was how I started to become part of the team.`;

export const listeningQuestions: Question[] = [
  {
    question: "How did Timur feel by the end of the day?",
    options: ["More confident", "Still disappointed", "Ready to leave the job"],
    correct: 0,
    explanation: "He was still nervous, but he no longer felt alone.",
    kk: "Ол әлі қобалжыды, бірақ өзін жалғыз сезінбеді.",
  },
  {
    question: "What happened when Timur arrived?",
    options: [
      "He forgot his laptop.",
      "He dropped his notebook.",
      "He missed a meeting.",
    ],
    correct: 1,
    explanation: "His papers went everywhere when he dropped the notebook.",
    kk: "Дәптерін түсіріп алып, қағаздары шашылып қалды.",
  },
  {
    question: "What lesson did he learn?",
    options: [
      "Never carry paper.",
      "Lunch is the best time to work.",
      "Asking for help can build connection.",
    ],
    correct: 2,
    explanation: "A small moment of help made him feel part of the team.",
    kk: "Көмек сұрау оны командаға жақындатты.",
  },
];

export const reviewQuestions: Question[] = [
  grammarQuestions[0],
  readingQuestions[2],
  listeningQuestions[2],
];
