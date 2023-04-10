import InstructionsContent from "./InstructionsContent.js";

const Instructions = ({ gameState, quitHandler, startGameHandler, setDisplayInstructions, displayInstructions }) => {

  // on click, change state from false/true  
  const handleClick = () => {
    setDisplayInstructions(!displayInstructions);
  }

  return (
    <section className="instructionsContainer wrapper">

      {/* instructions: displays when state is set to true */}
      {
        displayInstructions
          ? <div onClick={handleClick}className="instructionsParent"><InstructionsContent gameState={gameState} quitHandler={quitHandler} startGameHandler={startGameHandler}/></div>
          : null
      }

      {/* disable button access if game has not started yet */}
      {
        gameState
        ? <>
            <button className="instructionsButton" onClick={() => { handleClick() }}>{
              displayInstructions
              ? 'x'
              : '?'
            }</button>
            <button onClick={gameState ? quitHandler : startGameHandler} className='quitBtn'>quit</button>
          </>
        : null
      }
      

    </section>
  )
}

export default Instructions;