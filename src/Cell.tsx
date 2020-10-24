import React, { useRef } from 'react';
import { useSnakeState } from './snake-context';

const Cell: React.FC<{ cellIndex: number, rowIndex: number }> = ({cellIndex, rowIndex}) => {
  const { snake, food } = useSnakeState();

  const className = useRef('');

  if (snake.some(([x, y]) => x === rowIndex && y === cellIndex)) {
    className.current = 'snake'
  } else if (food.some(([x, y]) => x === rowIndex && y === cellIndex)) {
    className.current = 'food'
  } else {
    className.current = '';
  }

  return <div className={`square ${className.current}`} />
}

export default Cell;