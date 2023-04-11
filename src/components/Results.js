const Results = ({ result, winner, playerOnePokemon, playerTwoPokemon, currentPlayer, gameStart}) => {

  // rendered as a result of comparing the hands of both players and winner

  return (
    <section className="results">
      <div className="dialogueBoxWrapper">
        <div className="resultsWording">
          {
            (currentPlayer !== 'none') && (winner === 'none')
              ? <p className="playerHighlight">{currentPlayer}'s turn!</p>
              : ''}
          {gameStart
            ? <p>{result}</p>
            : ''}

          {winner !== 'none'
            ? <p>
              {(winner === 'player one' && result !== 'Player one has fully evolved!')
                ? <><span className="playerHighlight">{playerOnePokemon.name}</span> is evolving!</>
                : (
                  (winner === 'player two' && result !== 'Player two has fully evolved!')
                    ? <><span className="playerHighlight">{playerTwoPokemon.name}</span> is evolving!</>
                    : ''
                )}
            </p>
            : null
          }
        </div>
      </div>
    </section>
  )
}

export default Results;