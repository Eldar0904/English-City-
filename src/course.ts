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
  ["sign up", "тіркелу"],
  ["give something a try", "бір нәрсені байқап көру"],
  ["turning point", "бетбұрыс"],
  ["step outside your comfort zone", "үйреншікті ортадан шығу"],
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
    question: "What is Matt’s main message?",
    options: [
      "Change your whole life in one day.",
      "Try one meaningful change consistently for 30 days.",
      "Avoid difficult challenges.",
    ],
    correct: 1,
    explanation:
      "He argues that 30 days is long enough to experiment with a new habit and notice change.",
    kk: "Оның ойынша, жаңа әдетті байқап көруге және өзгерісті сезуге 30 күн жеткілікті.",
  },
  {
    question: "Which daily challenge made the month more memorable?",
    options: [
      "Taking one photograph",
      "Cycling up a mountain",
      "Giving up all technology",
    ],
    correct: 0,
    explanation:
      "He took a picture every day and could remember where he was and what he was doing.",
    kk: "Ол күн сайын суретке түсіріп, сол күндері қайда және не істеп жүргенін есте сақтады.",
  },
  {
    question: "What happened as his challenges became harder?",
    options: [
      "He became less interested.",
      "His self-confidence grew.",
      "He stopped after one month.",
    ],
    correct: 1,
    explanation:
      "Harder challenges helped him become more confident and adventurous.",
    kk: "Күрделірек сынақтар оның сенімін арттырып, батылырақ болуына көмектесті.",
  },
  {
    question: "Which changes were more likely to ‘stick’ ?",
    options: [
      "Small sustainable changes",
      "Big crazy challenges",
      "Changes suggested by other people",
    ],
    correct: 0,
    explanation:
      "Realistic changes he could continue were more likely to become lasting habits.",
    kk: "Жалғастыруға болатын шағын, тұрақты өзгерістер әдетке айналуы ықтимал болды.",
  },
];

export const reviewQuestions: Question[] = [
  grammarQuestions[0],
  readingQuestions[2],
  listeningQuestions[2],
];
