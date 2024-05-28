import { useState, useEffect } from 'react';
import './css/bootstrap.min.css';
import './css/style.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Pizza',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. At dicta asperiores veniam repellat unde debitis quisquam magnam magni ut deleniti!',
    price: 30,
    image: 'images/pizza.jpg',
    quantity: 5,
  },
  {
    id: 2,
    name: 'Hamburger',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. At dicta asperiores veniam repellat unde debitis quisquam magnam magni ut deleniti!',
    price: 15,
    image: 'images/hamburger.jpg',
    quantity: 5,
  },
  {
    id: 3,
    name: 'Bread',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. At dicta asperiores veniam repellat unde debitis quisquam magnam magni ut deleniti!',
    price: 20,
    image: 'images/bread.jpg',
    quantity: 5,
  },
  {
    id: 4,
    name: 'Cake',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. At dicta asperiores veniam repellat unde debitis quisquam magnam magni ut deleniti!',
    price: 10,
    image: 'images/Cake.jpg',
    quantity: 5,
  },
];

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // If no products are found in local storage, set initial products and save them
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    setProducts(products.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity - quantity } : item
    ));
    showMessage('Add to cart successfully', 'success');
  };

  const updateCart = (id: number, quantity: number) => {
    const productInCart = cart.find((item) => item.id === id);
    if (productInCart) {
      const quantityDifference = quantity - productInCart.quantity;
      const productInStock = products.find((item) => item.id === id);

      if (productInStock && productInStock.quantity >= quantityDifference) {
        setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
        setProducts(products.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - quantityDifference } : item
        ));
      } else {
        showMessage('Hết hàng rồi', 'danger');
      }
    }
  };
  

  const deleteFromCart = (id: number) => {
    const itemToDelete = cart.find((item) => item.id === id);
    if (itemToDelete) {
      setProducts(products.map((product) =>
        product.id === id ? { ...product, quantity: product.quantity + itemToDelete.quantity } : product
      ));
    }
    setCart(cart.filter((item) => item.id !== id));
    showMessage('Delete successfully', 'danger');
  };

  const showMessage = (text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  return (
    <div className="container">
      <div className="page-header">
        <h1>Shopping Cart</h1>
      </div>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <div className="row">
        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h1 className="panel-title">List Products</h1>
            </div>
            <div className="panel-body" id="list-product">
              {products.map((product) => (
                <div key={product.id} className="media product">
                  <div className="media-left">
                    <a href="#">
                      <img className="media-object" src={product.image} alt={product.name} />
                    </a>
                  </div>
                  <div className="media-body">
                    <h4 className="media-heading">{product.name}</h4>
                    <p>{product.description}</p>
                    <span className="price">{product.price} USD</span>
                    <div>
                      <input
                        name={`quantity-product-${product.id}`}
                        type="number"
                        defaultValue={1}
                        min={1}
                        max={product.quantity}
                        id={`quantity-${product.id}`}
                        disabled={product.quantity === 0}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          const quantity = parseInt((document.getElementById(`quantity-${product.id}`) as HTMLInputElement).value);
                          if (quantity <= product.quantity) {
                            addToCart(product, quantity);
                          } else {
                            showMessage('Hết hàng rồi!', 'danger');
                          }
                        }}
                        disabled={product.quantity === 0}
                      >
                        {product.quantity === 0 ? 'Add to Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <div className="panel panel-danger">
            <div className="panel-heading">
              <h1 className="panel-title">Your Cart</h1>
            </div>
            <div className="panel-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="my-cart-body">
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={5}>Chưa có sản phẩm trong giỏ hàng</td>
                    </tr>
                  ) : (
                    cart.map((item, index) => (
                      <tr key={item.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>{item.price} USD</td>
                        <td>
                          <input
                            name={`cart-item-quantity-${item.id}`}
                            type="number"
                            value={item.quantity}
                            min={1}
                            onChange={(e) => updateCart(item.id, parseInt(e.target.value))}
                            
                          />
                        </td>
                        <td>
                          <a
                            className="label label-info update-cart-item"
                            onClick={() => updateCart(item.id, item.quantity)}
                          >
                            Update
                          </a>
                          <a
                            className="label label-danger delete-cart-item"
                            onClick={() => deleteFromCart(item.id)}
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot id="my-cart-footer">
                  <tr>
                    <td>
                      There are <b>{cart.length}</b> items in your shopping cart.
                    </td>
                    <td className="total-price text-left">
                      {calculateTotalPrice()} USD
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
