import { Sparklines, SparklinesLine } from 'react-sparklines'
import { Side } from '../game/LegGame'

interface SymbolProps {
    name: string
    prices: number[]
    last: number
    bid: number
    ask: number
    color: string
    onBuyOrSell: any
    hasBoughtOrSold: boolean
    hasBought: boolean
    hasSold: boolean
}

export function Symbol(props: SymbolProps) {
    return (
        <div className='w-full text-left py-4'>
            <h1 className='px-4'>{props.name}</h1>
            <div className='lg:px-4'>
                <Sparklines data={props.prices} limit={100}>
                    <SparklinesLine color={props.color} />
                    {/* <SparklinesSpots /> */}
                </Sparklines>
            </div>
            <div className='flex flex-row align-middle text-center text-2xl px-4'>
                <div className='basis-1/3 text-right'>Bid</div>
                <div className='basis-1/3 text-center'>Mid</div>
                <div className='basis-1/3 text-left'>Ask</div>
            </div>
            <div className='flex flex-row align-middle text-center mt-2 px-4'>
                <div className='basis-1/3 text-right text-xl lg:text-4xl text-green-500'>{props.bid.toFixed(2)}</div>
                <div className='basis-1/3 text-center text-2xl lg:text-5xl font-bold'>{props.last.toFixed(2)}</div>
                <div className='basis-1/3 text-left text-xl lg:text-4xl text-red-500'>{props.ask.toFixed(2)}</div>
            </div>
            <div className='flex flex-row align-middle text-center text-3xl items-center mt-4 px-4'>
                <div className='w-1/2 text-center p-2'>
                    <button disabled={props.hasBoughtOrSold || props.hasBought} onClick={() => props.onBuyOrSell(Side.Buy)} className='rounded-md bg-green-600 enabled:hover:bg-green-700 w-full p-2 disabled:opacity-40'>Buy</button>
                </div>
                <div className='w-1/2 text-center p-2 '>
                    <button disabled={props.hasBoughtOrSold || props.hasSold} onClick={() => props.onBuyOrSell(Side.Sell)} className='rounded-md bg-red-600 enabled:hover:bg-red-700 w-full p-2 disabled:opacity-40'>Sell</button>
                </div>
            </div>
        </div>
    )
}