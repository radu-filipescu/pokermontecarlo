import { Component, OnInit } from '@angular/core';
import {GlobalService} from "../global/global.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css']
})
export class GamePageComponent implements OnInit {
  playerCardOne: string = "6_of_spades";
  playerCardTwo: string = "jack_of_clubs";

  opponentCardOne: string = "card_back";
  opponentCardTwo: string = "card_back";

  opponentCardOneDisplay: string = "card_back";
  opponentCardTwoDisplay: string = "card_back";

  chanceOfWinning: string = '50';

  boardCards: string[] = ["card_back", "card_back", "card_back"];

  allCards: { label: string, name: string }[] =
    [
      { label:"2_of_clubs",    name: "2C" },
      { label:"2_of_diamonds", name: "2D" },
      { label:"2_of_hearts",   name: "2H" },
      { label:"2_of_spades",   name: "2S" },
      { label:"3_of_clubs",    name: "3C" },
      { label:"3_of_diamonds", name: "3D" },
      { label:"3_of_hearts",   name: "3H" },
      { label:"3_of_spades",   name: "3S" },
      { label:"4_of_clubs",    name: "4C" },
      { label:"4_of_diamonds", name: "4D" },
      { label:"4_of_hearts",   name: "4H" },
      { label:"4_of_spades",   name: "4S" },
      { label:"5_of_clubs",    name: "5C" },
      { label:"5_of_diamonds", name: "5D" },
      { label:"5_of_hearts",   name: "5H" },
      { label:"5_of_spades",   name: "5S" },
      { label:"6_of_clubs",    name: "6C" },
      { label:"6_of_diamonds", name: "6D" },
      { label:"6_of_hearts",   name: "6H" },
      { label:"6_of_spades",   name: "6S" },
      { label:"7_of_clubs",    name: "7C" },
      { label:"7_of_diamonds", name: "7D" },
      { label:"7_of_hearts",   name: "7H" },
      { label:"7_of_spades",   name: "7S" },
      { label:"8_of_clubs",    name: "8C" },
      { label:"8_of_diamonds", name: "8D" },
      { label:"8_of_hearts",   name: "8H" },
      { label:"8_of_spades",   name: "8S" },
      { label:"9_of_clubs",    name: "9C" },
      { label:"9_of_diamonds", name: "9D" },
      { label:"9_of_hearts",   name: "9H" },
      { label:"9_of_spades",   name: "9S" },
      { label:"10_of_clubs",   name: "TC" },
      { label:"10_of_diamonds",name: "TD" },
      { label:"10_of_hearts",  name: "TH" },
      { label:"10_of_spades",  name: "TS" },
      { label:"ace_of_clubs",  name: "AC" },
      { label:"ace_of_diamonds",name: "AD" },
      { label:"ace_of_hearts", name: "AH" },
      { label:"ace_of_spades", name: "AS" },
      { label:"jack_of_clubs", name: "JC" },
      { label:"jack_of_diamonds",name: "JD" },
      { label:"jack_of_hearts", name: "JH" },
      { label:"jack_of_spades", name: "JS" },
      { label:"king_of_clubs",  name: "KC" },
      { label:"king_of_diamonds", name: "KD" },
      { label:"king_of_hearts",   name: "KH" },
      { label:"king_of_spades",   name: "KS" },
      { label:"queen_of_clubs",    name: "QC" },
      { label:"queen_of_diamonds", name: "QD" },
      { label:"queen_of_hearts",   name: "QH" },
      { label:"queen_of_spades",   name: "QS" }
    ];

  fastLookupTable = new Map<string, string>();

  // misc
  settingsModalOpen: boolean = false;
  wonOrLost: string = "";
  currentAction: string = "show flop";

  // consts
  gamesToSimulate: number = 0;

  constructor(public globalService: GlobalService, public router: Router) { }

  ngOnInit(): void {
    this.gamesToSimulate = GlobalService.howManySimulations;

    // initialize lookup table
    for(let i = 0; i < this.allCards.length; i++) {
      this.fastLookupTable.set(this.allCards[i].label, this.allCards[i].name);
    }

    this.playerCardOne = this.getRandomCard().label;

    this.playerCardTwo = this.getRandomCard().label;
    while(this.playerCardOne == this.playerCardTwo)
      this.playerCardTwo = this.getRandomCard().label;

    // opponent cards are generated at the beginning too
    this.opponentCardOne = this.getRandomCard().label;
    while(this.playerCardOne == this.opponentCardOne || this.playerCardTwo == this.opponentCardOne)
      this.opponentCardOne = this.getRandomCard().label;

    this.opponentCardTwo = this.getRandomCard().label;
    while(this.playerCardOne == this.opponentCardTwo || this.playerCardTwo == this.opponentCardTwo || this.opponentCardOne == this.opponentCardTwo)
      this.opponentCardTwo = this.getRandomCard().label;

    // initial status
    console.log('before');
    this.updateWinPercent(this.playerCardOne, this.playerCardTwo, []);
    console.log('after');
  }

  async updateWinPercent(playerCard1: string, playerCard2: string, board: string[]) {
    setTimeout( () => {
      let winCount = 0;
      let drawCount = 0;
      let loseCount = 0;

      this.gamesToSimulate = GlobalService.howManySimulations;

      for (let i = 0; i < this.gamesToSimulate; i++) {
        let result = this.simulateGame(playerCard1, playerCard2, board);

        if (result === 'LOSE')
          loseCount++;

        if (result === 'WIN')
          winCount++;

        if (result === 'DRAW')
          drawCount++;
      }

      console.log(winCount + ' of ' + this.gamesToSimulate);

      this.chanceOfWinning = (100 * (winCount / this.gamesToSimulate)).toFixed(2);
    }, 2);
  }

  doCurrentAction() {
    let oldCards: string[] = [];
    oldCards.push(this.playerCardOne);
    oldCards.push(this.playerCardTwo);
    oldCards.push(this.opponentCardOne);
    oldCards.push(this.opponentCardTwo);

    if(this.currentAction === "show flop") {
      for(let i = 0; i < 3; i++) {
        let newCard = this.getRandomCard().label;
        while (oldCards.includes(newCard))
          newCard = this.getRandomCard().label;

        this.boardCards[i] = newCard;
        oldCards.push(newCard);
      }

      this.updateWinPercent(this.playerCardOne, this.playerCardTwo, this.boardCards)
        .then( () => {
          this.currentAction = 'show turn';
          return;
        });
    }

    if(this.currentAction === 'show turn') {
      oldCards.push(this.boardCards[0]);
      oldCards.push(this.boardCards[1]);
      oldCards.push(this.boardCards[2]);

      let newCard = this.getRandomCard().label;
      while (oldCards.includes(newCard))
        newCard = this.getRandomCard().label;

      this.boardCards.push(newCard);

      this.updateWinPercent(this.playerCardOne, this.playerCardTwo, this.boardCards);

      this.currentAction = 'show river';
      return;
    }

    if(this.currentAction === 'show river') {
      oldCards.push(this.boardCards[0]);
      oldCards.push(this.boardCards[1]);
      oldCards.push(this.boardCards[2]);
      oldCards.push(this.boardCards[3]);

      let newCard = this.getRandomCard().label;
      while (oldCards.includes(newCard))
        newCard = this.getRandomCard().label;

      this.boardCards.push(newCard);

      this.updateWinPercent(this.playerCardOne, this.playerCardTwo, this.boardCards)
        .then( () => {
          this.currentAction = 'check winner';
          return;
        })
    }

    if(this.currentAction === 'check winner') {
      this.opponentCardOneDisplay = this.opponentCardOne;
      this.opponentCardTwoDisplay = this.opponentCardTwo;

      let result = this.evaluateGame(this.playerCardOne, this.playerCardTwo, this.opponentCardOne, this.opponentCardTwo, this.boardCards);

      if(result == 'DRAW')
        this.wonOrLost = "It's a DRAW.";
      else
        this.wonOrLost = 'You ' + result + '.';

      this.currentAction = 'restart';
      return;
    }

    if(this.currentAction === 'restart') {
      window.location.reload();
    }
  }

  getRandomCard() {
    let idx = Math.floor(Math.random() * 53);
    let result = this.allCards[idx];

    while(!result || !result.label) {
      idx = Math.floor(Math.random() * 53);
      result = this.allCards[idx];
    }

    return result;
  }

  evaluateGame(playerCard1: string, playerCard2: string, opponentCard1: string, opponentCard2: string, board: string[]) {
    let gameCards: string[] = [];
    let combs = this.generateCombinations();

    for(let card of board) {
      gameCards.push(this.fastLookupTable.get(card) as string);
    }

    // player hand must be the best hand out of the 5 cards on the board + 2 player cards
    gameCards.push(this.fastLookupTable.get(playerCard1) as string);
    gameCards.push(this.fastLookupTable.get(playerCard2) as string);

    let bestPlayerHand: string = "";

    for(let combination of combs) {
      let playerHand: string = "";

      for(let i = 0; i < 5; i++) {
        playerHand += gameCards[combination[i]];

        if(i < 4)
          playerHand += ' ';
      }

      // if current hand is better than the best one so far
      if(bestPlayerHand == "" || this.compareHands(playerHand, bestPlayerHand) == 'WIN')
        bestPlayerHand = playerHand;
    }

    gameCards.pop();
    gameCards.pop();

    // opponent hand must be the best hand out of the 5 cards on the board + 2 opponent cards
    gameCards.push(this.fastLookupTable.get(opponentCard1) as string);
    gameCards.push(this.fastLookupTable.get(opponentCard2) as string);

    let bestOpponentHand: string = "";

    for(let combination of combs) {
      let opponentHand: string = "";

      for(let i = 0; i < 5; i++) {
        opponentHand += gameCards[combination[i]];

        if(i < 4)
          opponentHand += ' ';
      }

      // if current hand is better than the best one so far
      if(bestOpponentHand == "" || this.compareHands(opponentHand, bestOpponentHand) == 'WIN')
        bestOpponentHand = opponentHand;
    }

    //console.log('player hand: ', bestPlayerHand);
    //console.log('opponent hand: ', bestOpponentHand);

    return this.compareHands(bestPlayerHand, bestOpponentHand);
  }

  generateCombinations() {
    // for speed efficiency, we won't generate combinations real-time
    // instead we'll load them from memory
    return [
      [0, 1, 2, 3, 4],
      [0, 1, 2, 3, 5],
      [0, 1, 2, 3, 6],
      [0, 1, 2, 4, 5],
      [0, 1, 2, 4, 6],
      [0, 1, 2, 5, 6],
      [0, 1, 3, 4, 5],
      [0, 1, 3, 4, 6],
      [0, 1, 3, 5, 6],
      [0, 1, 4, 5, 6],
      [0, 2, 3, 4, 5],
      [0, 2, 3, 4, 6],
      [0, 2, 3, 5, 6],
      [0, 2, 4, 5, 6],
      [0, 3, 4, 5, 6],
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4, 6],
      [1, 2, 3, 5, 6],
      [1, 2, 4, 5, 6],
      [1, 3, 4, 5, 6],
      [2, 3, 4, 5, 6]
    ];
  }

  simulateGame(playerCard1: string, playerCard2: string, board: string[]) {
    let supposedOpponentCardOne = this.getRandomCard().label;
    while(supposedOpponentCardOne == playerCard1 || supposedOpponentCardOne == playerCard2)
      supposedOpponentCardOne = this.getRandomCard().label;

    let supposedOpponentCardTwo = this.getRandomCard().label;
    while(supposedOpponentCardTwo == playerCard1 || supposedOpponentCardTwo == playerCard2 || supposedOpponentCardOne == supposedOpponentCardTwo)
      supposedOpponentCardTwo = this.getRandomCard().label;

    let supposedBoard: string [] = [];
    for(let card of board)
      supposedBoard.push(card);

    for(let i = board.length; i < 5; i++) {
      let randomCard = this.getRandomCard().label;

      // make sure it's not already picked
      while(supposedBoard.includes(randomCard) || playerCard1 == randomCard || playerCard2 == randomCard || supposedOpponentCardOne == randomCard || supposedOpponentCardTwo == randomCard)
          randomCard = this.getRandomCard().label;

      supposedBoard.push(randomCard);
    }

    let result = this.evaluateGame(playerCard1, playerCard2, supposedOpponentCardOne, supposedOpponentCardTwo, supposedBoard);
    /*console.log('P1: ' + playerCard1 + ' P2: ' + playerCard2);
    console.log('O1: ' + supposedOpponentCardOne + ' O2: ' + supposedOpponentCardTwo);
    console.log('board', supposedBoard);
    console.log(result);
    console.log();*/

    return result;
  }

  order: string = "23456789TJQKA";
  counts: any = new Object();

  getHandDetails(hand: string) {
    let cards: string[] = hand.split(" ");
    //console.log('cards', cards);
    let faces: string[] = cards.map(a => String.fromCharCode(77 - this.order.indexOf(a[0]))).sort();
    //console.log('faces', faces);
    let suits: string[] = cards.map(a => a[1]).sort();
    //console.log('suits', suits);
    this.counts = faces.reduce(this.count, {});
    //console.log('counts', this.counts);
    let duplicates: any[] = Object.values(this.counts).reduce(this.count, {}) as any[];
    let flush: boolean = suits[0] === suits[4];
    let first: number = faces[0].charCodeAt(0);
    //Also handle low straight
    let lowStraight = faces.join("") === "AJKLM";
    faces[0] = lowStraight ? "N" : faces[0];
    let straight: boolean = lowStraight || faces.every((f, index) => {
      //console.log(f.charCodeAt(0) - first, index);
      return f.charCodeAt(0) - first === index
    });
    //console.log('is straight' + straight);
    let rank =
      (flush && straight && 1) || (duplicates[4] && 2) || (duplicates[3] && duplicates[2] && 3) ||
      (flush && 4) || (straight && 5) || (duplicates[3] && 6) || (duplicates[2] > 1 && 7) || (duplicates[2] && 8) || 9;

    return {rank, value: faces.sort((a, b) => {
        let countDiff = this.counts[b] - this.counts[a];
        if (countDiff) return countDiff;

        return b > a ? -1 : b === a ? 0 : 1;
      }).join("")}
  }

  count(c: any, a: any) {
    c[a] = (c[a] || 0) + 1;
    return c;
  }

  compareHands(h1: string, h2: string) {
    let d1 = this.getHandDetails(h1);
    let d2 = this.getHandDetails(h2);

    //console.log(d1, d2);

    if (d1.rank === d2.rank) {
      if (d1.value < d2.value) {
        return "WIN"
      } else if (d1.value > d2.value) {
        return "LOSE"
      } else {
        return "DRAW"
      }
    }
    return d1.rank < d2.rank ? "WIN" : "LOSE";
  }

  openSettingsModal() {
    this.settingsModalOpen = true;
  }

  closeSettingsModal() {
    this.settingsModalOpen = false;
  }
}
