import React from 'react';
import Cell from './Cell';

const Row: React.FC<{ row: Array<null>; rowIndex: number }> = ({
  row,
  rowIndex,
}) => {
  return (
    <div key={rowIndex} className="row">
      {row.map((cell, cellIndex) => (
        <Cell
          key={`${rowIndex}-${cellIndex}`}
          cellIndex={cellIndex}
          rowIndex={rowIndex}
        />
      ))}
    </div>
  );
};


export default Row;