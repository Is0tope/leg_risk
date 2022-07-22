import { SymbolAction, SymbolName, Side } from '../game/LegGame'

interface TerminalProps {
    symbolAName: string
    symbolBName: string
    actions: SymbolAction[]
    selectTimeRemaining: number
}

export function Terminal(props: TerminalProps) {
    return (
        <div className='bg-gray-700 text-slate-50 p-2 text-left w-full rounded-md h-32 text-lg font-mono'>
            { props.actions.map((x: SymbolAction, i: number) => {
                return (
                    <div key={i} className='w-full'>
                        &gt; {x.side === Side.Buy ? 'Bought' : 'Sold'} {x.symbol === SymbolName.A ? props.symbolAName : props.symbolBName} @ {x.price.toFixed(2)}
                    </div>
                )
            })}
            { props.actions.length > 0 && 
            <div className='w-full text-gray-300'>
                &gt; Time remaining to enter other leg: {(props.selectTimeRemaining / 1000).toFixed(3)}s
            </div>}
        </div>
    )
}