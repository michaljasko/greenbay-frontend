import React, { useEffect, useState } from "react";
import { Row, Col, Card, Pagination } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../redux/slices/itemSlice";
import { RootState, AppDispatch } from "../redux/store";
import settings from "../settings";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  photo: string | null;
  seller: string;
  buyer: string;
}

export const ItemList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const items = useSelector((state: RootState) => state.items.items);

  useEffect(() => {
    dispatch(getItems());
  }, [dispatch]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 6;
  const totalPages: number = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentItems: Item[] = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  const getImageUrl = (item: Item): string => {
    if (item.photo) {
      return settings.baseApiUrl + item.photo;
    }
    return "https://via.placeholder.com/800";
  };

  return (
    <Row className="p-3">
      <Col xs={12} className="mt-5">
        <h1 className="text-center">Items for sale</h1>
      </Col>
      {currentItems.map((item: Item, index: number) => (
        <Col md={6} lg={4} key={index} className="mt-4">
          <Card className="h-100">
            <Card.Img
              variant="top"
              src={getImageUrl(item)}
              alt={item.name}
              style={{ height: "100%", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text style={{ height: "80px", overflow: "auto" }}>
                {item.description}
              </Card.Text>
              <Card.Text>
                Price: {item.price} $
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
      <Col md={{ span: 8, offset: 2 }} xl={{ span: 6, offset: 3 }}>
        <Pagination className="my-5 justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Pagination.Item
                key={page}
                active={currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Pagination.Item>
            )
          )}
        </Pagination>
      </Col>
    </Row>
  );
};

export default ItemList;
