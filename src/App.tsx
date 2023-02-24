import React, { useMemo, useState } from 'react';
import logo from './Substantive_RGB.png';
import './App.css';
import { useQuery } from 'react-query';
import { getClientInteractions } from './api';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Col, Container, Row } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// import '@styles/react/libs/tables/react-dataTable-component.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

type DataRow = {
  date: string;
  name: string;
  sector_id: string;
};

// const Interaction
const columns: TableColumn<DataRow>[] = [
  {
    name: 'Sector ID',
    cell: (row) => row.sector_id
    // sortable: true
  },
  {
    name: 'Name',
    cell: (row) => row.name
    // sortable: true
  },
  {
    name: 'Date',
    cell: (row) => row.date
  }
];

//custom hook
const getArrayFromObject = (obj: any, value: string) => {
  const arr: any = [];
  obj.forEach((item: any) => {
    arr.push(item[value]);
  });
  return arr;
};

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Queries
  const interactionsQuery = useQuery('clientInt', getClientInteractions);
  const interactionsData = interactionsQuery?.data?.result;

  //Sector ID Counter
  const totalSectorData = useMemo(() => {
    const SectorObject: any = [];
    for (let i = 1; i < 12; i++) {
      const sectorTotal: any = interactionsData?.filter((item: any) => item.sector_id === String(i));
      SectorObject.push({ sector_id: i, count: sectorTotal?.length, name: sectorTotal?.[0].name });
    }
    // console.log(SectorObject);

    return SectorObject.length > 0 && SectorObject;
  }, [interactionsData]);

  // Values by Sectors
  // const sectors = getArrayFromObject(totalSectorData, 'sector_id');
  const counts = getArrayFromObject(totalSectorData, 'count');
  const names = getArrayFromObject(totalSectorData, 'name');

  const apexDonutOpts: ApexOptions = {
    chart: {
      type: 'donut'
    },
    colors: [
      '#727cf5',
      '#5d9999',
      '#cd5c5c',
      '#b0c4de',
      '#20b2aa',
      '#f4a460',
      '#9370db',
      '#3cb371',
      '#f08080',
      '#6495ed',
      '#dc143c'
    ],
    legend: {
      show: true,
      position: 'bottom'
    },
    labels: names,
    responsive: [
      {
        breakpoint: 1405,
        options: {
          chart: {
            width: 330
          }
        }
      },
      {
        breakpoint: 989,
        options: {
          chart: {
            width: '400'
          }
        }
      },
      {
        breakpoint: 376,
        options: {
          chart: {
            width: 330
            // height: 330
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(interactionsData.length / rowsPerPage));

    // ** Function in get data on page change
    const handlePagination: any = (page: any) => {
      setCurrentPage(page.selected + 1);
    };

    return (
      <ReactPaginate
        previousLabel='<'
        breakLabel='...'
        nextLabel='>'
        pageCount={count || 1}
        activeClassName='active'
        activeLinkClassName='bg-dark text-white border-dark'
        pageLinkClassName={'page-link text-dark '}
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item '}
        nextLinkClassName={'page-link  text-dark'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link  text-dark'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pe-1 text-dark'}
      />
    );
  };

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return interactionsData?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, interactionsData]);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
      </header>
      {/* <body> */}
      <Container>
        {interactionsQuery?.status === 'loading' ? (
          <p>Loading....</p>
        ) : (
          <Row className='cardContainer mt-sm-4 p-2'>
            <Col className='cardView py-4 px-4'>
              <h4 className='mt-2 text-left mb-4'>Client Interactions</h4>
              <DataTable
                noHeader
                sortServer
                pagination
                responsive
                paginationServer
                className='react-dataTable'
                columns={columns}
                paginationComponent={CustomPagination}
                data={currentTableData}
              />
            </Col>
            <Col className='cardView py-4 px-4'>
              <Row className='mt-auto'>
                <h4 className='mb-4 mt-2 '> Interactions by Sectors</h4>
                {totalSectorData.length <= 0 ||
                  (totalSectorData.length === undefined && <p className='mt-6'>No Data</p>)}
                <Col xs={12} md={6} className='d-flex flex-column justify-content-center align-items-center'>
                  <Chart options={apexDonutOpts} series={counts} type='donut' width='400' labels={names} />
                </Col>

                <Col xs={12} md={6}>
                  <div className='chart-widget-list mt-xs-4'>
                    {totalSectorData.map((int: any, i: number) => (
                      <p key={i}>
                        <i className='mdi mdi-square text-primary'></i>
                        {/* Sector ID */}
                        <span>
                          {/* {' '}
                          {i + 1} {'  '}  */}
                          {int.name}
                        </span>
                        <span className='float-end'>{int.count}</span>
                      </p>
                    ))}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Container>
      {/* </body> */}
    </div>
  );
}

export default App;
