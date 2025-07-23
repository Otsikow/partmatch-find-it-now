import React from 'react';
import { render } from '@testing-library/react';
import { useNavigate }d from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import DashboardRouter from './DashboardRouter';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('DashboardRouter', () => {
  it('should redirect a seller to the seller dashboard', () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    const authContextValue = {
      user: { id: '123', user_metadata: { user_type: 'supplier' } },
      loading: false,
      profileLoading: false,
      userType: 'supplier',
    };

    render(
      <AuthContext.Provider value={authContextValue}>
        <DashboardRouter />
      </AuthContext.Provider>
    );

    expect(navigate).toHaveBeenCalledWith('/seller-dashboard');
  });
});
