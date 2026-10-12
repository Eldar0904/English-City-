export type Lesson = { id: string; number: string; title: string; kk: string; type: string; minutes: number }

export const lessons: Lesson[] = [
  { id: 'start', number: '01', title: 'Start here', kk: 'Бастайық', type: 'Lead-in', minutes: 5 },
  { id: 'words', number: '02', title: 'People & routines', kk: 'Адамдар мен күн тәртібі', type: 'Vocabulary', minutes: 12 },
  { id: 'grammar', number: '03', title: 'Stories in progress', kk: 'Өткен шақтағы оқиғалар', type: 'Grammar', minutes: 15 },
  { id: 'read', number: '04', title: 'A new beginning', kk: 'Жаңа бастама', type: 'Reading', minutes: 15 },
  { id: 'listen', number: '05', title: 'A voice from Almaty', kk: 'Алматыдан бір дауыс', type: 'Listening', minutes: 12 },
  { id: 'speak', number: '06', title: 'Tell your story', kk: 'Өз оқиғаңды айт', type: 'Speaking', minutes: 10 },
  { id: 'write', number: '07', title: 'An unforgettable day', kk: 'Ұмытылмас күн', type: 'Writing', minutes: 20 },
  { id: 'review', number: '08', title: 'Checkpoint', kk: 'Білімді тексеру', type: 'Review', minutes: 10 },
]

export const vocabulary = [
  ['settle in', 'жаңа ортаға үйрену'], ['get to know', 'танысып-білу'], ['keep in touch', 'байланыста болу'],
  ['take up', 'жаңа іспен айналыса бастау'], ['turning point', 'бетбұрыс'], ['out of my comfort zone', 'үйреншікті жайлылықтан тыс'],
]
