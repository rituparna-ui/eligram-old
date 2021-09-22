const x = [{ k: 1 }, { k: 2 }, { k: 3 }, { k: 4 }];
const y = [3, 4, 5, 6];

// x - y

const diff = x.filter((e) => !y.includes(e.k));
console.log(diff);
