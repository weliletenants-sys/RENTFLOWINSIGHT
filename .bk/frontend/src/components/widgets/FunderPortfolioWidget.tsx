import { useState, useEffect } from 'react';
import FunderPortfolioList from '../../funder/components/FunderPortfolioList';
import { getFunderPortfolios } from '../../services/funderApi';

export default function FunderPortfolioWidget() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFunderPortfolios()
      .then(res => {
        if (Array.isArray(res)) setPortfolios(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse bg-slate-100 h-64 rounded-xl w-full"></div>;
  }

  return <FunderPortfolioList portfolios={portfolios} />;
}
