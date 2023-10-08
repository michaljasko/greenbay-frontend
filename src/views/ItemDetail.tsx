import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { getItemById, buyItem } from "../redux/slices/itemSlice";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";

interface Item {
	id: number;
	name: string;
	description: string;
	price: number;
	photo: string | null;
	seller: string;
	buyer: string;
  }

const ItemDetail: React.FC = () => {
	const { itemId = "" } = useParams<{ itemId: string }>();
	const dispatch = useDispatch<AppDispatch>();

	const [item, setItem] = useState<Item>();

  const username = localStorage.getItem("username");
  const money = parseInt(localStorage.getItem("money") || "0");

	useEffect(() => {
		if (itemId && !item) {
			dispatch(getItemById(itemId)).then((response) => {
				setItem(response.payload as Item);
			});
		}
	}, [setItem, dispatch, item, itemId]);

	if (!item) {
		return <div>Loading...</div>;
	}

  const handleBuyItem = (id: string, price:number): void => {
		dispatch(buyItem({id: id, price: price})).then((_response) => {
      if (username) {
        const updatedItem = { ...item, buyer: username };
        setItem(updatedItem);
      }
		});
  };

	const getImageUrl = (item: Item): string => {
		if (item.photo) {
			return item.photo;
		}
		return "https://via.placeholder.com/800";
	};

	return (
		<>
			<div className="p-3 mt-5">
				<h1 className="text-center text-decoration-underline">
					{item.name}
				</h1>
				<Card className="mt-5">
					<div className="row">
						<div className="col-12 col-md-6 col-lg-5">
							<Card.Img
								variant="top"
								src={getImageUrl(item)}
								alt={item.name}
								style={{ height: "100%", objectFit: "cover" }}
							/>
						</div>
						<div className="col-12 col-md-6 col-lg-7 d-flex flex-column">
							<Card.Body className="d-flex flex-column">
								<Card.Text
									className="mt-0 mt-md-3"
									style={{ whiteSpace: "pre-line" }}
								>
									{item.description}
								</Card.Text>
								<Card.Text>Seller: {item.seller}</Card.Text>
								<Card.Text>Buyer: {item.buyer ? item.buyer : "-"}</Card.Text>
								<Card.Text>Price: {item.price} $</Card.Text>
								<Card.Text>Available money: {money} $</Card.Text>
								<div className="mt-auto ms-auto">
									{!item.buyer && item.seller !== username && item.price <= money && (
										<button
											type="button"
											className="btn btn-warning me-1"
											onClick={() => handleBuyItem(item.id.toString(), item.price)}
										>
											Buy item!
										</button>
									)}
									{item.buyer && item.seller !== username && (
										<button
											type="button"
											className="btn btn-danger me-1"
											disabled
										>
											Already sold!
										</button>
									)}
									{!item.buyer && item.seller !== username && item.price > money && (
										<button
											type="button"
											className="btn btn-danger me-1"
											disabled
										>
											Not enough money!
										</button>
									)}
								</div>
							</Card.Body>
						</div>
					</div>
				</Card>
			</div>
		</>
	);
};

export default ItemDetail;
