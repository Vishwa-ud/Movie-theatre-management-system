import "./ProductScreen.css";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams} from 'react-router-dom'; // Import useParams and useNavigate
import { getProductDetails } from '../redux/actions/productActions';


const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  

  const { id } = useParams(); // Use useParams to get the 'id' parameter

  const productDetails = useSelector((state) => state.getProductDetails);//select state and what want from state
  const { loading, error, product } = productDetails;//if error or loading show error or loading

  useEffect(() => {
    if (!product || id !== product._id) {
      dispatch(getProductDetails(id));
    }//if product not exist or id not equal to product id then dispatch
  }, [dispatch, id, product]);

  

  return (
    <div className="productscreen">
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>//if none of these are true then show product
      ) : (
        //fragment to contain multiple elements
        <>
          <div className="productscreen__left">
            <div className="left__image">
              <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className="left__info">
              <p className="left__name">{product.name}</p>
              <p>Price: Rs.{product.price}</p>
              <p>Description: {product.description}</p>
            </div>
          </div>
          <div className="productscreen__right">
            <div className="right__info">
              <p>
                Price:
                <span>Rs.{product.price}</span>
              </p>
              <p>
                Status:
                <span>
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </p>
              <p>
                Qty
                <select value={qty} onChange={(e) => setQty(e.target.value)}>
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>//create a array  of product count in stock and map it to create a option
                  ))}
                </select>
              </p>
              <p>
                <button type="button" >
                  Add To Cart
                </button>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen;