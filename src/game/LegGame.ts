import { TwoLegPriceProcess } from './TwoLegPriceProcess'

export enum GameState {
    Instructions = 'Instructions',
    NoneSelected = 'NoneSelected',
    BuySelected = 'BuySelected',
    SellSelected = 'SellSelected',
    Completed = 'Completed'
}

export enum SymbolName {
    A = 'A',
    B = 'B'
}

export enum Side {
    Buy = 'Buy',
    Sell = 'Sell'
}

export interface SymbolAction {
    symbol: SymbolName
    side: Side
    price: number
}

export enum WinState {
    Won = 'Won',
    LostProfit = 'LostProfit',
    LostTimeout = 'LostTimeout'
}

export class LegGame {
    private _state!: GameState
    private _seed!: string
    private _priceProcess!: TwoLegPriceProcess
    private _buySymbol: SymbolName | undefined
    private _buyPrice: number | undefined
    private _sellSymbol: SymbolName | undefined
    private _sellPrice: number | undefined
    private _priceHistory: Map<SymbolName,number[]>
    private _actions!: SymbolAction[]
    private _winState!: WinState | undefined
    private _selectTick: number | undefined
    private _selectTime: number | undefined
    private _selectTimeRemaining!: number
    private _ticks!: number

    // Config
    private _ticksUntilTimeout = 8
    private _msPerTick = 500
    private _preTicks: number = 100

    constructor() {
        this._priceHistory = new Map()
        this.reset()
    }

    tick() {
        if(this.isRunning()) {
            this._priceProcess.tick()
            this._priceHistory.get(SymbolName.A)!.push(this._priceProcess.getInstrumentAPrice())
            this._priceHistory.get(SymbolName.B)!.push(this._priceProcess.getInstrumentBPrice())
            this.assessTimeout()
            this.assessWin()
            this._ticks++
        }
    }

    preTick() {
        for(let i = 0;i < this._preTicks;i++) {
            this._priceProcess.tick()
            this._priceHistory.get(SymbolName.A)!.push(this._priceProcess.getInstrumentAPrice())
            this._priceHistory.get(SymbolName.B)!.push(this._priceProcess.getInstrumentBPrice())
            this._ticks++
        }
    }

    // State checks
    hasBought() {
        return this._buySymbol !== undefined
    }

    hasSold() {
        return this._sellSymbol !== undefined
    }

    hasBoughtOrSoldSymbol(symbol: SymbolName): boolean {
        return this._buySymbol === symbol || this._sellSymbol === symbol
    }

    isComplete() {
        return this._state === GameState.Completed
    }

    isRunning() {
        return [GameState.NoneSelected,GameState.BuySelected,GameState.SellSelected].includes(this._state)
    }

    isInstructions() {
        return this._state === GameState.Instructions
    }

    // State changes
    start() {
        if(!this.isInstructions()) {
            throw new Error(`Cannot start when state is ${this._state}`)
        }
        this._state = GameState.NoneSelected
    }

    buy(symbol: SymbolName) {
        if(![GameState.NoneSelected,GameState.SellSelected].includes(this._state)) {
            throw new Error(`Cannot buy when state is ${this._state}`)
        }
        if(this.hasBought()) {
            throw new Error(`Already bought ${this._buySymbol}`)
        }
        if(symbol === this._sellSymbol) {
            throw new Error(`Cannot buy and sell on the same symbol`)
        }
        this._buySymbol = symbol
        this._buyPrice = this.getAskPrice(symbol)
        this._actions.push({
            symbol: symbol,
            side: Side.Buy,
            price: this._buyPrice
        })
        if(this.hasSold()) {
            this._state = GameState.Completed
        } else {
            this._state = GameState.BuySelected
            this._selectTick = this._ticks
            this._selectTime = (new Date()).getTime()
        }
        this.assessWin()
    }

    sell(symbol: SymbolName) {
        if(![GameState.NoneSelected,GameState.BuySelected].includes(this._state)) {
            throw new Error(`Cannot sell when state is ${this._state}`)
        }
        if(this.hasSold()) {
            throw new Error(`Already sold ${this._sellSymbol}`)
        }
        if(symbol === this._buySymbol) {
            throw new Error(`Cannot buy and sell on the same symbol`)
        }
        this._sellSymbol = symbol
        this._sellPrice = this.getBidPrice(symbol)
        this._actions.push({
            symbol: symbol,
            side: Side.Sell,
            price: this._sellPrice
        })
        if(this.hasBought()) {
            this._state = GameState.Completed
        } else {
            this._state = GameState.SellSelected
            this._selectTick = this._ticks
            this._selectTime = (new Date()).getTime()
        }
        this.assessWin()
    }

    reset() {
        this._seed = Math.round(Math.random() * 1_000_000_000).toString()
        this._priceProcess = new TwoLegPriceProcess({
            seed: this._seed
        })
        this._state = GameState.Instructions
        this._buySymbol = undefined
        this._buyPrice = undefined
        this._sellSymbol = undefined
        this._sellPrice = undefined
        this._priceHistory.set(SymbolName.A,[])
        this._priceHistory.set(SymbolName.B,[])
        this._actions = []
        this._winState = undefined
        this._selectTick = undefined
        this._selectTime = undefined
        this._selectTimeRemaining = 0
        this._ticks = 0

        this.preTick()
    }

    // Getters
    getMidPrice(symbol: SymbolName): number {
        return symbol === SymbolName.A ? this._priceProcess.getInstrumentAPrice() : this._priceProcess.getInstrumentBPrice()
    }

    getBidPrice(symbol: SymbolName): number {
        return symbol === SymbolName.A ? this._priceProcess.getInstrumentABid() : this._priceProcess.getInstrumentBBid()
    }

    getAskPrice(symbol: SymbolName): number {
        return symbol === SymbolName.A ? this._priceProcess.getInstrumentAAsk() : this._priceProcess.getInstrumentBAsk()
    }

    getPriceHistory(symbol: SymbolName): number[] {
        return this._priceHistory.get(symbol)!
    }

    getActions(): SymbolAction[] {
        return this._actions
    }

    getWinState(): WinState | undefined {
        return this._winState
    }

    getPnL(): number {
        return this._sellPrice! - this._buyPrice!
    }

    getMsPerTick(): number {
        return this._msPerTick
    }

    getTimeSelectRemainingInMs(): number {
        const msInTimeout = this._ticksUntilTimeout * this._msPerTick
        if(this._selectTime === undefined) {
            return msInTimeout
        }
        if(this.isRunning()) {
            const now = (new Date()).getTime()
            this._selectTimeRemaining = Math.max((this._selectTime + msInTimeout) - now,0)
        }
        return this._selectTimeRemaining
    }

    // Internal
    private assessWin() {
        if(this.isComplete()) {
            if(this._ticks >= this._selectTick! + this._ticksUntilTimeout) {
                this._winState = WinState.LostTimeout
                return
            }
            if(this.getPnL() > 0) {
                this._winState = WinState.Won
            } else {
                this._winState = WinState.LostProfit
            }
        }
    }

    private assessTimeout() {
        if(this.hasBought() || this.hasSold()) {
            if(this._ticks >= this._selectTick! + this._ticksUntilTimeout) {
                this._state = GameState.Completed
            }
        }
    }
}