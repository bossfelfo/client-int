import React, { useEffect, useState } from 'react';
import logo from './Substantive_RGB.png';
import './App.css';
import { useQuery } from 'react-query';
import { getClientInteractions } from './api';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Col, Container, Row } from 'reactstrap';
import ReactPaginate from 'react-paginate';

// import '@styles/react/libs/tables/react-dataTable-component.scss';

type DataRow = {
  date: string;
  name: string;
  sector_id: number;
};

const columns: TableColumn<DataRow>[] = [
  {
    name: 'Sector ID',
    selector: (row) => row.sector_id
  },
  {
    name: 'Name',
    selector: (row) => row.name
  },
  {
    name: 'Date',
    selector: (row) => row.date
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [clientInt, setClientInt] = useState([]);
  const rowsPerPage = 10;

  useEffect(() => {
    setClientInt(clientInt);
  }, [clientInt]);

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(clientInt.length / rowsPerPage));

    // ** Function in get data on page change
    const handlePagination: any = (page: any) => {
      setCurrentPage(page.selected + 1);
    };

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
      />
    );
  };

  // Queries
  const interactionsQuery = useQuery('clientInt', getClientInteractions);
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
      </header>
      <body>
        <Container>
          <h4 className='text-left'>Client Interaction</h4>
          <Row>
            <Col>
              <DataTable
                noHeader
                subHeader
                sortServer
                pagination
                responsive
                paginationServer
                className='react-dataTable'
                columns={columns}
                paginationComponent={CustomPagination}
                data={interactionsQuery.data as DataRow[]}

                // }
              />
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </body>
    </div>
  );
}

export default App;
