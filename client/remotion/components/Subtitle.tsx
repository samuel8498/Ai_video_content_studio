import React from 'react';

export interface SubtitleProps {
  text: string;
  progress: number;
}

export const Subtitle: React.FC<SubtitleProps> = ({ text, progress }) => {
  const words = (text || '').split(' ');
  const activeWordIdx = Math.min(words.length - 1, Math.floor(progress * words.length));

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 50,
        left: 40,
        right: 40,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
          border: '1px solid rgba(139, 92, 246, 0.6)',
          borderRadius: 22,
          padding: '18px 30px',
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 'bold',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
          maxWidth: 800,
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}
      >
        {words.map((word, idx) => (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              margin: '0 4px',
              color: idx === activeWordIdx ? '#FCD34D' : '#E5E7EB',
              transform: idx === activeWordIdx ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.15s ease-out',
              textDecoration: idx === activeWordIdx ? 'underline' : 'none'
            }}
          >
            {word}{' '}
          </span>
        ))}
      </div>
    </div>
  );
};
