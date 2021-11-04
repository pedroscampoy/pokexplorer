interface IFramework {
  Framework: string;
  Stars: number;
  Released: string;
}

export class Framework implements IFramework {
  Framework: string;
  Stars: number;
  Released: string;

  constructor(obj: Framework) {
    this.Framework = obj.Framework;
    this.Stars = obj.Stars;
    this.Released = obj.Released;
  }
}
