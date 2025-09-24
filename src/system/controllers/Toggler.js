export class Toggle {
  constructor() {
    this.set; // bool
  }

  render() {
    return `
      <label class="toggle-switch">
        <input type="checkbox" ${this.set ? 'checked' : ''}>
        <span class="toggle-slider"></span>
      </label>
    `;
  }
}
