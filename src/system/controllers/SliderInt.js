export class SliderInt {
  constructor({ min = 0, max = 10 }) {
    this.set; // int
    this.min = min;
    this.max = max;
  }

  render() {
    return `
      <div class="slider-container">
        <input type="range" min="${this.min}" max="${this.max}" value="${this.set || this.min}" class="slider">
        <span class="slider-value">${this.set || this.min}</span>
      </div>
    `;
  }
}