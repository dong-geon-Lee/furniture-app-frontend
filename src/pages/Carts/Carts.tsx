import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  decreasePrice,
  getItems,
  totalCart,
} from "../../store/features/carts/cartsSlice";

import axios from "axios";

import * as S from "./styles";
import * as A from "../../assets";
import * as C from "../../constants";
import { ICartItem } from "../../@types";

const Carts = () => {
  const koreanTimeFormatter = new Intl.DateTimeFormat("ko-KR", C.options);
  const koreanTime = koreanTimeFormatter.format(new Date());

  const { cartItems, totalPrice } = useSelector(
    (state: RootState) => state.carts
  );

  const cartDatas = cartItems;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCartItems = async (id: number) => {
    const cartItemToRemove = cartDatas.find((item) => item.id === id);
    if (cartItemToRemove) {
      dispatch(decreasePrice(cartItemToRemove?.price));
    }

    await axios.delete(`http://localhost:5000/carts/${id}`);

    const response = await axios.get("http://localhost:5000/carts");
    const datas = response.data;

    const items = datas.map((cartItem: ICartItem) => {
      const { id, quantity, product } = cartItem;
      const { id: productId, name, price, imageURL } = product || [];
      return {
        id,
        productId: productId,
        quantity,
        name: name,
        price: price,
        imageURL: imageURL,
      };
    });

    dispatch(getItems(items));
  };

  const handleIncCartQty = async (id: number) => {
    const newCart = cartDatas.map((cartData) => {
      if (cartData.id !== id) return cartData;
      return { ...cartData, quantity: cartData.quantity + 1 };
    });

    const total = newCart.reduce(
      (acc, cur) => acc + +cur.price * cur.quantity,
      0
    );

    try {
      const selectedCart = newCart.find((cart) => cart.id === id);
      if (selectedCart) {
        await axios.patch(`http://localhost:5000/carts/${selectedCart.id}`, {
          quantity: selectedCart?.quantity,
        });

        dispatch(totalCart(total));
        dispatch(getItems(newCart));
      }
    } catch (error) {
      throw new Error("카트 업데이트 중 오류 발생");
    }
  };

  const handleDecCartQty = async (id: number) => {
    const newCart = cartDatas.map((cartData) => {
      if (cartData.id !== id) return cartData;
      return { ...cartData, quantity: cartData.quantity - 1 };
    });

    const total = newCart.reduce(
      (acc, cur) => acc + +cur.price * cur.quantity,
      0
    );

    try {
      const selectedCart = newCart.find((cart) => cart.id === id);
      if (selectedCart) {
        await axios.patch(`http://localhost:5000/carts/${selectedCart.id}`, {
          quantity: selectedCart?.quantity,
        });

        dispatch(totalCart(total));
        dispatch(getItems(newCart));
      }
    } catch (error) {
      throw new Error("카트 업데이트 중 오류 발생");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:5000/carts");
      const datas = response.data;
      const cartDatas = datas.map((cartItem: ICartItem) => {
        const { id, quantity, product } = cartItem;
        const { id: productId, name, price, imageURL } = product || [];
        return {
          id,
          productId: productId,
          quantity,
          name: name,
          price: price,
          imageURL: imageURL,
        };
      });

      dispatch(getItems(cartDatas));
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const total = cartDatas.reduce(
      (acc, cur) => acc + +cur.price * cur.quantity,
      0
    );
    dispatch(totalCart(total));
  }, [cartDatas, dispatch]);

  console.log(cartDatas);

  return (
    <S.Container>
      <S.Div className="header">
        <S.P>{koreanTime}</S.P>
        <S.Img src={A.container} alt="container" />
      </S.Div>

      <S.Div className="box">
        <S.Img
          src={A.back2}
          alt="back2"
          className="logo"
          onClick={() => navigate("/home")}
        />
        <S.Div>
          <S.H1 className="title">My cart</S.H1>
        </S.Div>
        <S.Div />
      </S.Div>

      <S.Section className="cart__list">
        {cartDatas.map((cartItem) => (
          <S.Box key={cartItem?.id}>
            <S.Main className="grid__box">
              <S.Img
                src={cartItem?.imageURL}
                alt={cartItem?.name}
                className="grid__img"
              />
              <S.Div className="cart__info">
                <S.Label>{cartItem.name}</S.Label>
                <S.Span>$ {cartItem.price}</S.Span>
                <S.Div className="cart__menu">
                  <S.Button
                    className="cart__btn"
                    onClick={() => handleIncCartQty(cartItem.id)}
                  >
                    <S.Img src={A.btn1} alt="btn1" />
                  </S.Button>
                  <S.H1 className="cart__qty">{cartItem?.quantity}</S.H1>
                  <S.Button
                    className="cart__btn"
                    onClick={() => handleDecCartQty(cartItem.id)}
                  >
                    <S.Img src={A.btn2} alt="btn2" />
                  </S.Button>
                </S.Div>
              </S.Div>
              <S.Div
                className="cart__btns"
                onClick={() => handleCartItems(cartItem.id)}
              >
                <S.Button className="xIcon__btn">
                  <S.Img src={A.xIcon} alt="xIcon" className="xIcon" />
                </S.Button>
              </S.Div>
            </S.Main>
            <S.Hr />
          </S.Box>
        ))}
        <S.Div className="cart__results">
          <S.Div className="cart__total">
            <S.H2>Total:</S.H2>
            <S.H1 className="cart__price">$ {totalPrice}</S.H1>
          </S.Div>
          <S.Button className="cart__checkout">Check out</S.Button>
        </S.Div>
      </S.Section>
    </S.Container>
  );
};

export default Carts;
