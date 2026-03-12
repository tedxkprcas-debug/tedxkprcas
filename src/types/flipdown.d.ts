declare module 'flipdown' {
  interface FlipDownOptions {
    theme?: 'dark' | 'light';
    headings?: [string, string, string, string];
  }

  class FlipDown {
    constructor(timestamp: number, elementId?: string, options?: FlipDownOptions);
    start(): FlipDown;
    ifEnded(callback: () => void): FlipDown;
    version: string;
  }

  export default FlipDown;
}
