import React, { useContext, createContext, useReducer } from 'react';
import rfdc from 'rfdc';

const clone = rfdc();

export type DIRECTION = 'ARROWRIGHT' | 'ARROWLEFT' | 'ARROWUP' | 'ARROWDOWN';

type Actions =
  | { type: 'MOVE' }
  | { type: 'CHANGE_DIRECTION'; direction: DIRECTION }
  | { type: 'RESTART' };

export type Dispatch = (action: Actions) => void;

interface Game {
  gridSize: number;
  grid: Array<Array<null>>;
  snake: Array<[number, number]>;
  food: Array<[number, number]>;
  hasWon: boolean | null;
  direction: DIRECTION;
  isChangingDirection: boolean;
}

const FORBIDDEN_DIRECTIONS = {
  ARROWRIGHT: 'ARROWLEFT',
  ARROWUP: 'ARROWDOWN',
  ARROWDOWN: 'ARROWUP',
  ARROWLEFT: 'ARROWRIGHT',
};

const GRID_SIZE: number = 20;

const initalState: Game = {
  gridSize: GRID_SIZE,
  grid: Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null)),
  snake: [
    [5, 5],
    [5, 6],
  ],
  food: [[1, 2]],
  hasWon: null,
  direction: 'ARROWRIGHT',
  isChangingDirection: false,
};

const SnakeStateContext = createContext(initalState);
const SnakeDispatchContext = createContext<Dispatch | undefined>(undefined);

function isOutOfBounds(n: number): boolean {
  return n < 0 || n > GRID_SIZE - 1;
}

function hitBody(snake: Array<Array<number>>): boolean {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i][0] === snake[0][0] && snake[i][1] === snake[0][1]) {
      return true;
    }
  }

  return false;
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomFood(): [number, number] {
  return [getRandomInt(GRID_SIZE), getRandomInt(GRID_SIZE)];
}

function move(oldState: Game): Game {
  const state: Game = clone(oldState);

  if (
    isOutOfBounds(state.snake[0][0]) ||
    isOutOfBounds(state.snake[0][1]) ||
    hitBody(state.snake)
  ) {
    state.hasWon = true;
    return state;
  }

  const [x, y] = state.snake[0];
  const [fx, fy] = state.food[0];

  const hasEaten = x === fx && y === fy;

  if (hasEaten) {
    state.snake.push([0, 0]);
    state.food = [randomFood()];
  }

  let newHead: [number, number];

  switch (state.direction) {
    case 'ARROWRIGHT':
      newHead = [x, y + 1];
      break;
    case 'ARROWLEFT':
      newHead = [x, y - 1];
      break;
    case 'ARROWUP':
      newHead = [x - 1, y];
      break;
    case 'ARROWDOWN':
      newHead = [x + 1, y];
      break;
    default:
      throw new Error('Unknown direction');
  }

  state.snake = [newHead, ...state.snake.slice(0, state.snake.length - 1)];
  state.isChangingDirection = false;

  return state;
}

const SnakeReducer = (state: Game, action: Actions): Game => {
  switch (action.type) {
    case 'MOVE':
      return move(state);
    case 'CHANGE_DIRECTION':
      if (
        FORBIDDEN_DIRECTIONS[state.direction] === action.direction ||
        state.isChangingDirection
      ) {
        return state;
      }
      return {
        ...state,
        direction: action.direction,
        isChangingDirection: true,
      };
    case 'RESTART':
      return initalState;
    default:
      throw new Error('Unknown state');
  }
};

export const SnakeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(SnakeReducer, initalState);

  return (
    <SnakeStateContext.Provider value={state}>
      <SnakeDispatchContext.Provider value={dispatch}>
        {children}
      </SnakeDispatchContext.Provider>
    </SnakeStateContext.Provider>
  );
};

export const useSnakeState = (): Game => {
  const context = useContext(SnakeStateContext);
  if (context === undefined) {
    throw new Error('useSnakeState must be used within a SnakeProvider');
  }
  return context;
};

export const useSnakeDispatch = (): React.Dispatch<Actions> => {
  const context = useContext(SnakeDispatchContext);
  if (context === undefined) {
    throw new Error('useSnakeState must be used within a SnakeProvider');
  }
  return context;
};
