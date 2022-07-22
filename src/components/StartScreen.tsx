interface StartScreenProps {
    onStart: any
}

export function StartScreen(props: StartScreenProps) {
    return (
        <div className='w-10/12 mt-8 rounded-md bg-gray-700 border-gray-600 border mx-auto p-4'>
            <h1>Watch Your Legs</h1>
            <h3 className='text-zinc-300'>A game about leg risk</h3>
            <p className='text-justify'>You are trying to make a profit <strong>buying low and selling high</strong> on two different instruments. The two trades you need to make are called 'legs' in financial terminology.</p>
            <ol className='list-decimal list-inside text-justify space-y-2'>
                <li>Press <button disabled className='p-1 font-bold text-sm rounded-md bg-blue-500'>START</button> to start the game.</li>
                <li>Click the <button disabled className={`inline-block p-1 text-zinc-100 bg-gray-400 rounded-t-md font-bold`}>tabs</button> at the top to switch between instruments.</li>
                <li>Choose to either buy or sell on either instrument by pressing the <button disabled className='p-1 rounded-md bg-green-600 font-bold'>Buy</button> or <button disabled className='p-1 rounded-md bg-red-600 font-bold'>Sell</button> buttons. You will execute at the best bid/ask.</li>
                <li>Once you have bought or sold on one instrument, you have <span className='font-bold'>4 seconds</span> to do the opposite on the other instrument.</li>
                <li>If you fail to execute in time, or make a loss -  <strong>you lose</strong>. Try and get the highest profit possible.</li>
            </ol>
            <button onClick={props.onStart} className='mt-4 p-2 font-bold text-xl rounded-md bg-blue-500 hover:bg-blue-600'>START</button>
        </div>
    )
}