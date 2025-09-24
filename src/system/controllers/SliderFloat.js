export class SliderFloat {
  constructor({ min = 0, max = 10 }) {
    this.set; // float
    this.min = min;
    this.max = max;
  }

  render() {
    return `
      <input type="range" min="${this.min}" max="${this.max}" value="${this.set || this.min}" step="0.01" class="slider">
      <span class="slider-value">${this.set || this.min}</span>
    `;
  }
}