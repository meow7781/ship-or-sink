declare module "howler" {
  export class Howl {
    constructor(options: {
      src: string[]
      volume?: number
      preload?: boolean
      html5?: boolean
    })

    play(): number
    stop(): this
  }

  export const Howler: {
    stop(): void
    volume(): number
    volume(volume: number): number
  }
}
