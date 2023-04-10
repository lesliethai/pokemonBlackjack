const InstructionsContent = ({ displayInstructions, setDisplayInstructions }) => {

  const handleClick = () => {
    setDisplayInstructions(!displayInstructions);
  }

  return (
    <div onClick={handleClick} className="instructionsParent">
      <div className="dialogueBoxWrapper instructions">
        <h2>How to play:</h2>
        <ul>
          <li>On game start, each player starts with two cards drawn. The goal of the game is to either reach a total sum of card values of 21 or have a score closest to 21, without going over.</li>
          <li><span className="controlSpan">Hit</span> - active player draws another card and adds it to their current hand</li>
          <li><span className="controlSpan">Stand</span> - stops the card draw and moves on to another player or ends the game</li>
        </ul>
      </div>
    </div>
  )
}

export default InstructionsContent;