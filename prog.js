// Получение случайной ноты из заданной тональной шкалы
function getRandomNoteFromScale(scale) {
  const randomIndex = Math.floor(Math.random() * scale.length);
  return scale[randomIndex];
}

// Получение тональной шкалы на основе заданной тональности
function getScale(key) {
  const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
  const tonicNote = noteToMidi(key);

  const scale = majorScaleIntervals.map(interval => {
    const note = (tonicNote + interval) % 12;
    return midiToNote(note);
  });

  return scale;
}

// Вычисление пригодности (оценки) композиции
function calculateFitness(composition) {
  const musicalCharacteristics = {
    harmony: calculateHarmonyFitness(composition), // Оценка гармонии
    melody: calculateMelodyFitness(composition),   // Оценка мелодии
    rhythm: calculateRhythmFitness(composition),   // Оценка ритма и темпа
    // Другие характеристики, которые вы хотите учесть
  };

  let fitness = 0;

  for (const characteristic in musicalCharacteristics) {
    fitness += musicalCharacteristics[characteristic];
  }

  return fitness;
}

// Функция скрещивания двух родительских композиций
function crossover(parentA, parentB) {
  const crossoverPoint = Math.floor(Math.random() * parentA.length);

  const child = [...parentA.slice(0, crossoverPoint), ...parentB.slice(crossoverPoint)];

  return child;
}

// Функция мутации композиции
function mutate(composition, mutationRate) {
  for (let i = 0; i < composition.length; i++) {
    if (Math.random() < mutationRate) {
      composition[i] = getRandomNoteFromScale(scale); // Заменяем ноту мутацией
    }
  }
}

// Преобразование ноты в MIDI-число
function noteToMidi(note) {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const noteIndex = noteNames.indexOf(note);
  return noteIndex !== -1 ? noteIndex : 0; // Например, C=0, C#=1, ...
}

// Преобразование MIDI-числа в ноту
function midiToNote(midi) {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return noteNames[midi % 12];
}

// Генерация мелодии на основе заданной тональной шкалы и длины
function generateMelody(scale, length) {
  const melody = [];

  for (let i = 0; i < length; i++) {
    const note = getRandomNoteFromScale(scale);
    melody.push(note);
  }

  return melody;
}

// Генерация случайной композиции
function generateRandomComposition() {
  const compositionLength = 16;
  const scale = getScale("C"); // Можно выбрать любую тональность

  return generateMelody(scale, compositionLength);
}

// Создание начальной популяции
function createInitialPopulation(populationSize) {
  const initialPopulation = [];

  for (let i = 0; i < populationSize; i++) {
    const composition = generateRandomComposition();
    initialPopulation.push(composition);
  }

  return initialPopulation;
}

// Оценка пригодности каждого индивида в популяции
function evaluateFitness(population) {
  for (const composition of population) {
    composition.fitness = calculateFitness(composition);
  }
}

// Выбор лучших особей для следующего поколения
function selectParents(population) {
  const sortedPopulation = population.sort((a, b) => b.fitness - a.fitness);
  const selectedParents = sortedPopulation.slice(0, population.length / 2);
  return selectedParents;
}

// Создание новой популяции через скрещивание и мутацию
function createNewPopulation(selectedParents, populationSize, mutationRate) {
  const newPopulation = [];

  while (newPopulation.length < populationSize) {
    const parentA = getRandomElement(selectedParents);
    const parentB = getRandomElement(selectedParents);

    const child = crossover(parentA, parentB);
    mutate(child, mutationRate);

    newPopulation.push(child);
  }

  return newPopulation;
}

// Получение лучшей композиции
function getBestComposition(population) {
  const bestComposition = population.reduce((best, current) => {
    return current.fitness > best.fitness ? current : best;
  });

  return bestComposition;
}

// Функция для выбора случайного элемента из массива
function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Генерация мелодии и вспомогательных данных для помощи в композиции
function assistComposition() {
  const melodyLength = 16;
  const key = "C";
  const scale = getScale(key);
  const melody = generateMelody(scale, melodyLength);

  return {
    melody: melody,
    key: key,
    scale: scale,
  };
}

// Главная функция генерации музыки
function generateMusic() {
  const populationSize = 100;
  const generations = 50;
  const mutationRate = 0.1;

  let population = createInitialPopulation(populationSize);

  for (let generation = 0; generation < generations; generation++) {
    evaluateFitness(population);
    const selectedParents = selectParents(population);
    population = createNewPopulation(selectedParents, populationSize, mutationRate);
  }

  const bestComposition = getBestComposition(population);

  return bestComposition;
}
