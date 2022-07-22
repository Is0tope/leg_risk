import { SymbolAction, SymbolName, Side, WinState } from '../game/LegGame'

interface CompletedScreenProps {
    onRestart: any
    winState: WinState | undefined
    pnl: number
    actions: SymbolAction[]
    symbolAName: string
    symbolBName: string
}

export function CompletedScreen(props: CompletedScreenProps) {
    const pnlPayload = (
        <div>
            <div className='bg-gray-800 text-slate-50 p-2 mx-auto rounded-md text-lg font-mono text-left lg:text-center mt-4'>
                { props.actions.map((x: SymbolAction, i: number) => {
                    return (
                        <div key={i} className='w-full'>
                        &gt; {x.side === Side.Buy ? 'Bought' : 'Sold'} {x.symbol === SymbolName.A ? props.symbolAName : props.symbolBName} @ {x.price.toFixed(2)}
                        </div>
                    )
                })}
                <div className='w-full'>&gt; Your PnL is <strong>{props.pnl.toFixed(2)}</strong></div>
            </div>
        </div>
        
    )
    const timeoutPayload = (
        <div className='bg-gray-800 text-slate-50 p-2 mx-auto rounded-md text-lg font-mono text-left lg:text-center mt-4'>
            {'> You took too long :('}
        </div>
        )
    return (
        <div className='w-10/12 mt-8 rounded-md bg-gray-700 border-gray-600 border mx-auto p-4'>
            <h1 className='text-5xl'>You {props.winState === WinState.Won ? 'Won' : 'Lost'}!</h1>
            {props.winState === WinState.LostTimeout ? timeoutPayload : pnlPayload}
            <div className='mt-4 w-full'>
                For more information about leg risk, and how it is mitigated in real life, check out <a href="https://machow.ski/posts/watch_your_legs">this article</a>.
            </div>
            <button onClick={props.onRestart} className='mt-4 p-2 font-bold rounded-md bg-blue-500 hover:bg-blue-600'>Try Again</button>
        </div>
    )
}