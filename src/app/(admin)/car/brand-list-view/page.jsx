import PageTitle from '@/components/PageTitle';
import BrandList from './Components/AgentData';
export const metadata = {
  title: 'Agent Grid'
};
const GridViewPage = () => {
  return <>
      <PageTitle subName="Real Estate" title="Agent Grid" />
      
      <BrandList />
    
    </>;
};
export default GridViewPage;