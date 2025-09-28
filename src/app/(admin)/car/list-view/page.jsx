import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardHeader, Col, Row } from 'react-bootstrap';
import AgentList from './components/AgentList';
export const metadata = {
  title: 'Cars List'
};
const ListViewPage = () => {
  return <>
      <PageTitle subName="Real Estate" title="Cars List" />
      
      <AgentList />
    </>;
};
export default ListViewPage;


