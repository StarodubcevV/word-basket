const byId = (id) => document.getElementById(id);
const stalls = [306, 714];
const rowExit = 894;
const allFruits = fruitZones.flatMap((zone) => zone.fruits);
const collected = new Set();
const held = new Set();
const card = byId('card');
const voice = byId('voice');
const look = byId('look');
const hint = byId('hint');
const say = byId('say');
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null;
let selectedFruit = null;
let dialogueStage = 'phrase';
let zoneIndex = 0;
let x = 128;
let face = 1;
let step = 0;
let previousFrame = null;
let announcement = '';
let announcementUntil = 0;
let voiceRequest = 0;

const fruitUse = (fruit) => `<use href="#fruit-${fruit.id}"/>`;
const inRange = () => stalls.findIndex((center) => Math.abs(x - center) <= 106);
const clampX = (value) => Math.max(57, Math.min(963, value));

byId('fruit-art').innerHTML = allFruits.map((fruit) =>
  `<g id="fruit-${fruit.id}" stroke="#4b3644" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round">${fruitArt[fruit.id]}</g>`
).join('');

const zoneLabels = fruitZones.map((zone) => {
  const label = document.createElement('li');
  label.textContent = zone.name;
  byId('zones').append(label);
  return label;
});

function stallMarkup(fruit, index, colors) {
  const [cloth, stripe] = colors;
  const pile = [[-66, 190, 10], [-24, 181, -16], [14, 190, 10],
    [-90, 215, -6], [-48, 210, 12], [-5, 212, -14], [36, 212, -8], [68, 218, 10]];
  return `<g transform="translate(${stalls[index]} 0)" stroke="#503948" stroke-width="4" stroke-linejoin="round">
    <ellipse id="mark-${index}" cx="0" cy="393" rx="88" ry="14" fill="#ffe19f" stroke="none" opacity="0"/>
    <path d="M-129 154h258v172h-258Z" fill="#97695e"/>
    <path d="M-121 165h242v76h-242Z" fill="#b38370"/>
    <path d="M-114 170v76m229-76v76" fill="none" stroke="#755257" stroke-width="6"/>
    <path d="M-139 100h278l22 53h-322Z" fill="${cloth}"/>
    <path d="M-107 102h34l-11 49h-42Zm67 0h35v50h-40Zm74 0h35l11 49H41Zm72 0h25l20 49h-33Z" stroke="none" fill="${stripe}"/>
    <path d="M-162 152h324v16q-13 18-27 0-14 18-27 0-14 18-27 0-14 18-27 0-14 18-27 0-14 18-27 0-14 18-27 0-14 18-27 0-14 18-27 0-14 18-27 0-14 18-27 0-14 18-27 0Z" fill="${cloth}" stroke-width="3"/>
    <path d="M-126 251l13-27h226l13 27Z" fill="#e0ad7f"/>
    ${pile.map(([px, py, angle]) => `<g transform="translate(${px} ${py}) rotate(${angle} 25 25) scale(.49)">${fruitUse(fruit)}</g>`).join('')}
    <path d="M-128 247h256v31h-256Z" fill="#bc8964"/>
    <path d="M-120 278h240v50h-240Z" fill="#c79a72"/>
    <path d="M-118 294h236m-236 14h236m-236 13h236" fill="none" stroke="#a67861" stroke-width="2.6"/>
    <rect x="-106" y="279" width="212" height="42" rx="6" fill="#f5d5a2" stroke-width="3"/>
    <text x="0" y="308" font-family="system-ui,sans-serif" font-size="26" font-weight="800" text-anchor="middle" fill="#523944" stroke="none">${fruit.english}</text>
    <path d="M-121 327v13m240-13v13" fill="none" stroke="#634754" stroke-linecap="round"/>
  </g>`;
}

function renderZone() {
  const zone = fruitZones[zoneIndex];
  byId('market-title').textContent = `${zone.name}. Stalls: ${zone.fruits.map((fruit) => fruit.english).join(' and ')}.`;
  byId('market-stalls').innerHTML = zone.fruits.map((fruit, i) => stallMarkup(fruit, i, zone.colors)).join('');
  zoneLabels.forEach((label, i) => label.setAttribute('aria-current', String(i === zoneIndex)));
  document.querySelector('[data-key="ArrowDown"]').disabled = zoneIndex === 0;
  document.querySelector('[data-key="ArrowUp"]').disabled = zoneIndex === fruitZones.length - 1;
  updateNearby(performance.now());
}

function chooseZone(index) {
  if (card.open || index < 0 || index >= fruitZones.length || index === zoneIndex) return;
  zoneIndex = index;
  x = 128;
  face = 1;
  held.clear();
  announcementUntil = 0;
  renderZone();
}

function updateNearby(now) {
  const index = inRange();
  const atExit = x >= rowExit;
  byId('row-exit-mark').setAttribute('opacity', atExit ? '.72' : '0');
  for (let i = 0; i < stalls.length; i++) byId(`mark-${i}`).setAttribute('opacity', i === index ? '.65' : '0');
  look.disabled = index < 0;
  const rowHint = zoneIndex === 0 ? '↑ next row' : zoneIndex === fruitZones.length - 1 ? '↓ previous row' : '↑ next row · ↓ previous row';
  const nextText = now < announcementUntil ? announcement : atExit ? rowHint :
    index < 0 ? '← → walk · Change rows at the far right' :
      `${fruitZones[zoneIndex].fruits[index].english} · Space or Look`;
  if (hint.textContent !== nextText) hint.textContent = nextText;
}

function announce(text) {
  announcement = text;
  announcementUntil = performance.now() + 2600;
  updateNearby(performance.now());
}

function stopVoice() {
  voiceRequest++;
  voice.pause();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function speak(variant) {
  if (!selectedFruit) return;
  const fruit = selectedFruit;
  stopVoice();
  const request = voiceRequest;
  const file = variant === 'thanks' ? 'thank-you' : `${fruit.id}-${variant}`;
  voice.src = `audio/${file}.mp3?v=speechkit-john`;
  voice.play().catch(() => {
    if (!card.open || request !== voiceRequest || !voice.paused) return;
    if ('speechSynthesis' in window) {
      const line = variant === 'word' ? fruit.english : dialogueLine(variant, fruit);
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.lang = 'en-US';
      utterance.rate = .85;
      window.speechSynthesis.speak(utterance);
    }
  });
}

function dialogueLine(stage, fruit) {
  if (stage === 'seller') return sellerReply(fruit);
  if (stage === 'thanks') return 'Thank you!';
  return fruitRequest(fruit);
}

function renderDialogue() {
  const labels = {
    phrase: ['Shopper · Ask for the fruit', 'I said it'],
    seller: ['Seller · Hand over the fruit', 'Fruit handed over'],
    thanks: ['Shopper · Say thank you', 'I said thank you · Take'],
  };
  const [turn, buttonLabel] = labels[dialogueStage];
  byId('fruit-turn').textContent = turn;
  byId('fruit-phrase').textContent = dialogueLine(dialogueStage, selectedFruit);
  const serving = byId('fruit-serving');
  serving.hidden = dialogueStage === 'phrase';
  serving.innerHTML = serving.hidden ? '' : Array.from({length: selectedFruit.quantity}, () =>
    `<svg viewBox="0 0 100 100">${fruitUse(selectedFruit)}</svg>`
  ).join('');
  byId('take').textContent = buttonLabel;
  say.hidden = dialogueStage === 'seller' || !Recognition || !window.isSecureContext;
  say.disabled = false;
  byId('speech-status').textContent = '';
}

function openFruit() {
  const index = inRange();
  if (index < 0 || card.open) return;
  stopListening();
  selectedFruit = fruitZones[zoneIndex].fruits[index];
  dialogueStage = 'phrase';
  byId('fruit-english').textContent = selectedFruit.english;
  byId('fruit-quantity').textContent = orderText(selectedFruit);
  byId('fruit-picture-title').textContent = orderText(selectedFruit);
  byId('big-fruit').innerHTML = fruitUse(selectedFruit);
  byId('picture').style.backgroundColor = `${selectedFruit.color}27`;
  renderDialogue();
  held.clear();
  card.showModal();
  speak('word');
}

function renderBasket() {
  byId('score').textContent = `${collected.size} / ${allFruits.length}`;
  byId('empty-basket').hidden = collected.size > 0;
  byId('basket-items').innerHTML = allFruits.filter((fruit) => collected.has(fruit.id)).map((fruit) =>
    `<li><svg viewBox="0 0 100 100" aria-hidden="true">${fruitUse(fruit)}</svg><span>${orderText(fruit)}</span></li>`
  ).join('');
  const last = allFruits.find((fruit) => fruit.id === [...collected].at(-1));
  byId('girl-basket-fruit').innerHTML = last ? `<g transform="translate(15 36) scale(.17)">${fruitUse(last)}</g>` : '';
  byId('complete').hidden = collected.size !== allFruits.length;
}

function takeFruit() {
  if (!selectedFruit || !card.open) return;
  const fruit = selectedFruit;
  const alreadyOwned = collected.has(fruit.id);
  collected.add(fruit.id);
  renderBasket();
  announce(alreadyOwned ? 'Nice practice! This fruit is already in your basket.' : `${orderText(fruit)} added to your basket!`);
  card.close();
}

function advanceDialogue() {
  if (!selectedFruit || !card.open) return;
  stopListening();
  if (dialogueStage === 'thanks') {
    takeFruit();
    return;
  }
  dialogueStage = dialogueStage === 'phrase' ? 'seller' : 'thanks';
  renderDialogue();
  speak(dialogueStage);
  byId('take').focus();
}

function matchesPhrase(transcript, fruit) {
  const words = transcript.toLowerCase().match(/[a-z]+|[0-9]+/g) ?? [];
  const noun = fruit.quantity === 1 ? fruit.english.toLowerCase() : fruit.plural;
  const product = words.includes(noun) || (fruit.id === 'watermelon' && words.join(' ').includes('water melon'));
  const quantity = words.includes(String(fruit.quantity)) || words.includes(numberWords[fruit.quantity]);
  return product && quantity && words.includes(fruit.shade) && words.includes('please');
}

function listenForFruit() {
  if (!selectedFruit || recognizer || !Recognition) return;
  stopVoice();
  const listener = new Recognition();
  const fruit = selectedFruit;
  const stage = dialogueStage;
  const speechStatus = byId('speech-status');
  listener.lang = 'en-US';
  listener.maxAlternatives = 3;
  say.disabled = true;
  speechStatus.textContent = 'Say the line in English.';
  recognizer = listener;
  listener.onresult = (event) => {
    if (recognizer !== listener || selectedFruit !== fruit) return;
    const alternatives = Array.from(event.results[0], (result) => result.transcript);
    const correct = stage === 'thanks' ? alternatives.some((text) => /\bthank you\b/i.test(text)) :
      alternatives.some((text) => matchesPhrase(text, fruit));
    if (correct) advanceDialogue();
    else speechStatus.textContent = 'Try again, or say the line out loud and use the button.';
  };
  listener.onerror = () => {
    if (recognizer === listener) speechStatus.textContent = 'Say the line out loud and use the button.';
  };
  listener.onend = () => {
    if (recognizer !== listener) return;
    recognizer = null;
    say.disabled = false;
  };
  try {
    listener.start();
  } catch {
    recognizer = null;
    say.disabled = false;
    speechStatus.textContent = 'Say the line out loud and use the button.';
  }
}

function stopListening() {
  const listener = recognizer;
  recognizer = null;
  listener?.abort();
}

function move(key) {
  if (card.open || held.has(key)) return;
  face = key === 'ArrowLeft' ? -1 : 1;
  x = clampX(x + face * 13);
  held.add(key);
}

function direction(key) {
  if (x < rowExit) {
    announce('Walk to the ROWS sign at the far right.');
    return;
  }
  if (key === 'ArrowUp') chooseZone(zoneIndex + 1);
  if (key === 'ArrowDown') chooseZone(zoneIndex - 1);
}

window.addEventListener('keydown', (event) => {
  if (card.open || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.code === 'Space' && event.target instanceof HTMLButtonElement) return;
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) return;
  event.preventDefault();
  if (event.repeat) return;
  if (event.key === ' ') openFruit();
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') move(event.key);
  else direction(event.key);
});
window.addEventListener('keyup', (event) => held.delete(event.key));
window.addEventListener('blur', () => held.clear());
document.querySelectorAll('[data-key]').forEach((button) => {
  const key = button.dataset.key;
  const walking = key === 'ArrowLeft' || key === 'ArrowRight';
  if (walking) {
    button.addEventListener('pointerdown', (event) => {
      button.setPointerCapture(event.pointerId);
      move(key);
    });
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      button.addEventListener(event, () => held.delete(key));
    }
  }
  button.addEventListener('click', (event) => {
    if (!walking) direction(key);
    else if (event.detail === 0) { move(key); held.delete(key); }
    if (event.detail > 0) button.blur();
  });
});
look.addEventListener('click', (event) => {
  if (event.detail > 0) look.blur();
  openFruit();
});
byId('close-card').addEventListener('click', () => card.close());
byId('hear-word').addEventListener('click', () => speak('word'));
byId('hear-phrase').addEventListener('click', () => speak(dialogueStage));
byId('take').addEventListener('click', advanceDialogue);
say.addEventListener('click', listenForFruit);
card.addEventListener('close', () => {
  if (card.open) return;
  stopVoice();
  stopListening();
  selectedFruit = null;
});
byId('replay').addEventListener('click', () => {
  collected.clear();
  announcementUntil = 0;
  if (zoneIndex === 0) x = 128;
  else chooseZone(0);
  renderBasket();
  document.querySelector('[data-key="ArrowRight"]').focus();
});

function animate(now) {
  const delta = previousFrame === null ? 0 : Math.min(.045, (now - previousFrame) / 1000);
  previousFrame = now;
  const horizontal = Number(held.has('ArrowRight')) - Number(held.has('ArrowLeft'));
  const nextX = clampX(x + horizontal * 320 * delta);
  const walking = nextX !== x;
  if (walking) {
    face = horizontal;
    step += delta * 11;
  }
  x = nextX;
  const swing = walking ? Math.sin(step) * 24 : 0;
  byId('girl').setAttribute('transform', `translate(${x} 390) scale(${face} 1)`);
  byId('girl-rig').setAttribute('transform', `translate(0 ${walking ? -Math.abs(Math.sin(step)) * 3 : 0})`);
  byId('girl-back-leg').setAttribute('transform', `translate(8 -38) rotate(${-swing})`);
  byId('girl-front-leg').setAttribute('transform', `translate(-8 -38) rotate(${swing})`);
  byId('girl-arm').setAttribute('transform', `translate(13 -73) rotate(${swing * .18})`);
  updateNearby(now);
  requestAnimationFrame(animate);
}

renderZone();
renderBasket();
requestAnimationFrame(animate);
