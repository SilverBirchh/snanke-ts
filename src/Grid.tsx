import React, { useCallback, useEffect } from 'react';
import { useSnakeDispatch, useSnakeState } from './snake-context';
import Row from './Row';

export const Grid: React.FC = () => {
  const { grid, hasWon } = useSnakeState();

  const dispatch = useSnakeDispatch();

  const move = useCallback(
    (event) => {
      dispatch({ type: 'CHANGE_DIRECTION', direction: event.key.toUpperCase() });
    },
    [dispatch]
  );

  useEffect(() => {
    if (hasWon !== null) {
      return;
    }
    const interval = setInterval(() => dispatch({ type: 'MOVE' }), 100);
    return () => clearInterval(interval);
  }, [dispatch, hasWon]);

  useEffect(() => {
    document.addEventListener("keydown", move);

        return () => document.removeEventListener("keydown", move);
  }, [dispatch, move]);

  return (
    <div>
      {grid.map((row, index) => (
        <Row key={index} row={row} rowIndex={index} />
      ))}
    </div>
  );
};
