import FileUpload from '@/components/FileUpload';
import PageTitle from '@/components/PageTitle';
import CustomerAddCard from './components/CustomerAddCard';
import AddCustomer from './components/AddCustomer';
import { Col, Row } from 'react-bootstrap';
export const metadata = {
  title: 'Customers Add'
};
const CustomerAddPage = () => {
  return <>
      <PageTitle title="Customers Add" subName="Real Estate" />
      <Row>
        <CustomerAddCard />
        
      </Row>
    </>;
};
export default CustomerAddPage;