import { useState, useEffect } from 'react';
import RentProgressCard from '../../tenant/components/RentProgressCard';
import { getTenantRentProgress } from '../../services/tenantApi';

export default function RentProgressWidget() {
  const [data, setData] = useState({
    amountPaid: 0,
    totalRent: 0,
    daysLeft: 0,
    remainingAmount: 0,
    currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  });

  useEffect(() => {
    getTenantRentProgress()
      .then(res => {
        if (res) setData(res);
      })
      .catch(console.error);
  }, []);

  return <RentProgressCard {...data} />;
}
