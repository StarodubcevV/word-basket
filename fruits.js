const fruitZones = [
  {name: 'Фруктовый сад', colors: ['#6f8b6b', '#f4d7a4'], fruits: [
    {id: 'apple', russian: 'Яблоко', english: 'Apple', phrase: 'An apple, please.', color: '#c95d54'},
    {id: 'pear', russian: 'Груша', english: 'Pear', phrase: 'A pear, please.', color: '#809c5a'}
  ]},
  {name: 'Цитрусовый ряд', colors: ['#c37658', '#f7d899'], fruits: [
    {id: 'orange', russian: 'Апельсин', english: 'Orange', phrase: 'An orange, please.', color: '#e88842'},
    {id: 'lemon', russian: 'Лимон', english: 'Lemon', phrase: 'A lemon, please.', color: '#d6a93e'}
  ]},
  {name: 'Южные фрукты', colors: ['#6b927f', '#f6ddae'], fruits: [
    {id: 'banana', russian: 'Банан', english: 'Banana', phrase: 'A banana, please.', color: '#d2a948'},
    {id: 'peach', russian: 'Персик', english: 'Peach', phrase: 'A peach, please.', color: '#e27b61'}
  ]},
  {name: 'Ягодный ряд', colors: ['#a66574', '#f6cf9d'], fruits: [
    {id: 'strawberry', russian: 'Клубника', english: 'Strawberry', phrase: 'A strawberry, please.', color: '#c95860'},
    {id: 'raspberry', russian: 'Малина', english: 'Raspberry', phrase: 'A raspberry, please.', color: '#bb5378'}
  ]},
  {name: 'Грозди и вишни', colors: ['#7a6991', '#f4d6a9'], fruits: [
    {id: 'grapes', russian: 'Виноград', english: 'Grapes', phrase: 'Some grapes, please.', color: '#8163a3'},
    {id: 'cherries', russian: 'Вишня', english: 'Cherries', phrase: 'Some cherries, please.', color: '#b95263'}
  ]},
  {name: 'Бахча', colors: ['#729064', '#f6d39a'], fruits: [
    {id: 'watermelon', russian: 'Арбуз', english: 'Watermelon', phrase: 'A watermelon, please.', color: '#72945f'},
    {id: 'melon', russian: 'Дыня', english: 'Melon', phrase: 'A melon, please.', color: '#d6984e'}
  ]},
];

const fruitArt = {
  apple: `<path d="M51 35c-12-12-28-7-34 5-7 14 3 39 16 45 6 3 12-3 18-3s11 6 17 3c13-6 22-32 15-45-6-12-22-16-32-5Z" fill="#d86155"/>
    <path d="M52 34c-2-11 3-18 7-24" fill="none" stroke="#635040" stroke-width="5"/>
    <path d="M54 25c2-12 13-15 23-13-2 10-13 17-23 13Z" fill="#89a365"/>
    <path d="M27 53c0-8 5-14 11-15" fill="none" stroke="#f19a79" stroke-width="5"/>`,
  pear: `<path d="M49 30c-13 0-12 21-22 32C13 79 29 92 50 92s37-13 23-30C63 51 64 30 49 30Z" fill="#a4ba64"/>
    <path d="M50 31c2-9 5-14 10-20" fill="none" stroke="#6a5141" stroke-width="5"/>
    <path d="M55 25c6-11 18-9 25-5-6 8-17 9-25 5Z" fill="#7f9a58"/>
    <path d="M39 49c-1 9-13 17-13 25" fill="none" stroke="#d2d78a" stroke-width="4"/>`,
  orange: `<path d="M83 56c0 22-14 34-33 34S17 77 17 56c0-20 13-32 33-32s33 12 33 32Z" fill="#ec984d"/>
    <path d="M51 25c-1-5 1-10 4-14" fill="none" stroke="#62523e" stroke-width="4"/>
    <path d="M52 23c7-11 16-13 27-9-6 9-14 13-27 9Z" fill="#86a761"/>
    <path d="M28 52c1-7 6-13 12-15" fill="none" stroke="#ffcb78" stroke-width="4"/>
    <path d="M68 61h.1m-7 10h.1m-13 7h.1m23-9h.1" stroke="#b96c42" stroke-width="3.5"/>`,
  lemon: `<path d="M79 28c9 3 11 10 7 17 1 20-26 43-46 39-7 4-15 3-20-4-4-5-3-11 0-15-2-19 24-43 47-39 4-2 8-2 12 2Z" fill="#f3cb59"/>
    <path d="M32 58c7-11 17-19 29-22" fill="none" stroke="#ffe392" stroke-width="4"/>
    <path d="M72 28c0-11 10-16 19-16-3 10-9 16-19 16Z" fill="#8da561"/>
    <path d="M57 68h.1m9-7h.1m7-9h.1" stroke="#cf9948" stroke-width="3.5"/>`,
  banana: `<path d="M25 22 36 25l-3 11c5 26 24 34 48 27l7 8c-13 19-46 24-64 8C9 65 12 41 24 30Z" fill="#eebc4e"/>
    <path d="M27 37c-2 27 20 42 48 32" fill="none" stroke="#ffdb77" stroke-width="5"/>
    <path d="M25 21 35 24l-2 8-10-3Z" fill="#8f975a"/>
    <path d="M80 63l8 6-3 6-6-4Z" fill="#866041"/>`,
  peach: `<path d="M49 33c-11-9-29-4-35 10-9 20 9 41 35 45 26-3 46-22 38-42-6-16-23-21-38-13Z" fill="#ec9675"/>
    <path d="M50 34c-10 15-10 33 0 52" fill="none" stroke="#c36e64" stroke-width="3.5"/>
    <path d="M45 29C42 16 29 13 18 17c6 11 16 16 27 12Zm5 1c6-11 16-14 27-10-7 9-17 11-27 10Z" fill="#8eaa70"/>
    <path d="M25 50c1-5 4-9 9-10" fill="none" stroke="#ffc2a1" stroke-width="4"/>`,
  strawberry: `<path d="M50 30c-16-8-34 1-35 18-1 19 21 43 35 44 14-1 35-25 35-44-1-17-19-26-35-18Z" fill="#d75e5e"/>
    <path d="M49 30c-7-10-2-18 3-21l4 14 15-6-5 13 9 5-16 5-9-5-8 5-17-7 12-4-6-10Z" fill="#849f5c"/>
    <path d="m30 49-2 4m16-5-1 4m17-4 1 4m12-1 1 4M39 65l-1 4m16-7v5m12-3 1 4M49 77v4" stroke="#ffd48d" stroke-width="3"/>`,
  raspberry: `<path d="M50 29c-1-7 3-13 8-17" fill="none" stroke="#708951" stroke-width="4"/>
    <path d="M49 27c-9-8-17-5-24-2l11 10 13-1 12 2 12-10c-9-5-18-4-24 1Z" fill="#85a663"/>
    <g fill="#c95e82"><circle cx="37" cy="39" r="13"/><circle cx="60" cy="39" r="13"/><circle cx="26" cy="54" r="13"/><circle cx="73" cy="54" r="13"/><circle cx="49" cy="52" r="14"/><circle cx="33" cy="69" r="13"/><circle cx="65" cy="70" r="13"/><circle cx="49" cy="80" r="13"/></g>
    <path d="M29 37h.1m21 10h.1m-18 15h.1m30 1h.1m-15 11h.1" stroke="#f0a2aa" stroke-width="3.5"/>`,
  grapes: `<path d="M50 30c-4-10-1-16 7-20" fill="none" stroke="#627f56" stroke-width="4"/>
    <path d="M55 23c6-11 18-12 27-9-6 11-16 13-27 9Z" fill="#8ba56c"/>
    <g fill="#977cb1"><circle cx="29" cy="42" r="13"/><circle cx="51" cy="39" r="13"/><circle cx="73" cy="44" r="13"/><circle cx="40" cy="58" r="13"/><circle cx="62" cy="61" r="13"/><circle cx="51" cy="78" r="13"/></g>
    <path d="M24 39q1-4 5-5m17 2q1-4 5-5m17 9q1-4 5-5m-37 18q1-4 5-4m17 7q1-4 5-5m-15 21q1-4 5-4" fill="none" stroke="#cbb2d3" stroke-width="2.8"/>`,
  cherries: `<path d="M35 60c5-19 14-35 24-47m7 48c2-15-1-31-7-48" fill="none" stroke="#759354" stroke-width="4.3"/>
    <path d="M60 16c9-7 21-6 28 1-9 7-19 9-28-1Z" fill="#8ea86a"/>
    <path d="M34 57c-11-5-24 4-23 16 1 12 10 18 22 18 11 0 20-7 20-17 0-13-12-21-19-17Zm33 2c-10-6-23 2-23 14 0 12 9 19 21 19 13 0 22-7 23-18 1-11-10-20-21-15Z" fill="#ce5969"/>
    <path d="M20 72c1-4 4-7 8-7m25 7c1-4 4-6 7-7" fill="none" stroke="#f4a28d" stroke-width="3.6"/>`,
  watermelon: `<path d="M86 52c0 20-16 34-36 34S14 72 14 52c0-18 16-33 36-33s36 15 36 33Z" fill="#8fae67"/>
    <path d="M31 23c-12 14-13 41 0 57m12-60c-6 20-7 45 0 65m15-65c8 20 8 46 0 65m12-60c12 16 12 41-1 55" fill="none" stroke="#658e61" stroke-width="4.2"/>
    <path d="M21 73h59C76 85 65 92 50 92S24 85 21 73Z" fill="#74a368"/>
    <path d="M26 72h49c-3 9-12 15-25 15-12 0-20-6-24-15Z" fill="#ed8176"/>
    <path d="m40 76 1 3m10-3v3m10-3-1 3" stroke="#66434e" stroke-width="2.5"/>`,
  melon: `<path d="M86 56c0 19-16 31-36 31S14 74 14 56c0-18 16-32 36-32 20 0 36 14 36 32Z" fill="#dfad66"/>
    <path d="M50 25c1-5 3-10 9-12" fill="none" stroke="#728353" stroke-width="4"/>
    <path d="M34 29c-15 14-16 38-4 51m36-50c14 15 15 38 3 50M48 28c-8 14-8 43-1 55m8-55c8 14 8 43 1 55" fill="none" stroke="#bd8f54" stroke-width="3"/>
    <path d="M23 76h55c-7 11-17 17-28 17-13 0-22-6-27-17Z" fill="#f6c779"/>
    <path d="M36 79c7 7 22 7 29 0" fill="none" stroke="#e4a05e" stroke-width="3"/>`,
};
