import numbers from "../model/numbers.model.js";

let game = 0;
let CondtionOfHighWin = false;
let MainAccount = 0;
let MoneyInShop = 0;
let UnclaimedMoney = 0;
let MoneyAfterGame = 0;
let tickets = [];
let unSelectedNumbers = [];
let selectedNums = [];
let luckyTicketsId = [];
let luckyTicketIdMulti = [];
let TotalMoneyCollected = 0;
let totalMoneyForLuckyTicket = 0;
let luckyNum = [];
let biggestOdd = 0;
let BigOddTicketsCollection = [];
let winnertickets = [];
let HighOddWinnertickets = [];
let nominatedNumsToBeRemoved = [];
let nominatedNumsToBeRemovedByOdd = [];
let totalMoneyForLuckeyTickets = 0;

let numbersofALL = [];

export const Draw = async (req, res) => {
  console.log("request from user");

  const InitialGame = new numbers({ name: "NumberOfGame", value: 1 });
  const InitialShopAccount = new numbers({ name: "MoneyInShop", value: 5000 });
  const InitialAccount = new numbers({ name: "MainAccount", value: 5000 });
  const InitialUnclaimed = new numbers({ name: "UnclaimedMoney", value: 0 });

  let NumberOfGame = await numbers.find({ name: "NumberOfGame" });
  let MainAccountData = await numbers.find({ name: "MainAccount" });
  let MoneyInShopData = await numbers.find({ name: "MoneyInShop" });
  let UnclaimedMoneyData = await numbers.find({ name: "UnclaimedMoney" });

  // console.log(typeof(NumberOfGame))
  // const gg = NumberOfGame[0].value
  // console.log("NumberOfGame",gg)
  if (NumberOfGame.length === 0) {
    await InitialAccount.save();
    await InitialGame.save();
    await InitialShopAccount.save();
    await InitialUnclaimed.save();
    NumberOfGame = await numbers.find({ name: "NumberOfGame" });
    MainAccountData = await numbers.find({ name: "MainAccount" });
    MoneyInShopData = await numbers.find({ name: "MoneyInShop" });
    UnclaimedMoneyData = await numbers.find({ name: "UnclaimedMoney" });
  }
  game = NumberOfGame[0].value;
  MainAccount = MainAccountData[0].value;
  MoneyInShop = MoneyInShopData[0].value;
  UnclaimedMoney = UnclaimedMoneyData[0].value;

  try {
    const Tickets = await req.body.tickets;
    tickets = Tickets;
    console.log("Tickets", Tickets);
    if (!Tickets || Tickets.length < 1)
      return res.status(201).json("Not sucessful");

    let getTotalMoneyCollected = totalMoneyCollected(Tickets);
    let selectedNumbers = AllSelectedNumbers(Tickets);

    let rand = allLuckyNumbers(1, 80, 20);
    let random = [...new Set(rand)];

    while (random.length < 20) {
      console.log("Size : ", random.length);
      let number = allLuckyNumbers(1, 80, 1);
      if (random.includes(number[0])) {
        void 0;
      } else {
        random.push(number[0]);
      }
    }

    selectedNums = selectedNumbersUnion(Tickets);
    unSelectedNumbers = UnselectedNumbersFun(selectedNums);
    AllSelectedNumbers(Tickets);
    let FinalNumbers = decisionMaker(random, Tickets);

    // res.json(selectedNumbers);
    res.json({ numbers: FinalNumbers, winners: winnertickets });

    // res.status(200).json(random);
  } catch (err) {
    console.log(err);
  }

  await numbers.findOneAndUpdate(
    { name: "NumberOfGame" },
    { $set: { value: game + 1 } }
  );
  await numbers.findOneAndUpdate(
    { name: "MainAccount" },
    { $set: { value: MainAccount } }
  );
  await numbers.findOneAndUpdate(
    { name: "MoneyInShop" },
    { $set: { value: MoneyAfterGame } }
  );
  await numbers.findOneAndUpdate(
    { name: "UnclaimedMoney" },
    { $set: { value: UnclaimedMoney } }
  );
};

const AllSelectedNumbers = (tickets) => {
  let numbersofALL = [];
  for (let i = 0; i < tickets.length; i++) {
    for (let j = 0; j < tickets[i].numbers.length; j++) {
      if (Array.isArray(tickets[i].numbers[j])) {
        for (let k = 0; k < tickets[i].numbers[j].length; k++) {
          numbersofALL.push(tickets[i].numbers[j][k]);
        }
      } else {
        numbersofALL.push(tickets[i].numbers[j]);
      }
    }
  }
  return numbersofALL;
};

const totalMoneyCollected = (t) => {
  let total = 0;
  for (let j = 0; j < t.length; j++) {
    if (t[j].type === 1) {
      total = total + t[j].money * t[j].numbers.length;
    } else {
      total = total + t[j].money;
    }
  }
  // MoneyFromBet = total
  return total;
};

const oddGenerator = (totalNumber, luckyNumbers) => {
  if (totalNumber === 1 && luckyNumbers === 1) {
    return 3.8;
  } else if (totalNumber === 2 && luckyNumbers === 2) {
    return 15;
  } else if (totalNumber === 3 && luckyNumbers === 2) {
    return 3;
  } else if (totalNumber === 3 && luckyNumbers === 3) {
    return 35;
  } else if (totalNumber === 4 && luckyNumbers === 2) {
    return 1;
  } else if (totalNumber === 4 && luckyNumbers === 3) {
    return 8;
  } else if (totalNumber === 4 && luckyNumbers === 4) {
    return 100;
  } else if (totalNumber === 4 && luckyNumbers === 3) {
    return 8;
  } else if (totalNumber === 5 && luckyNumbers === 2) {
    return 1;
  } else if (totalNumber === 5 && luckyNumbers === 3) {
    return 3;
  } else if (totalNumber === 5 && luckyNumbers === 4) {
    return 15;
  } else if (totalNumber === 5 && luckyNumbers === 5) {
    return 300;
  } else {
    return 0;
  }
};

const allLuckyNumbers = (min, max, n = 1) =>
  Array.from(
    { length: n },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

const selectedNumbersUnion = (tickets) => {
  for (let i = 0; i < tickets.length; i++) {
    for (let j = 0; j < tickets[i].numbers.length; j++) {
      if (Array.isArray(tickets[i].numbers[j])) {
        for (let k = 0; k < tickets[i].numbers[j].length; k++) {
          if (!selectedNums.includes(tickets[i].numbers[j][k])) {
            console.log(
              "Multiple Ticket Arra Elements",
              tickets[i].numbers[j][k]
            );
            selectedNums.push(tickets[i].numbers[j][k]);
          }
        }
      } else if (!selectedNums.includes(tickets[i].numbers[j])) {
        selectedNums.push(tickets[i].numbers[j]);
      }
    }
  }
  return selectedNums;
};

const UnselectedNumbersFun = (selectedNums) => {
  for (let i = 1; i < 81; i++) {
    if (!selectedNums.includes(i)) {
      unSelectedNumbers.push(i);
    }
  }
  return unSelectedNumbers;
};

const random_item = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

const elementCount = (arr, element, type) => {
  if (type === 0) {
    return arr.filter((currentElement) => currentElement === element).length;
  } else {
    return arr.filter(
      (currentElement) =>
        currentElement.id === element.id &&
        currentElement.index === element.index
    ).length;
  }
};

const totalMoneyAssignForGame = (tic) => {
  let divider = 0;
  let MainAccountNow = 0;

  let getTotalMoneyCollected = totalMoneyCollected(tic);

  MoneyAfterGame = 15 * +game + 5000 + 300 * Math.cos(5 * +game);

  divider = +MoneyAfterGame - +MoneyInShop;
  // console.log("the divider:", divider);

  let multiplier = 0;
  let TransMoney = 0;

  if (divider < 0) {
    multiplier = MoneyAfterGame / +MoneyInShop;

    if (multiplier > 0.6) {
      multiplier = 0.6;
    }

    TransMoney = multiplier * getTotalMoneyCollected;
    // console.log("TransMoney", TransMoney);
    // if((getTotalMoneyCollected - TransMoney) < 100){
    //   TransMoney = TransMoney + 80
    // }
    let randomLuckeyNumber = Math.floor(Math.random() * 3) + 1;

    // console.log(
    //   "Here is The Deterministic Random Number to High Win :",
    //   randomLuckeyNumber
    // );
    // console.log("Unclaimed Money :", UnclaimedMoney);
    if (UnclaimedMoney > 0 && randomLuckeyNumber === 2) {
      CondtionOfHighWin = true;
      TotalMoneyCollected =
        getTotalMoneyCollected + UnclaimedMoney + TransMoney;
      // console.log("High Win Total Money : ", TotalMoneyCollected);
      UnclaimedMoney = 0;
    } else {
      TotalMoneyCollected = getTotalMoneyCollected + TransMoney;
      // console.log(
      //   "Total Money Collected in the bet : ",
      //   getTotalMoneyCollected
      // );
    }

    // TotalMoneyCollected = getTotalMoneyCollected + TransMoney;

    // TotalMoneyCollected = totalMoneyCollected(tickets) + Math.abs(divider);
    MainAccountNow = MainAccount - TransMoney;
    // console.log(lose);
    MainAccount = MainAccountNow;
    // localStorage.setItem("initial", lose);

    // console.log("Main Account Now Lose:", MainAccount);
  } else if (divider > 0) {
    multiplier = +MoneyInShop / MoneyAfterGame;
    if (multiplier > 0.6) {
      multiplier = 0.6;
    }
    TransMoney = multiplier * getTotalMoneyCollected;
    // console.log("TransMoney", TransMoney);
    // if((getTotalMoneyCollected - TransMoney) < 100){
    //   TransMoney = TransMoney + 80
    // }
    // console.log("Total Money Collected in the bet : ", getTotalMoneyCollected);
    TotalMoneyCollected = getTotalMoneyCollected - TransMoney;
    // TotalMoneyCollected = totalMoneyCollected(tickets) - Math.abs(divider);

    MainAccountNow = MainAccount + TransMoney;

    MainAccount = MainAccountNow;
    // console.log(gain);

    // localStorage.setItem("initial", gain);

    // console.log("Main Account Now Gain :", MainAccount);
  } else {
    TotalMoneyCollected = getTotalMoneyCollected;
  }
  // localStorage.setItem("transaction", MoneyAfterGame);
  // await numbers.findOneAndUpdate({name:"MoneyInShop"}, {$set:{value:MoneyAfterGame}})

  return TotalMoneyCollected;
};

console.log("*************************");

const mode = (array) => {
  if (array.length === 0) return null;
  var modeMap = {};
  var maxEl = array[0],
    maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
};

const getSingleTicketMoney = (rand, tic) => {
  totalMoneyForLuckyTicket = 0;

  nominatedNumsToBeRemoved = [];

  nominatedNumsToBeRemoved = mode(numbersofALL);

  var Odd = 0;
  luckyTicketsId = [];
  luckyTicketIdMulti = [];
  for (let i = 0; i < rand.length; i++) {
    for (let k = 0; k < tic.numbers.length; k++) {
      if (Array.isArray(tic.numbers[k])) {
        for (let j = 0; j < tic.numbers[k].length; j++) {
          if (rand[i] === tic.numbers[k][j]) {
            if (!luckyNum.includes(tic.numbers[k][j])) {
              luckyNum.push(tic.numbers[k][j]);
            }
            luckyTicketIdMulti.push({ id: tic.id, index: k });
            console.log(`id is ${tic.id} and index of the array ${k}`);
          }
        }
      } else if (rand[i] === tic.numbers[k]) {
        // console.log("Lucky Numbers ", luckyNum)
        if (!luckyNum.includes(tic.numbers[k])) {
          luckyNum.push(tic.numbers[k]);
        }
        luckyTicketsId.push(tic.id);
      }
    }
  }

  if (tic.type === 1) {
    for (let i = 0; i < tic.numbers.length; i++) {
      Odd = oddGenerator(
        tic.numbers[i].length,
        elementCount(luckyTicketIdMulti, { id: tic.id, index: i }, 1)
      );
      console.log("type 1 card", Odd);

      if (Odd > 0) {
        winnertickets.push({ ticket: tic.id, win: Odd * tic.money });
      }

      if (Odd > 1) {
        HighOddWinnertickets.push({ ticket: tic.id, odd: Odd });
      }

      totalMoneyForLuckyTicket = totalMoneyForLuckyTicket + tic.money * Odd;

      console.log(
        `this id ${tic.id} got luckey with ${totalMoneyForLuckyTicket}`
      );
      if (Odd > biggestOdd) {
        biggestOdd = Odd;
        nominatedNumsToBeRemovedByOdd = luckyNum.filter((x) =>
          tic.numbers[i].includes(x)
        );
      }
    }
  } else {
    Odd = oddGenerator(
      tic.numbers.length,
      elementCount(luckyTicketsId, tic.id, 0)
    );

    if (Odd > 0) {
      winnertickets.push({ ticket: tic.id, win: Odd * tic.money });
    }

    if (Odd > 1) {
      HighOddWinnertickets.push({ ticket: tic.id, odd: Odd });
    }

    // if (Odd >= 3) {
    //   BigOddTicketsCollection.push({
    //     id: tic.id,
    //     Odd: Odd,
    //     Numbers: tic.numbers,
    //   });
    // }
    totalMoneyForLuckyTicket = tic.money * Odd;
    console.log(
      `this id ${tic.id} got luckey with ${totalMoneyForLuckyTicket}`
    );

    // nominatedNumsToBeRemovedByOdd = [];
    if (Odd > biggestOdd) {
      biggestOdd = Odd;
      nominatedNumsToBeRemovedByOdd = luckyNum.filter((x) =>
        tic.numbers.includes(x)
      );
    }
  }

  return totalMoneyForLuckyTicket;
};

const getTotalMoneyForAllLuckyTickets = (rand, tics) => {
  console.log("getTotalMoney Numbers calc : ", rand);
  winnertickets = [];
  totalMoneyForLuckeyTickets = 0;
  for (let i = 0; i < tics.length; i++) {
    totalMoneyForLuckeyTickets =
      totalMoneyForLuckeyTickets + getSingleTicketMoney(rand, tics[i]);

    //console.log(totalMoneyForLuckeyTickets);
  }

  return totalMoneyForLuckeyTickets;
};

const remover = (rand, num) => {
  let NumRemoved = num[num.length - 1];
  let newRandom = [];
  console.log("Item to be romved is %d", NumRemoved);
  for (let i = 0; i < rand.length; i++) {
    if (rand[i] !== NumRemoved) {
      newRandom.push(rand[i]);
    }
  }

  //  for(let k=0; k < unSelectedluckyNumbersLen(newRandom); k++){
  //   if(allLuckyNumbers(1,80,))
  //  }
  let itration = 20 - newRandom.length;

  if (unSelectedNumbers.length !== 0) {
    let value = unSelectedNumbers[0];
    for (let i = 0; i < itration; i++) {
      if (!newRandom.includes(unSelectedNumbers[i])) {
        newRandom.push(unSelectedNumbers[i]);
      }
    }

    unSelectedNumbers = unSelectedNumbers.filter(function (item) {
      return item !== value;
    });

    console.log("Unselected remaining", unSelectedNumbers);
  } else {
    while (newRandom.length < 20) {
      let itr = random_item(getRandNoDup);

      if (!newRandom.includes(itr)) {
        newRandom.push(itr);
        getRandNoDup = getRandNoDup.filter(function (item) {
          return item !== itr;
        });
      }
    }
  }

  luckyNum = [];
  biggestOdd = 0;
  winnertickets = [];
  decisionMaker(newRandom, tickets);

  // console.log("random number generated ", newRandom);
};

// DoHighWinner is a function to slecte optimized random numbers that resembles to one high winner

const DoHighWinner = (rand, tic, totalAssignedMoney) => {
  console.log("#####################################################");

  let newRand = [];
  let MoneyBetByWinner = 0;
  let NumberIntheBet = 0;
  let SizeOfTicket = tic.length;

  let randomLuckeyNumber = Math.floor(Math.random() * SizeOfTicket) + 1;

  let HighWinnerToBe = tic[randomLuckeyNumber - 1];
  MoneyBetByWinner = HighWinnerToBe.money;

  if (HighWinnerToBe.type === 1) {
    let RandomArrayFromMltiple =
      Math.floor(Math.random() * HighWinnerToBe.numbers.length) + 1;
    let theArray = HighWinnerToBe.numbers[RandomArrayFromMltiple];

    NumberIntheBet = theArray.length;

    let NumberOfLuckeyNumbersToBe = 0;

    for (let i = NumberIntheBet; i > 0; i--) {
      if (
        oddGenerator(NumberIntheBet, i) * MoneyBetByWinner >
        totalAssignedMoney
      ) {
      } else {
        NumberOfLuckeyNumbersToBe = i;
        break;
      }
    }

    // remove n number of elements from randomly selected array that exists in SelectedNums if there are any
    console.log("NumberOfLuckeyNumbersTobe  :  ", NumberOfLuckeyNumbersToBe);
    for (let i = 0; i < NumberOfLuckeyNumbersToBe; i++) {
      // for(let j = 0; j<selectedNums.length; j++){
      //   if(rand.includes(selectedNums[j])){
      //     newRand = rand.filter(element => element !== selectedNums[j]);
      //     break
      //   }

      // }
      const randomIndex = Math.floor(Math.random() * rand.length);
      rand.splice(randomIndex, 1);
    }

    console.log("rand remainng after slice  :  ", rand);

    for (let i = 0; i < NumberOfLuckeyNumbersToBe; i++) {
      for (let j = 0; j < selectedNums.length; j++) {
        if (
          !rand.includes(selectedNums[j]) &&
          theArray.includes(selectedNums[j])
        ) {
          rand.push(selectedNums[j]);
          break;
        }
      }
    }
  } else {
    NumberIntheBet = HighWinnerToBe.numbers.length;

    let NumberOfLuckeyNumbersToBe = 0;

    for (let i = NumberIntheBet; i > 0; i--) {
      if (
        oddGenerator(NumberIntheBet, i) * MoneyBetByWinner >
        totalAssignedMoney
      ) {
      } else {
        NumberOfLuckeyNumbersToBe = i;
        break;
      }
    }

    // remove n number of elements from randomly selected array that exists in SelectedNums if there are any
    console.log("NumberOfLuckeyNumbersTobe  :  ", NumberOfLuckeyNumbersToBe);
    for (let i = 0; i < NumberOfLuckeyNumbersToBe; i++) {
      // for(let j = 0; j<selectedNums.length; j++){
      //   if(rand.includes(selectedNums[j])){
      //     newRand = rand.filter(element => element !== selectedNums[j]);
      //     break
      //   }

      // }
      const randomIndex = Math.floor(Math.random() * rand.length);
      rand.splice(randomIndex, 1);
    }

    console.log("rand remainng after slice  :  ", rand);

    for (let i = 0; i < NumberOfLuckeyNumbersToBe; i++) {
      for (let j = 0; j < selectedNums.length; j++) {
        if (
          !rand.includes(selectedNums[j]) &&
          HighWinnerToBe.numbers.includes(selectedNums[j])
        ) {
          rand.push(selectedNums[j]);
          break;
        }
      }
    }
  }

  console.log("newRand after processes  :  ", rand);

  let itration = 20 - rand.length;

  if (itration !== 0) {
    if (unSelectedNumbers.length !== 0) {
      let value = unSelectedNumbers[0];
      for (let i = 0; i < itration; i++) {
        if (!rand.includes(unSelectedNumbers[i])) {
          rand.push(unSelectedNumbers[i]);
        }
      }
    }
  }

  console.log("final newRand in highWinner  :  ", rand);

  return rand;
};

const decisionMaker = (rand, tic) => {
  console.log("Numbers  ", rand);
  var totalLuckyMoney = getTotalMoneyForAllLuckyTickets(rand, tic);
  // TotalMoneyLose = totalLuckyMoney
  // console.log("Total Lucky Money : ", totalLuckyMoney);
  var totalAssignedMoney = totalMoneyAssignForGame(tic);

  if (CondtionOfHighWin) {
    let highWinnerRand = DoHighWinner(rand, tic, totalAssignedMoney);
    return highWinnerRand;
  } else {
    // console.log("Total Assigned Money : ", totalAssignedMoney);
    // console.log(totalLuckyMoney, totalAssignedMoney)

    console.log(rand, luckyNum);
    if (totalLuckyMoney > totalAssignedMoney) {
      HighOddWinnertickets = [];
      winnertickets = [];
      // console.log("Nominated Numbers", nominatedNumsToBeRemovedByOdd);
      remover(rand, nominatedNumsToBeRemovedByOdd);
    } else {
      UnclaimedMoney = UnclaimedMoney + (totalAssignedMoney - totalLuckyMoney);
      console.log("Successful", totalLuckyMoney + "<" + totalAssignedMoney);
    }
    console.log(rand);
    return rand;
  }
};
