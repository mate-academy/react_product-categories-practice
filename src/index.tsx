import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { App } from './App';

const root = document.getElementById('root');

createRoot(root as HTMLDivElement)
  .render(<App />);
// p
//
