let renderer = () => {};
export function connectRenderer(nextRenderer) {
  renderer = nextRenderer;
}
export function render() {
  renderer();
}
