import React from 'react';
import './App.css';
import { Grid } from './Grid';
import { SnakeProvider } from './snake-context';

const App: React.FC = () => {
  return (
    <main className="center">
      <SnakeProvider>
        <Grid />
      </SnakeProvider>
    </main>
  );
};

export default App;
