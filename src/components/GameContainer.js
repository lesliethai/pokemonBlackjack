import axios from 'axios';
import Player from './Player';
import Controller from './Controller';
import Instructions from './Instructions';
import InstructionsContent from './InstructionsContent';
import Results from './Results';
import { useState, useEffect } from 'react';


const GameContainer = () => {
  // state to track game start
  const [gameStart, setGameStart] = useState(false);
  
  // initialize state for displaying of instructions set to false  
  const [displayInstructions, setDisplayInstructions] = useState(false);
  
  // state for saving poke data to pass to player component as props
  const [pokemonPlayerOneFam, setPokemonPlayerOneFam] = useState([]);
  const [pokemonPlayerTwoFam, setPokemonPlayerTwoFam] = useState([]);
  const [pokemonPlayerOne, setPokemonPlayerOne] = useState([]);
  const [pokemonPlayerTwo, setPokemonPlayerTwo] = useState([]);
  
  // state to track card draw and player hand
  const [deck, setDeck] = useState([]);
  const [playerOneHand, setPlayerOneHand] = useState([]);
  const [playerTwoHand, setPlayerTwoHand] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('none');
  const [result, setResult] = useState('What would you like to do?');
  const [winner, setWinner] = useState('none');

  // array of available pokemon selection
  const pokemonPool = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
    [16, 17, 18],
    [29, 30, 31],
    [32, 33, 34],
    [43, 44, 45],
    [60, 61, 62],
    [63, 64, 65],
    [66, 67, 68],
    [69, 70, 71],
    [74, 75, 76],
    [92, 93, 94]
  ]

  const randomizer = (arrayOfPoke) => {
    const currentIndex = Math.floor(Math.random() * arrayOfPoke.length);
    return arrayOfPoke[currentIndex]
  }

  let pokeFam = randomizer(pokemonPool);
  let pokeFam2 = randomizer(pokemonPool);

  // check to make sure pokeFam and PokeFam2 have different pokemon if not randomize for pokeFam2 again
  while (pokeFam2.some(pokemon => pokeFam.includes(pokemon))) {
    pokeFam2 = randomizer(pokemonPool);
  }

  useEffect(() => {

    // API CALLS FOR PLAYER 1 
    const urlEndpointsP1 = [
      `https://pokeapi.co/api/v2/pokemon/${pokeFam[0]}`,
      `https://pokeapi.co/api/v2/pokemon/${pokeFam[1]}`,
      `https://pokeapi.co/api/v2/pokemon/${pokeFam[2]}`
    ];

    const requestsP1 = urlEndpointsP1.map((url) => axios.get(url));

    Promise.all(requestsP1).then((responses) => {
      const pokemonPlayerOneFam = responses.map((res) => ({
        name: res.data.name,
        url: res.data.sprites.front_default,
      }));

      setPokemonPlayerOneFam(pokemonPlayerOneFam);
      setPokemonPlayerOne(pokemonPlayerOneFam[0]);

    }).catch((error) => {
      console.log(error, 'error fetching data')
    });


    // API CALLS FOR PLAYER 2 
    const urlEndpointsP2 = [
      `https://pokeapi.co/api/v2/pokemon/${pokeFam2[0]}`,
      `https://pokeapi.co/api/v2/pokemon/${pokeFam2[1]}`,
      `https://pokeapi.co/api/v2/pokemon/${pokeFam2[2]}`
    ];

    const requestsP2 = urlEndpointsP2.map((url) => axios.get(url));

    Promise.all(requestsP2).then((responses) => {

      const pokemonPlayerTwoFam = responses.map((res) => ({
        name: res.data.name,
        url: res.data.sprites.front_default,
      }));

      setPokemonPlayerTwoFam(pokemonPlayerTwoFam);
      setPokemonPlayerTwo(pokemonPlayerTwoFam[0]);


    }).catch((error) => {
      console.log(error, 'error fetching data')
    });


  }, [gameStart]);

  // deck of cards api call
  useEffect(() => {

    axios({
      url: `https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`,
      method: `get`,
      dataResponse: `json`
    }).then((res) => {
      axios({
        url: `https://www.deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=52`,
        method: `get`,
        dataResponse: `json`
      }).then((response) => {
        setDeck(response.data.cards);
      }).catch((err) => {
        console.log('error', err.message);
      })
    })
  }, [gameStart]);

  // initalize current deck
  const currentDeck = deck;

  // function to clear game board
  const clearGame = () => {
    setPlayerOneHand([]);
    setPlayerTwoHand([]);
    setResult('What would you like to do?');
    setWinner('none');
  }

  // button to start game and generate initial pokemon/cards
  const startGameHandler = () => {
    setGameStart(!gameStart);
    setCurrentPlayer('Player one');

    const check = currentDeck.splice(0, 2);
    const check2 = currentDeck.splice(0, 2);

    setPlayerOneHand(hand => [...hand, check]);
    setPlayerTwoHand(hand => [...hand, check2]);
  }
  //

  // function to calculate score of cards in hand
  const cardScore = (cardSum) => {
    let score = 0;

    const faceCards = ['QUEEN', 'KING', 'JACK'];
    const updatedDeck = cardSum.flatMap(item => item)

    // provided numerical values to face cards
    for (let cards of updatedDeck) {
      const cardsInt = parseInt(cards.value);

      if (faceCards.includes(cards.value)) {
        score = score + 10;
      }
      else if (cards.value.includes('ACE')) {
        if (score <= 10) {
          score = score + 11
        } else (score++)
      }
      else (score += cardsInt);
    }
    return score
  }
  //

  // tally the score of each player and pass to player components in the return as props
  const scoreValue = cardScore(playerOneHand);
  const scoreTwoValue = cardScore(playerTwoHand)

  // if player1/player2 get 21, pass turn to other player
  // if score is above 21, that player busts and the other player wins
  useEffect(() => {
    const checkScore = () => {

      if (scoreValue === 21) {
        setCurrentPlayer('Player two');
        setWinner('none');
        setResult('Player one has blackjack! Player two has a chance to draw to 21.');
      } else if (scoreTwoValue === 21) {
        setCurrentPlayer('Player one');
        setWinner('none')
        setResult('Player two has blackjack! Player one has a chance to draw to 21.')
      }

      if (scoreValue > 21) {
        setResult(`Player two wins! Player one busted!`);
        setWinner('player two');
      } else if (scoreTwoValue > 21) {
        setResult(`Player one wins! Player two busted!`);
        setWinner('player one');
      }
    }
    checkScore();
  }, [playerOneHand, playerTwoHand]);

  // stay handler
  const stayHandler = () => {
    //if pressed by playerTwo, compare player scores and pass winner to results for results to display the evolving pokemon
    //if pressed by playerOne, setCurrentPlayer(playerTwo)
    if (currentPlayer === 'Player two') {
      if (scoreValue < scoreTwoValue) {
        setCurrentPlayer('none');
        setWinner('player two');
        setResult('Player two wins! Their card score is closer to 21.');
      } else if (scoreValue > scoreTwoValue) {
        setCurrentPlayer('none');
        setWinner('player one');
        setResult('Player one wins! Their card score is closer to 21.');
      }
      else if (scoreTwoValue === scoreValue) {
        setCurrentPlayer('none');
        setWinner('tie');
        setResult(`It's a tie!`);
      }
    } else { setCurrentPlayer(currentPlayer === 'Player one' ? 'Player two' : 'Player one'); }
  }
  //

  // handleClick functions that will be passed to our Controller.js buttons as props
  // on click, add card to player's hand, based on current player
  const hitHandler = () => {
    const check = currentDeck.splice(0, 1);

    if (currentPlayer === 'Player one') {
      setPlayerOneHand(hand => [...hand, check]);
    } else if (currentPlayer === 'Player two') {
      setPlayerTwoHand(hand => [...hand, check]);
    }
  }

  const evolve = () => {
    if (winner === 'player one' && pokemonPlayerOneFam.length >= 1) {
      const newOneFam = pokemonPlayerOneFam.slice(1);
      setPokemonPlayerOne(newOneFam[0]);
      setPokemonPlayerOneFam(newOneFam);
    } else if (winner === 'player two' && pokemonPlayerTwoFam.length >= 1) {
      const newTwoFam = pokemonPlayerTwoFam.slice(1);
      setPokemonPlayerTwo(newTwoFam[0]);
      setPokemonPlayerTwoFam(newTwoFam);
    }

    clearGame();
    setCurrentPlayer('Player one');
    const check = currentDeck.splice(0, 2);
    const check2 = currentDeck.splice(0, 2);
    setPlayerOneHand(hand => [...hand, check]);
    setPlayerTwoHand(hand => [...hand, check2]);
  }


  useEffect(() => {
    if (pokemonPlayerOneFam.length === 1) {
      setResult('Player one has fully evolved!');
      setWinner('player one');
    } else if (pokemonPlayerTwoFam.length === 1) {
      setResult('Player two has fully evolved!');
      setWinner('player two');
    }
  }, [pokemonPlayerOneFam, pokemonPlayerTwoFam]);

  // quit the current hand - resets player and game play states
  const quitHandler = () => {
    clearGame();
    setGameStart(false);
    setDisplayInstructions(false);
    setCurrentPlayer('none');
  }
  //

  return (
    <main>
      <Instructions gameState={gameStart} quitHandler={quitHandler} startGameHandler={startGameHandler} setDisplayInstructions={setDisplayInstructions} displayInstructions={displayInstructions} />

      {gameStart
        ? 
          <>
            {/* when game state is true, render Controller component*/}
            <section className='controller'>
              <div className='wrapper'>
                <Results result={result} winner={winner} playerOnePokemon={pokemonPlayerOne} playerTwoPokemon={pokemonPlayerTwo} currentPlayer={currentPlayer} gameStart={gameStart} quitHandler={quitHandler} evolve={evolve} />
                <Controller hitButton={hitHandler} stayButton={stayHandler} winner={winner} result={result} quitHandler={quitHandler} evolve={evolve} />
              </div>
            </section>

            <section className='players'>
              <div className='wrapper'>
                <ul className='playerUl'>
                  <li className="playerOneUl">
                    <p className={
                      currentPlayer === 'Player one'
                      ? 'playerLabel currentPlayerHighlight'
                      : 'playerLabel'}>player one</p>
                    <div className="playerContainer">
                      <Player pokeData={pokemonPlayerOne} cardData={playerOneHand} cardScore={scoreValue} />
                    </div>
                  </li>
                  <li className="playerTwoUl">
                    <p className={
                      currentPlayer === 'Player two'
                      ? 'playerLabel currentPlayerHighlight'
                      : 'playerLabel'}>player two</p>
                    <div className="playerContainer">
                      <Player pokeData={pokemonPlayerTwo} cardData={playerTwoHand} cardScore={scoreTwoValue} />
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </>
        : <InstructionsContent gameState={gameStart} quitHandler={quitHandler} startGameHandler={startGameHandler}/>
      }

    </main>
  );
}


export default GameContainer;