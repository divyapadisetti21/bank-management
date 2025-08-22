import React, { useState } from 'react';
import { useInactivityTimer } from '../hooks/useInactivityTimer';
import Header from './Header';
import Balance from './Balance';
import Summary from './Summary';
import Movements from './Movements';
import Transfer from './Transfer';
import Loan from './Loan';
import CloseAccount from './CloseAccount';

const Dashboard = () => {
  useInactivityTimer();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransaction = () => {
    setRefreshTrigger(prev => prev + 1); // triggers re-fetch in child components
  };

  return (
    <>
      <Header />
      <main className="dashboard">
        <div className="main-content">
          <Balance refreshTrigger={refreshTrigger} />
          <Summary refreshTrigger={refreshTrigger} />
          <Movements refreshTrigger={refreshTrigger} />
        </div>
        <aside className="sidebar">
          <Transfer onTransaction={handleTransaction} />
          <Loan onTransaction={handleTransaction} />
          <CloseAccount />
        </aside>
      </main>
    </>
  );
};

export default Dashboard;
