enum Rank {HighCard, Pair, TwoPair, ThreeOfAKind, Straight, Flush, FullHouse, FourOfAKind, StraightFlush, RoyalFlush};
enum Suit {Spades, Hearts, Clubs, Diamonds};
enum Num {Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King, Ace};
enum Action {Fold, Check, Call, Raise};

function makeReadable(hand: Hand): any {
    let handCards: any = [];
    for(let i: number=0;i<5;i++){
        handCards.push({num: Num[hand.cards[i].num], suit: Suit[hand.cards[i].suit]});
    }
    return {cards: handCards, rank: Rank[hand.rank], sum: hand.sum};
}

class Card {
    num: Num;
    suit: Suit;
    constructor(num: Num, suit: Suit){
        this.num = num;
        this.suit = suit;
    }
}

function getWinner(players: Array<Player>): Array<number> {
    let winners: Array<number> = [0];
    let winner: number = 0;
    for(let i: number=1;i<players.length;i++){
        if(players[i].hand.rank > players[winner].hand.rank || (players[i].hand.rank == players[winner].hand.rank && players[i].hand.sum > players[winner].hand.sum)){
            winner = i;
            winners = [i];
        }else if(players[i].hand.rank == players[winner].hand.rank && players[i].hand.sum == players[winner].hand.sum){
            winners.push(i);
        }
    }
    return winners;
}

function calcHand(cards: Array<Card>): [[Card, Card, Card, Card, Card], Rank] {
    cards.sort((a,b)=>{
        if(a.num > b.num){
            return -1;
        }else if(a.num < b.num){
            return 1;
        }else{
            return 0
        }
    });
    let emptyCard: Card = new Card(0, 0);
    let bestCards: [Card, Card, Card, Card, Card] = [emptyCard, emptyCard, emptyCard, emptyCard, emptyCard];
    let suits: [number, number, number, number] = [0, 0, 0, 0]; //Spades, Hearts, Clubs, Diamonds
    let nums: [number, number, number, number, number, number, number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let has: Array<number> = [];
    let rank: Rank = Rank.HighCard;
    for(let i: number=0;i<cards.length;i++){
        suits[cards[i].suit]++;
        nums[cards[i].num]++;
        if(!has.includes(cards[i].num)){
            has.push(cards[i].num);
        }
    }
    let row4index: Array<number> = [];
    let suitflush: number = 0;
    if(nums[12] && nums[11] && nums[10] && nums[9] && nums[8]) row4index.push(12);
    else if(nums[11] && nums[10] && nums[9] && nums[8] && nums[7]) row4index.push(11);
    else if(nums[10] && nums[9] && nums[8] && nums[7] && nums[6]) row4index.push(10);
    else if(nums[9] && nums[8] && nums[7] && nums[6] && nums[5]) row4index.push(9);
    else if(nums[8] && nums[7] && nums[6] && nums[5] && nums[4]) row4index.push(8);
    else if(nums[7] && nums[6] && nums[5] && nums[4] && nums[3]) row4index.push(7);
    else if(nums[6] && nums[5] && nums[4] && nums[3] && nums[2]) row4index.push(6);
    else if(nums[5] && nums[4] && nums[3] && nums[2] && nums[1]) row4index.push(5);
    else if(nums[4] && nums[3] && nums[2] && nums[1] && nums[0]) row4index.push(4);
    else if(nums[3] && nums[2] && nums[1] && nums[0] && nums[12]) row4index.push(3);
    if(suits[Suit.Spades]>=5) suitflush=Suit.Spades;
    else if(suits[Suit.Hearts]>=5) suitflush=Suit.Hearts;
    else if(suits[Suit.Clubs]>=5) suitflush=Suit.Clubs;
    else if(suits[Suit.Diamonds]>=5) suitflush=Suit.Diamonds;
    if(row4index.length != 0){
        let rowindex: number = row4index[0];
        rank = Rank.Straight;
        if(suitflush != 0){
            for(let i: number=0;i<cards.length;i++){
                if(cards[i].suit != suitflush){
                    while(row4index.length != 0 || (cards[i].num <= row4index[0] && cards[i].num>=((row4index[0] == 3) ? 12 : row4index[0]-4))){
                        row4index.shift();
                    }
                }
            }
            if(row4index.length != 0){
                rank = Rank.StraightFlush;
                if(row4index[0] == 12){
                    rank = Rank.RoyalFlush;
                }
                if(row4index[0] != 3){
                    let j: number = 0;
                    for(let i: number = 0;i<cards.length;i++){
                        if(row4index[0]-j == cards[i].num && cards[i].suit == suitflush){
                            bestCards[j++] = cards[i];
                            if(j==5){
                                break;
                            }
                        }
                    }
                }else{
                    let j: number=0;
                    for(let i: number = 1;i<cards.length;i++){
                        if((row4index[0]-j == cards[i].num && cards[i].suit == suitflush) || (cards[i].num==Num.Ace && cards[i].suit == suitflush)){
                            bestCards[j++] = cards[i];
                            if(j==5){
                                break;
                            }
                        }
                    }
                }
                return [bestCards, rank];
            }else{
                rank = Rank.Flush;
                let j: number = 0;
                for(let i: number = 0;i<cards.length;i++){
                    if(suitflush == cards[i].suit){
                        bestCards[j++] = cards[i];
                        if(j==5){
                            break;
                        }
                    }
                }
            }
        }else{
            let j: number = 0;
            if(rowindex == 3){
                j++;
                for(let i: number = 0;i<cards.length;i++){
                    if(4-j == cards[i].num){
                        bestCards[j++] = cards[i];
                        if(j==4){
                            break;
                        }
                    }
                }
                bestCards[0] = cards[0];
            }else{
                for(let i: number = 0;i<cards.length;i++){
                    if(rowindex-j == cards[i].num){
                        bestCards[j++] = cards[i];
                        if(j==5){
                            break;
                        }
                    }
                }
            }
        }
    }else{
        if(suitflush != 0){
            rank = Rank.Flush;
            let j: number = 0;
            for(let i: number = 0;i<cards.length;i++){
                if(suitflush == cards[i].suit){
                    bestCards[j++] = cards[i];
                    if(j==5){
                        break;
                    }
                }
            }
        }
    }
    if(rank < Rank.StraightFlush){ //Check FH & FOK & TOK & TP & P
        if(has.length <= 6){
            let f3p: boolean = false;
            let f3pp: number[] = [];
            let f2p: boolean = false;
            let f2pp: number[] = [];
            let fokn: number = 0;
            for(let i: number=0;i<has.length;i++){
                if(nums[has[i]] == 4){
                    rank = Rank.FourOfAKind;
                    fokn = has[i];
                    let j: number = 0;
                    for(let i: number = 0;i<cards.length;i++){
                        if(j==0 || fokn >= cards[i].num){
                            bestCards[j++] = cards[i];
                            if(j==5){
                                break;
                            }
                        }
                    }
                    return [bestCards, rank];
                }else if(nums[has[i]] == 3){
                    f3p = true;
                    f3pp.push(has[i]);
                }else if(nums[has[i]] == 2){
                    f2p = true;
                    f2pp.push(has[i]);
                }
            }
            if(f3p && f2p || f3pp.length==2){
                f3pp.sort((a, b)=>{return b-a;});
                f2pp.sort((a, b)=>{return b-a;});
                rank = Rank.FullHouse;
                let j: number = 0;
                for(let i: number = 0;i<cards.length;i++){
                    if((f3pp.length == 2 && f3pp.includes(cards[i].num)) || (f3pp[0] == cards[i].num || f2pp[0] == cards[i].num)){
                        bestCards[j++] = cards[i];
                        if(j==5){
                            break;
                        }
                    }
                }
                return [bestCards, rank];
            }
            if(rank < Rank.Straight){
                if(f3p){
                    rank = Rank.ThreeOfAKind;
                    let j: number = 0;
                    for(let i: number = 0;i<cards.length;i++){
                        if(j<2 || f3pp[0] >= cards[i].num){
                            bestCards[j++] = cards[i];
                            if(j==5){
                                break;
                            }
                        }
                    }
                    return [bestCards, rank];
                }
                if(f2pp.length >= 2){
                    f2pp.sort((a, b)=>{return b-a;});
                    rank = Rank.TwoPair;
                    let j: number = 0;
                    for(let i: number = 0;i<cards.length;i++){
                        if(f2pp[0] == cards[i].num || f2pp[1] >= cards[i].num || j==0){
                            bestCards[j++] = cards[i];
                            if(j==5){
                                break;
                            }
                        }
                    }
                    return [bestCards, rank];
                }
                if(f2p){
                    rank = Rank.Pair;
                    let j: number = 0;
                    for(let i: number = 0;i<cards.length;i++){
                        if(f2pp[0] >= cards[i].num || j < 3){
                            bestCards[j++] = cards[i];
                            if(j==5){
                                break;
                            }
                        }
                    }
                    return [bestCards, rank];
                }
            }
        }
    }
    if(rank == Rank.HighCard){
        let j: number = 0;
        for(let i: number = 0;i<cards.length;i++){
            bestCards[j++] = cards[i];
            if(j==5){
                break;
            }
        }
    }
    return [bestCards, rank];
}

/*function calculateRank(cards: [Card, Card, Card, Card, Card]): Rank{
    let suits: [number, number, number, number] = [0, 0, 0, 0]; //Spades, Hearts, Clubs, Diamonds
    let nums: [number, number, number, number, number, number, number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let has: Array<number> = [];
    let rank: Rank = Rank.H;
    for(let i: number=0;i<5;i++){
        suits[cards[i].suit]++;
        nums[cards[i].num]++;
        if(!has.includes(cards[i].num)){
            has.push(cards[i].num);
        }
    }
    if(suits[Suit.Spades]==5 || suits[Suit.Hearts]==5 || suits[Suit.Clubs]==5 || suits[Suit.Diamonds]==5){ //Check RF, SF, F
        rank = Rank.F;
        if(cards[1].num == cards[2].num+1 && cards[2].num == cards[3].num+1 && cards[3].num == cards[4].num+1){
            if(cards[0].num == cards[1].num+1 || cards[4].num-1 == cards[0].num-12){
                rank = Rank.SF;
                if(cards[1].num == Num.k){
                    rank = Rank.RF;
                }
            } 
        }
    }
    if(rank < Rank.SF){ //Check FH & FOK
        if(has.length == 2){
            rank = Rank.FH;
            if(nums[has[0]] == 4 || nums[has[1]] == 4){
                rank = Rank.FOK;
            }
        }
    }
    if(rank < Rank.F){ //Check S && TOK && TP && P
        if(cards[1].num == cards[2].num+1 && cards[2].num == cards[3].num+1 && cards[3].num == cards[4].num+1){
            if(cards[0].num == cards[1].num+1 || cards[4].num == cards[0].num+1){
                rank = Rank.S;
            } 
        }else if(has.length == 3){
            if(has[0] == 3 || has[1] == 3 || has[2] == 3){
                rank = Rank.TOK
            }else{
                rank = Rank.TP;
            }
        }else if(has.length == 4){
            rank = Rank.P;
        }
    }
    return rank;
}*/

class Hand{
    cards: [Card, Card, Card, Card, Card];
    dealt: Array<Card>;
    rank: Rank;
    sum: number;
    constructor(){
        this.dealt = new Array<Card>(2);
    }
    setDealt(dealt: Array<Card>){
        this.dealt = dealt;
    }
    newCards(cards: Array<Card>){
        [this.cards, this.rank] = calcHand(this.dealt.concat(cards));
        this.sum = this.cards[0].num+this.cards[1].num+this.cards[2].num+this.cards[3].num+this.cards[4].num;
    }
}

class Deck{
    deck: Array<Card>;
    currentDeck: Array<Card>;
    constructor(){
        this.deck = []; 
        for(let i:number = 0;i<4;i++){
            for(let j:number = 0;j<13;j++){
                this.deck.push(new Card(j, i));
            }
        }
    }
    shuffle(){
        this.currentDeck = new Array<Card>(52);
        for(let i:number=51;i>0;i--){
            let rand: number = Math.floor(Math.random() * (i+1));
            this.currentDeck[i] = this.deck[rand];
            this.deck[rand] = this.deck[i];
            this.deck[i] = this.currentDeck[i];
        }
        this.currentDeck = this.deck.slice(0);
    }
    giveCards(amount: number=2): Array<Card> {
        let cards: Array<Card> = [];
        for(let i:number=0;i<amount;i++) cards.push(this.currentDeck.shift());
        return cards;
    }
}

class Player{
    chips: number;
    inPot: number;
    out: boolean;
    curOut: boolean;
    curBet: number;
    hand: Hand;
    constructor(chips: number = 0){
        this.chips = chips;
        this.out = (chips == 0);
        this.curOut = this.out;
        this.inPot = 0;
        this.curBet = 0;
        this.hand = new Hand();
    }
    sitOut(){
        this.inPot = 0;
        this.out = true;
        this.curOut = true;
    }
    sitIn(){
        this.out = false;
    }
    bet(betSize: number): number{
        let betAmount: number = (this.chips >= betSize) ? betSize : this.chips;
        this.chips -= betAmount;
        this.inPot += betAmount;
        this.curBet += betAmount;
        return betAmount;
    }
    fold(){
        this.curBet = 0;
        this.inPot = 0;
        this.curOut = true;
    }
}

class Game{
    players: Array<Player>;
    playerCount: number;
    pot: number;
    bb: number;
    sb: number;
    sbp: number;
    bbp: number;
    outCount: number;
    betInit: number;
    gotInput: number;
    betSize: number;
    button: number;
    currentPlayer: number;
    playerNum: number;
    curPlayers: Array<Player>;
    gameDeck: Deck;
    table: Array<Card>;
    constructor(maxPlayerCount: number, smallBlind: number, bigBlind: number, ...balance: number[]){
        this.button = -1;
        this.bb = bigBlind;
        this.sb = smallBlind
        this.playerCount = maxPlayerCount;
        this.players = Array<Player>(maxPlayerCount);
        while(balance.length < maxPlayerCount) balance.push(0);
        for(let i: number=0;i<maxPlayerCount;i++){    
            this.players[i] = new Player(balance[i]);
        }
        this.gameDeck = new Deck();
    }
    addPlayer(bal: number){
        this.players.push(new Player(bal));
        this.playerCount++;
    }
    newRound(): number{
        this.outCount = 0;
        this.betInit = 0;
        this.betSize = 0;
        this.pot = 0;
        this.playerNum = 0;
        this.curPlayers = [];
        this.players.forEach((player)=>{
            if(player.chips > 0 && player.out == false){
                player.curOut = false;
                this.playerNum++;
                player.curBet = 0;
                this.curPlayers.push(player);
            }
        });
        if(this.playerNum == 0){
            return -1;
        }
        this.button++;
        this.button = this.button % this.playerNum;
        if(this.playerCount == 2){
            this.sbp = this.button;
            this.bbp = this.button+1;
            this.currentPlayer = this.button;
        }else{
            this.sbp = (this.button+1)%this.playerNum;
            this.bbp = (this.button+2)%this.playerNum;
            this.currentPlayer = (this.button+3)%this.playerNum;
        }
        this.pot += this.curPlayers[this.sbp].bet(this.sb);
        this.pot += this.curPlayers[this.bbp].bet(this.bb);
        this.betSize = this.bb;
        this.betInit = this.bbp;
        this.table = [];
        this.gameDeck.shuffle();
        for(let i: number=0;i<this.playerNum;i++){
            this.curPlayers[i].hand.setDealt(this.gameDeck.giveCards(2)); 
        }

        return this.currentPlayer;
    }
    playerInput(index: number, decision: number[]): number{
        if(index == this.currentPlayer){
            switch(decision[0]){
                case Action.Fold:
                    this.curPlayers[index].fold();
                    while(1){
                        this.currentPlayer = (this.currentPlayer+1)%this.playerNum;
                        if(!this.curPlayers[this.currentPlayer].curOut) break;
                    }
                    this.outCount++;
                    if(this.betInit == this.currentPlayer){
                        return 0;
                    }
                    return 1;
                case Action.Check:
                    if(this.curPlayers[index].curBet == this.betSize){
                        while(1){
                            this.currentPlayer = (this.currentPlayer+1)%this.playerNum;
                            if(!this.curPlayers[this.currentPlayer].curOut) break;
                        }
                        if(this.betInit == this.currentPlayer){
                            return 0;
                        }
                        return 1;
                    }
                    return -1;
                case Action.Call:
                    this.pot += this.curPlayers[index].bet(this.betSize - this.curPlayers[index].curBet);
                    while(1){
                        this.currentPlayer = (this.currentPlayer+1)%this.playerNum;
                        if(!this.curPlayers[this.currentPlayer].curOut) break;
                    }
                    if(this.betInit == this.currentPlayer){
                        return 0;
                    }
                    return 1;
                case Action.Raise:
                    if(this.curPlayers[index].chips > 0){
                        let inc: number = this.curPlayers[index].bet(decision[1]+this.betSize - this.curPlayers[index].curBet);
                        this.betInit = index;
                        this.betSize = inc;
                        this.pot += inc;
                        while(1){
                            this.currentPlayer = (this.currentPlayer+1)%this.playerNum;
                            if(!this.curPlayers[this.currentPlayer].curOut) break;
                        }
                        return 1;
                    }
            }
            return -1;
        }
    }
    nextPart(n: number=1): boolean{
        this.table = this.table.concat(this.gameDeck.giveCards(n));
        for(let i: number=0;i<this.playerNum;i++){ 
            if(!this.curPlayers[i].curOut){
                this.curPlayers[i].curBet = 0;
                this.curPlayers[i].hand.newCards(this.table);
            }
        }
        if(this.outCount > this.playerNum-2){
            return false;
        }
        this.currentPlayer = (this.button+1)%this.playerNum;
        while(this.curPlayers[this.currentPlayer].curOut){
            this.currentPlayer = (this.currentPlayer+1)%this.playerNum;
        }
        this.betInit = this.currentPlayer;
        this.betSize = 0;
        return true;
    }
    checkWinner(){
        let winners: number[] = getWinner(this.curPlayers);
        let prize: number = this.pot/winners.length; //Prize
        for(let i:number = 0;i<this.playerNum;i++){
            this.curPlayers[i].inPot = 0;
            if(this.curPlayers[i].curOut){
                this.curPlayers[i].hand.rank = 0;
                this.curPlayers[i].hand.sum = 0;
            }
        }
        for(let i:number = 0;i<winners.length;i++){
            this.curPlayers[winners[i]].chips += prize;
        }
        console.log(makeReadable(this.players[getWinner(this.players)[0]].hand));
    }
    getPlayerBalance(index: number): number{
        return this.players[index].chips;
    }
}



let c: number = 5;
let myGame: Game = new Game(5, 25, 50, 5000, 5000, 5000, 5000, 5000);
let bl: boolean = false;
while(c--){
    let cp: number = myGame.newRound();
    if(cp == -1){
        break;
    }
    
    let commands: any[] = [[
        [Action.Call], [Action.Call], [Action.Call], [Action.Call], [Action.Check]
    ],[
        [Action.Check], [Action.Check], [Action.Check], [Action.Check], [Action.Check]
    ],[
        [Action.Check], [Action.Check], [Action.Check], [Action.Check], [Action.Check]
    ],[
        [Action.Check], [Action.Check], [Action.Check], [Action.Check], [Action.Check]
    ]];


    let z: number=0;
    while(1){
        if(myGame.playerInput(myGame.currentPlayer, commands[0][z++]) == 0){
            break;
        }
    }
    z=0;
    if(myGame.nextPart(3)){
        while(1){
            if(myGame.playerInput(myGame.currentPlayer, commands[1][z++]) == 0){
                break;
            }
        }
    }
    z=0;
    if(myGame.nextPart()){
        while(1){
            if(myGame.playerInput(myGame.currentPlayer, commands[2][z++]) == 0){
                break;
            }
        }
    }
    z=0;
    if(myGame.nextPart()){
        while(1){
            if(myGame.playerInput(myGame.currentPlayer, commands[3][z++]) == 0){
                break;
            }
        }
    }
    myGame.checkWinner();
}
console.log(myGame.getPlayerBalance(0));
console.log(myGame.getPlayerBalance(1));
console.log(myGame.getPlayerBalance(2));
console.log(myGame.getPlayerBalance(3));
console.log(myGame.getPlayerBalance(4));
