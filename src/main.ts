import './style.css';

const root = document.querySelector('#app');

const init = async () => {
  if (root) {
    root.innerHTML = '<h1>Async Race Initialized</h1>';
  }
};

init();