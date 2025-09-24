export class DropSelect {
  constructor({ options = ["unselected"] }) {
    this.set; // string or maybe index?
    this.options = options;
  }

  render() {
    return `
      <select class="drop-select">
        ${this.options.map(option => `<option value="${option}" ${this.set === option ? 'selected' : ''}>${option}</option>`).join('')}
      </select>
    `;
  }
}