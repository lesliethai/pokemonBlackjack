const Controller = ({ hitButton, stayButton, winner, result, quitHandler, evolve }) => {

  return (
    <ul className="controls">
      {
        winner !== 'none'
          ? <li>
            {
              (result === ('Player one has fully evolved!') || result === ('Player two has fully evolved!'))
              ? <button onClick={quitHandler}>play again</button>
              : <button onClick={evolve}>evolve</button>
            }
          </li>
          : <>
            <li>
              <button className='actionBtn' onClick={hitButton} disabled={winner !== 'none'}>Hit</button>
            </li>
            <li className="actionOr">or</li>
            <li>
              <button className='actionBtn' onClick={stayButton} disabled={winner !== 'none'}>Stay</button>
            </li>
          </>
      }
    </ul>
  )
}

export default Controller;