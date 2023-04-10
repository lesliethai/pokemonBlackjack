const Controller = ({ hitButton, stayButton, winner, result, quitHandler, evolve }) => {

  return (
    <ul className="controls">
      {
        winner !== 'none'
          ? <li>
            <button
              onClick={(result === ('Player one has fully evolved!')) || (result === ('Player two has fully evolved!'))
                ? quitHandler
                : evolve} disabled={winner === 'none'}>
              {
                (result === ('Player one has fully evolved!')) || (result === ('Player two has fully evolved!'))
                  ? 'play again'
                  : 'evolve'
              }
            </button>
          </li>
          : <>
            <li>
              <button onClick={hitButton} disabled={winner !== 'none'}>Hit</button>
            </li>
            <li>
              <button onClick={stayButton} disabled={winner !== 'none'}>Stay</button>
            </li>
          </>
      }
    </ul>
  )
}

export default Controller;