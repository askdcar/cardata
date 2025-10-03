import FileUpload from '@/components/FileUpload';
import PageTitle from '@/components/PageTitle';

import { Col, Row } from 'react-bootstrap';
import LogoPage from './components/CustomerAddCard';
export const metadata = {
  title: 'Customers Add'
};
const CustomerAddPage = () => {
  return <>
      <PageTitle title="Customers Add" subName="Real Estate" />
      <Row>
        <LogoPage />
        
      </Row>
    </>;
};
export default CustomerAddPage;