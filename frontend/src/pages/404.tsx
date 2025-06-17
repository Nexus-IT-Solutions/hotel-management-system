import { Link } from 'react-router-dom';
import { Hotel, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto max-w-md">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          padding: '2rem 0',
        }}
      >
        <Hotel size={60} style={{ color: '#4796E3', marginBottom: '16px' }} />
        
        <h1 style={{ marginBottom: '16px', fontSize: '4rem',
          fontWeight: 'bold' 
        }}>
          404
        </h1>
        
        <h2 style={{ 
          marginBottom: '24px',
          fontSize: '1.75rem',
          fontWeight: 'bold'
        }}>
          Room Not Found
        </h2>
        
        <p style={{ 
          marginBottom: '32px', 
          maxWidth: '600px',
          fontSize: '1rem'
        }}>
          We apologize, but it seems you've wandered into a part of our hotel that doesn't exist.
          The room you're looking for might have been moved or is currently unavailable.
        </p>
        
        <Link to="/">
          <button 
            style={{
              backgroundColor: '#4796E3',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
