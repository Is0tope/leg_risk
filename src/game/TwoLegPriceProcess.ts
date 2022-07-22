import Alea from 'alea'
import TetheredBrownianProcess from './TetheredBrownianProcess'

interface TwoLegPriceProcessArgs {
    seed: string
}

export class TwoLegPriceProcess {
    private _seed: string
    private _prng: any
    private _underlyingProcess: TetheredBrownianProcess
    private _instrumentAOffsetProcess: TetheredBrownianProcess
    private _instrumentBOffsetProcess: TetheredBrownianProcess
    private _instrumentASpreadProcess: TetheredBrownianProcess
    private _instrumentBSpreadProcess: TetheredBrownianProcess

    // Config
    private _underlyingKickSize = 1
    private _spreadKickSize = 0.1
    private _kickProbability = 0.1
    private _tickSize = 0.01

    constructor(args: TwoLegPriceProcessArgs) {
        this._seed = args.seed

        this._prng = Alea(this._seed)
        this._underlyingProcess = new TetheredBrownianProcess({
            seed: this._prng().toString(),
            deflection: 1,
            maxDeflection: 50,
            tetheredValue: 100
        })

        this._instrumentAOffsetProcess = new TetheredBrownianProcess({
            seed: this._prng().toString(),
            deflection: 0.1,
            maxDeflection: 3,
            tetheredValue: 0
        })

        this._instrumentBOffsetProcess = new TetheredBrownianProcess({
            seed: this._prng().toString(),
            deflection: 0.2,
            maxDeflection: 5,
            tetheredValue: 0
        })

        this._instrumentASpreadProcess = new TetheredBrownianProcess({
            seed: this._prng().toString(),
            deflection: 0.02,
            maxDeflection: 0.1,
            tetheredValue: 0
        })

        this._instrumentBSpreadProcess = new TetheredBrownianProcess({
            seed: this._prng().toString(),
            deflection: 0.02,
            maxDeflection: 0.1,
            tetheredValue: 0
        })
    }

    getUnderlyingPrice(): number {
        return this.roundToTick(this._underlyingProcess.getValue())
    }

    getInstrumentAPrice(): number {
        return this.roundToTick(this._underlyingProcess.getValue() + this._instrumentAOffsetProcess.getValue())
    }

    getInstrumentBPrice(): number {
        return this.roundToTick(this._underlyingProcess.getValue() + this._instrumentBOffsetProcess.getValue())
    }

    getInstrumentABid(): number {
        return this.roundToTick(this.getInstrumentAPrice() - Math.abs(this._instrumentASpreadProcess.getValue()))
    }

    getInstrumentAAsk(): number {
        return this.roundToTick(this.getInstrumentAPrice() + Math.abs(this._instrumentASpreadProcess.getValue()))
    }

    getInstrumentBBid(): number {
        return this.roundToTick(this.getInstrumentBPrice() - Math.abs(this._instrumentBSpreadProcess.getValue()))
    }

    getInstrumentBAsk(): number {
        return this.roundToTick(this.getInstrumentBPrice() + Math.abs(this._instrumentBSpreadProcess.getValue()))
    }

    tick() {
        // If we get lucky, kick the price a bit
        if(this._prng() <= this._kickProbability) {
            this._underlyingProcess.kick(this._underlyingKickSize * this._prng() - 0.5 * this._underlyingKickSize)
            const basis = this._instrumentBOffsetProcess.getValue() - this._instrumentAOffsetProcess.getValue()
            const spread = Math.sign(basis) * this._prng() * this._spreadKickSize
            this._instrumentAOffsetProcess.kick(spread)
            this._instrumentBOffsetProcess.kick(-spread)
        }
        this._underlyingProcess.tick()
        this._instrumentAOffsetProcess.tick()
        this._instrumentBOffsetProcess.tick()
        this._instrumentASpreadProcess.tick()
        this._instrumentBSpreadProcess.tick()
    }

    kick(amount: number) {
        this._underlyingProcess.kick(amount)
    }
    
    private roundToTick(x: number): number {
        return Math.round(x / this._tickSize) * this._tickSize
    }
}