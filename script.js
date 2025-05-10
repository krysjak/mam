document.addEventListener('DOMContentLoaded', () => {
  const complimentButton = document.getElementById('compliment-button');
  const complimentText = document.getElementById('compliment-text');
  const backgroundFlowersContainer = document.getElementById('background-flowers-container');
  const mainAnimationContainer = document.querySelector('.animation-container');
  const mothersDayMessage = document.getElementById('mothers-day-message');
  const fallingRosesContainer = document.getElementById('falling-roses-container');
  const langButtons = document.querySelectorAll('.lang-switcher button');

  let rosesInterval = null;
  let chamomileReadyForSpecialClick = false;

  let currentLanguage = localStorage.getItem('language') || 'uk';
  if (currentLanguage === 'ru') {
    currentLanguage = 'uk';
  }

  const translations = {
    en: {
      pageTitle: "For Mom",
      momPhotoAlt: "Mom's Photo",
      instagramAriaLabel: "Instagram",
      linkedinAriaLabel: "LinkedIn",
      complimentButtonText: "Say a compliment!",
      mothersDayMessageText: "Happy Mother's Day!",
      compliment1: "You are the best mom in the world!",
      compliment2: "Your smile makes my day brighter!",
      compliment3: "Thank you for your endless love and support!",
      compliment4: "You are incredibly talented and smart!",
      compliment5: "You are a very strong and inspiring woman!",
      compliment6: "It's always so warm and cozy with you.",
      compliment7: "You are my main role model!",
      compliment8: "Your kindness knows no bounds.",
      compliment9: "You cook the most delicious food in the world!",
      compliment10: "Thank you for being you!"
    },
    uk: {
      pageTitle: "Для Мами",
      momPhotoAlt: "Фото Мами",
      instagramAriaLabel: "Instagram",
      linkedinAriaLabel: "LinkedIn",
      complimentButtonText: "Сказати комплімент!",
      mothersDayMessageText: "З Днем Матері!",
      compliment1: "Ти найкраща мама у світі!",
      compliment2: "Твоя усмішка робить мій день яскравішим!",
      compliment3: "Дякую за твою нескінченну любов і підтримку!",
      compliment4: "Ти неймовірно талановита і розумна!",
      compliment5: "Ти дуже сильна і надихаюча жінка!",
      compliment6: "З тобою завжди так тепло і затишно.",
      compliment7: "Ти мій головний приклад для наслідування!",
      compliment8: "Твоя доброта не знає меж.",
      compliment9: "Ти готуєш найсмачніше в світі!",
      compliment10: "Дякую, що ти є!"
    }
  };

  const complimentKeys = [
    "compliment1", "compliment2", "compliment3", "compliment4", "compliment5",
    "compliment6", "compliment7", "compliment8", "compliment9", "compliment10"
  ];

  function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang-key]').forEach(element => {
      const key = element.getAttribute('data-lang-key');
      if (translations[lang] && translations[lang][key]) {
        if (element.hasAttribute('data-alt-lang-key')) {
          element.alt = translations[lang][key];
        } else if (element.hasAttribute('data-aria-label-lang-key')) {
          element.setAttribute('aria-label', translations[lang][key]);
        } else {
          element.textContent = translations[lang][key];
        }
      } else if (lang === 'ru' && translations['uk'] && translations['uk'][key]) {
        if (element.hasAttribute('data-alt-lang-key')) {
          element.alt = translations['uk'][key];
        } else if (element.hasAttribute('data-aria-label-lang-key')) {
          element.setAttribute('aria-label', translations['uk'][key]);
        } else {
          element.textContent = translations['uk'][key];
        }
      }
    });

    langButtons.forEach(button => {
      button.classList.toggle('active', button.getAttribute('data-lang') === lang);
    });

    if (complimentText) complimentText.textContent = '';
  }

  if (complimentButton && complimentText) {
    complimentButton.addEventListener('click', () => {
      const randomKeyIndex = Math.floor(Math.random() * complimentKeys.length);
      const complimentKey = complimentKeys[randomKeyIndex];
      if (translations[currentLanguage] && translations[currentLanguage][complimentKey]) {
        complimentText.textContent = translations[currentLanguage][complimentKey];
      }
    });
  }

  langButtons.forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  setLanguage(currentLanguage);

  let sceneLastTimestamp = 0;
  const allBackgroundFlowers = [];
  const MAX_BACKGROUND_FLOWERS = 18;
  const FLOWER_LIFETIME_MIN = 12000;
  const FLOWER_LIFETIME_MAX = 28000;
  const FLOWER_ADD_COOLDOWN = 1200;
  let lastFlowerAddTime = 0;
  const INITIAL_FLOWER_SPAWN_DELAY = 3500;

  // Константы для укладки роз
  const NUM_ROSE_COLUMNS = 18; // Количество колонок для роз
  const ROSE_STACK_HEIGHT = 8;   // Эффективная высота, которую занимает роза в стопке (для перекрытия)
  const floorRoseLevels = new Array(NUM_ROSE_COLUMNS).fill(0); // Уровни заполнения для каждой колонки
  const ROSE_PETAL_CSS_WIDTH = 25; // Ширина розы из CSS
  const ROSE_PETAL_CSS_HEIGHT = 35; // Высота розы из CSS

  function addSingleBackgroundFlower(timestamp) {
    if (!backgroundFlowersContainer) return;

    const flowerElement = document.createElement('div');
    const flowerColors = ['color1', 'color2', 'color3', ''];
    const flowerTypes = ['', 'flower-tulip', 'flower-rosebud'];

    const randomColorClass = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    const randomTypeClass = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];

    flowerElement.className = `background-flower ${randomTypeClass} ${randomColorClass}`;

    const initialLeft = Math.random() * 100;
    const initialTop = Math.random() * 100;
    flowerElement.style.left = `${initialLeft}vw`;
    flowerElement.style.top = `${initialTop}vh`;

    const center = document.createElement('div');
    center.className = 'center';
    flowerElement.appendChild(center);

    let numPetals = 8;
    if (randomTypeClass === 'flower-tulip') numPetals = 5;
    if (randomTypeClass === 'flower-rosebud') numPetals = 6;

    for (let j = 0; j < numPetals; j++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      let petalTransform = `rotate(${j * (360 / numPetals)}deg)`;
      if (randomTypeClass === 'flower-tulip') {
        petal.style.transformOrigin = '50% 100%';
        petalTransform = `rotate(${j * (360 / numPetals) + (Math.random() * 10 - 5)}deg) translateY(-5px)`;
      } else if (randomTypeClass === 'flower-rosebud') {
        petalTransform = `rotate(${j * (360 / numPetals) + (Math.random() * 20 - 10)}deg) translateZ(${j * 0.5}px) translateY(${Math.random() * 3}px)`;
      }
      petal.style.transform = petalTransform;
      flowerElement.appendChild(petal);
    }

    backgroundFlowersContainer.appendChild(flowerElement);

    allBackgroundFlowers.push({
      element: flowerElement,
      baseLeftVW: initialLeft,
      baseTopVH: initialTop,
      angleX: Math.random() * Math.PI * 2,
      angleY: Math.random() * Math.PI * 2,
      angleRot: Math.random() * Math.PI * 2,
      speedX: (Math.random() * 0.0003 + 0.00015),
      speedY: (Math.random() * 0.0003 + 0.00015),
      speedRot: (Math.random() - 0.5) * 0.0005,
      amplitudeX: Math.random() * 15 + 10,
      amplitudeY: Math.random() * 15 + 10,
      amplitudeRot: Math.random() * 10 + 5,
      createdAt: timestamp,
      lifetime: Math.random() * (FLOWER_LIFETIME_MAX - FLOWER_LIFETIME_MIN) + FLOWER_LIFETIME_MIN,
      isFading: false
    });
  }

  function manageBackgroundFlowers(timestamp, deltaTime) {
    if (timestamp > INITIAL_FLOWER_SPAWN_DELAY &&
      allBackgroundFlowers.length < MAX_BACKGROUND_FLOWERS &&
      (timestamp - lastFlowerAddTime > FLOWER_ADD_COOLDOWN)) {
      addSingleBackgroundFlower(timestamp);
      lastFlowerAddTime = timestamp;
    }

    for (let i = allBackgroundFlowers.length - 1; i >= 0; i--) {
      const flowerData = allBackgroundFlowers[i];
      const { element, createdAt, lifetime } = flowerData;

      if (deltaTime > 0) {
        flowerData.angleX += flowerData.speedX * deltaTime;
        flowerData.angleY += flowerData.speedY * deltaTime;
        flowerData.angleRot += flowerData.speedRot * deltaTime;

        const offsetX = Math.sin(flowerData.angleX) * flowerData.amplitudeX;
        const offsetY = Math.cos(flowerData.angleY) * flowerData.amplitudeY;
        const offsetRot = Math.sin(flowerData.angleRot) * flowerData.amplitudeRot;
        element.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetRot}deg)`;
      }

      if (!flowerData.isFading && (timestamp - createdAt) > lifetime) {
        flowerData.isFading = true;
        element.style.transition = 'opacity 1.5s ease-out, left 1.5s ease-out, top 1.5s ease-out';
        element.style.opacity = '0';
        flowerData.removeAt = timestamp + 1500;
      }

      if (flowerData.isFading && timestamp >= flowerData.removeAt) {
        element.remove();
        allBackgroundFlowers.splice(i, 1);
      }
    }
  }

  document.body.addEventListener('click', (event) => {
    if (event.target.closest('button, a, .animation-container.in-corner, .lang-switcher')) {
      return;
    }

    const clickX_vw = (event.clientX / window.innerWidth) * 100;
    const clickY_vh = (event.clientY / window.innerHeight) * 100;

    allBackgroundFlowers.forEach(flowerData => {
      flowerData.element.style.left = `${clickX_vw + (Math.random() * 20 - 10)}vw`;
      flowerData.element.style.top = `${clickY_vh + (Math.random() * 20 - 10)}vh`;
    });
  });

  if (mainAnimationContainer) {
    mainAnimationContainer.addEventListener('animationend', (event) => {
      if (event.animationName === 'container-move-to-bg') {
        mainAnimationContainer.classList.add('in-corner');
        chamomileReadyForSpecialClick = true;
      }
    });

    mainAnimationContainer.addEventListener('click', () => {
      if (chamomileReadyForSpecialClick && mothersDayMessage && fallingRosesContainer) {
        mothersDayMessage.classList.add('visible');

        if (!rosesInterval) {
          rosesInterval = setInterval(createFallingRose, 150); // Можно немного ускорить появление роз
        }
      }
    });
  }

  function createFallingRose() {
    if (!fallingRosesContainer) return;

    const rose = document.createElement('div');
    rose.classList.add('rose-petal');

    const roseColors = ['pink', 'dark-red', ''];
    const randomColorClass = roseColors[Math.floor(Math.random() * roseColors.length)];
    if (randomColorClass) {
      rose.classList.add(randomColorClass);
    }

    // Начальная горизонтальная позиция в vw, чтобы распределить по ширине экрана
    rose.style.left = `${Math.random() * 95 + 2.5}vw`; // от 2.5vw до 97.5vw

    const randomDuration = Math.random() * 2.5 + 3; // от 3 до 5.5 секунд на падение
    rose.style.animationDuration = `${randomDuration}s`;
    rose.style.animationDelay = `${Math.random() * 0.3}s`;

    fallingRosesContainer.appendChild(rose);

    rose.addEventListener('animationend', function handleRoseLanding() {
      // 'this' ссылается на элемент 'rose'
      this.style.animationPlayState = 'paused'; // Останавливаем анимацию в конечном положении
      this.style.animation = 'none'; // Убираем саму анимацию, чтобы transform не мешал

      // Получаем текущую горизонтальную позицию (которая была задана в vw)
      const currentLeftVW = parseFloat(this.style.left);
      const currentLeftPX = (currentLeftVW / 100) * window.innerWidth;

      // Определяем колонку
      const columnWidthPX = window.innerWidth / NUM_ROSE_COLUMNS;
      let columnIndex = Math.floor(currentLeftPX / columnWidthPX);
      columnIndex = Math.max(0, Math.min(NUM_ROSE_COLUMNS - 1, columnIndex)); // Ограничиваем индекс колонки

      // Рассчитываем новую позицию 'bottom' для укладки
      const newBottomPX = floorRoseLevels[columnIndex] * ROSE_STACK_HEIGHT;

      // Рассчитываем новую позицию 'left' для размещения в колонке с небольшим случайным смещением
      const columnCenterX = (columnIndex * columnWidthPX) + (columnWidthPX / 2);
      const jitterPX = (Math.random() - 0.5) * (columnWidthPX * 0.5); // Случайное смещение в пределах 50% ширины колонки
      const newLeftPX = columnCenterX + jitterPX - (ROSE_PETAL_CSS_WIDTH / 2); // Центрируем розу в точке

      this.style.position = 'absolute'; // Убедимся, что позиционирование абсолютное
      this.style.bottom = `${newBottomPX}px`;
      this.style.left = `${newLeftPX}px`;
      this.style.top = 'auto'; // Сбрасываем 'top', если он был
      // Применяем финальный transform (случайный небольшой поворот)
      this.style.transform = `rotate(${(Math.random() - 0.5) * 20}deg)`;
      this.style.zIndex = floorRoseLevels[columnIndex]; // Розы выше будут перекрывать те, что ниже

      floorRoseLevels[columnIndex]++;

      // Опционально: если какая-то колонка слишком высока, можно перестать добавлять в нее
      // if (floorRoseLevels[columnIndex] * ROSE_STACK_HEIGHT > window.innerHeight * 0.8) {
      //    console.log(`Column ${columnIndex} is full.`);
      // }

    }, { once: true }); // Обработчик сработает только один раз
  }

  function animateScene(timestamp) {
    if (!sceneLastTimestamp) sceneLastTimestamp = timestamp;
    const deltaTime = timestamp - sceneLastTimestamp;

    if (deltaTime > 0) {
      manageBackgroundFlowers(timestamp, deltaTime);
    }

    sceneLastTimestamp = timestamp;
    requestAnimationFrame(animateScene);
  }

  requestAnimationFrame(animateScene);
});
