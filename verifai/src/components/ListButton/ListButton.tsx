import React from 'react';
import '../components.css';

interface ListButtonProps {
    study_name: string;
    id: number;
    isSelected: boolean;
    onClick: () => void;
}

const ListButton: React.FC<ListButtonProps> = ({
    study_name,
    id,
    isSelected,
    onClick,
  }) => {
    return (
      <button
        className={isSelected ? 'listButton whiteBackground' : 'listButton transparentBackground'}
        onClick = {onClick}
      >
        <span className="study-name" style={{ textAlign: 'left' }}>{study_name}</span>
        <span className="id" style={{ textAlign: 'right' }}>Id: {id}</span>
      </button>
    );
  };
  
  export default ListButton;
    