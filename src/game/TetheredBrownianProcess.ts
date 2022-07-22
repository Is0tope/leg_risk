import Alea from 'alea'

interface TetheredBrownianProcessArgs {
    tetheredValue: number
    maxDeflection: number
    velocityDecay?: number
    deflection: number
    seed: string
}

export default class TetheredBrownianProcess {
    private _tetheredValue: number
    private _value: number
    private _velocity: number
    private _velocityDecay: number
    private _seed: string
    private _prng: any
    private _maxDeflection: number
    private _minValue: number
    private _maxValue: number
    private _deflection: number

    constructor(args: TetheredBrownianProcessArgs) {
        this._seed = args.seed
        this._prng = Alea(this._seed)
        this._tetheredValue = args.tetheredValue
        this._value = this._tetheredValue
        this._maxDeflection = args.maxDeflection
        this._minValue = this._value - this._maxDeflection
        this._maxValue = this._value + this._maxDeflection
        this._deflection = args.deflection
        this._velocity = 0
        this._velocityDecay = args.velocityDecay || 0.8
    }

    getValue(): number {
        return this._value
    }

    getSeed(): string {
        return this._seed
    }

    tick() {
        // Tick the rng to get the current change
        const change = (2 * this._prng() - 1)
        // (sort of) Hooke's Law to pullback towards the tether
        let pullback = -(this._value - this._tetheredValue) / this._maxDeflection
        pullback *= Math.abs(pullback) // Squared
        // Update the value (divide by two to normalise)
        this._value += this._deflection * (change + pullback) / 2
        // Add on any velocity
        this._value += this._velocity
        // Decay the velocity
        this._velocity *= this._velocityDecay
        // Cap to the maximum & minimum
        this._value = Math.max(Math.min(this._value,this._maxValue),this._minValue)
    }

    kick(amount: number) {
        this._velocity += amount
    }
}