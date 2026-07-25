import React from 'react';

export interface SceneHeaderProps {
  sceneNumber: number;
  cameraMotion?: string;
  title?: string;
}

export const SceneHeader: React.FC<SceneHeaderProps> = ({ sceneNumber, cameraMotion = 'KenBurns', title }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 35,
        left: 35,
        right: 35,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          border: '1px solid rgba(139, 92, 246, 0.5)',
          borderRadius: 30,
          padding: '10px 24px',
          color: '#A78BFA',
          fontWeight: 'bold',
          fontSize: 15,
          fontFamily: 'sans-serif'
        }}
      >
        SCENE #{sceneNumber} • MOTION: {cameraMotion.toUpperCase()}
      </div>

      {title && (
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            border: '1px solid rgba(236, 72, 153, 0.5)',
            borderRadius: 30,
            padding: '10px 24px',
            color: '#F472B6',
            fontWeight: 'extrabold',
            fontSize: 15,
            fontFamily: 'sans-serif'
          }}
        >
          🎬 {title}
        </div>
      )}
    </div>
  );
};
