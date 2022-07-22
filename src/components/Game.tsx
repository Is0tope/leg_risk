import { useEffect, useState } from 'react'
import { SymbolAction, SymbolName, LegGame, Side, WinState } from '../game/LegGame'
import { CompletedScreen } from './CompletedScreen'
import { Symbol } from './Symbol'
import { Modal } from './Modal'
import { StartScreen } from './StartScreen'
import { TabbedBrowser } from './TabbedBrowser'
import { Terminal } from './Terminal'

function generateFutureName(underlying: string, date: Date): string {
    const day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()
    if(day >= 24) {
        // If we are in december, need to roll to january the next year
        if(month === 11) {
            year++
        }
        month = (month + 1) % 12
    }
    return `${underlying}-24${(month + 1).toString().padStart(2,'0')}${(year % 100).toString().padStart(2,'0')}`
}

const game = new LegGame()
const SYMBOL_A = 'MEME/USD'
const SYMBOL_B = generateFutureName('MEME',new Date())

export function Game() {
    const [priceA,setPriceA] = useState(100)
    const [priceB,setPriceB] = useState(100)
    const [bidA,setBidA] = useState(0)
    const [askA,setAskA] = useState(0)
    const [bidB,setBidB] = useState(0)
    const [askB,setAskB] = useState(0)
    const [priceHistoryA,setPriceHistoryA] = useState([] as number[])
    const [priceHistoryB,setPriceHistoryB] = useState([] as number[])
    const [showInstructions,setShowInstructions] = useState(true)
    const [actions,setActions] = useState([] as SymbolAction[])
    const [hasBoughtOrSoldA,setHasBoughtOrSoldA] = useState(false)
    const [hasBoughtOrSoldB,setHasBoughtOrSoldB] = useState(false)
    const [hasBought,setHasBought] = useState(false)
    const [hasSold,setHasSold] = useState(false)
    const [winState,setWinState] = useState(undefined as (WinState | undefined))
    const [showCompleted,setShowCompleted] = useState(false)
    const [pnl,setPnl] = useState(0)
    const [selectTimeRemaining,setSelectTimeRemaining] = useState(0)


    useEffect(() => {
        updateState()
        const id = setInterval(() => {
            game.tick()
            updateState()
        },game.getMsPerTick())
        return () => clearInterval(id)
    },[])

    // Faster time for updating the countdown
    useEffect(() => {
        const id = setInterval(() => {
            setSelectTimeRemaining(game.getTimeSelectRemainingInMs())
        },100)
        return () => clearInterval(id)
    },[])

    function updateState() {
        setPriceA(game.getMidPrice(SymbolName.A))
        setBidA(game.getBidPrice(SymbolName.A))
        setAskA(game.getAskPrice(SymbolName.A))

        setPriceB(game.getMidPrice(SymbolName.B))
        setBidB(game.getBidPrice(SymbolName.B))
        setAskB(game.getAskPrice(SymbolName.B))

        setPriceHistoryA(game.getPriceHistory(SymbolName.A))
        setPriceHistoryB(game.getPriceHistory(SymbolName.B))
        setShowInstructions(game.isInstructions())
        setActions(game.getActions())
        setHasBoughtOrSoldA(game.hasBoughtOrSoldSymbol(SymbolName.A))
        setHasBoughtOrSoldB(game.hasBoughtOrSoldSymbol(SymbolName.B))
        setHasBought(game.hasBought())
        setHasSold(game.hasSold())
        setShowCompleted(game.isComplete())
        setWinState(game.getWinState())
        setPnl(game.getPnL())
        setSelectTimeRemaining(game.getTimeSelectRemainingInMs())
    }

    return (
        <div className='relative'>
            <TabbedBrowser names={[SYMBOL_A,SYMBOL_B]}>
                <Symbol 
                    name={SYMBOL_A}
                    last={priceA}
                    bid={bidA}
                    ask={askA}
                    prices={priceHistoryA}
                    color='#fbbf24'
                    hasBought={hasBought}
                    hasSold={hasSold}
                    hasBoughtOrSold={hasBoughtOrSoldA}
                    onBuyOrSell={(side: Side) => {
                        side === Side.Buy ? game.buy(SymbolName.A) : game.sell(SymbolName.A)
                        updateState()
                    }}
                />
                <Symbol 
                    name={SYMBOL_B}
                    last={priceB}
                    bid={bidB}
                    ask={askB}
                    prices={priceHistoryB}
                    color='#38bdf8'
                    hasBought={hasBought}
                    hasSold={hasSold}
                    hasBoughtOrSold={hasBoughtOrSoldB}
                    onBuyOrSell={(side: Side) => {
                        side === Side.Buy ? game.buy(SymbolName.B) : game.sell(SymbolName.B)
                        updateState()
                    }}
                />
            </TabbedBrowser>
            <div className='px-6'>
                <Terminal
                symbolAName={SYMBOL_A}
                symbolBName={SYMBOL_B}
                selectTimeRemaining={selectTimeRemaining}
                actions={actions}
                />
            </div>
            <div className='mt-4 text-center text-zinc-400'>
                Made by <a href="https://twitter.com/KrisMachowski">Kris Machowski</a>. Check out the <a href="https://machow.ski/posts/watch_your_legs">article</a> and the <a href="https://github.com/Is0tope/leg_risk">source code</a>.
            </div>
            <Modal visible={showInstructions}>
                <StartScreen onStart={() => {
                    game.start()
                    updateState()
                }}/>
            </Modal>
            <Modal visible={showCompleted}>
                <CompletedScreen
                    actions={actions}
                    winState={winState}
                    symbolAName={SYMBOL_A}
                    symbolBName={SYMBOL_B}
                    pnl={pnl}
                    onRestart={() => {
                        game.reset()
                        updateState()
                    }
                }/>
            </Modal>
        </div>
    )
}