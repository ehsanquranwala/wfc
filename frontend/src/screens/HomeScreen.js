import { useEffect, useReducer, useState } from 'react';
//import data from '../data'; //static data on frontend
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

//reducer is a function which accepts 2 parameters 1 current state 2 action that changes state
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': // when we start sending an ajax request to backend
      return { ...state, loading: true }; // ...state is used to keep previous state values
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomeScreen() {
  //here we are defining a state variable (products) using (useState) to keep products and initializing it with empty array
  //and defining an effect using (useEffect) to bring products from backend and save in state
  //const [products, setProducts] = useState([]);//replaced with useReducer

  let defaultState = {
    products: [],
    loading: true,
    error: '',
  };
  const [{ loading, error, products }, dispatch] = useReducer(
    // logger(reducer),
    reducer,
    defaultState
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Weekly Fish Club</title>
      </Helmet>
      <h1>Featured Fish</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3   ">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

//FUNCTION COMPONENT 2 syntaxes
//const Example = (props) => { return <div />; }
//function Example(props) { return <div />; }

//STATE
//If you write a function component and realize you need to add some state to it,
//previously you had to convert it to a class. Now you can use a Hook inside the function component.

//CLASS
// class Example extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { count: 0 };
//   }

//USESTATE
//useState is a Hook that lets you add React state to function components.
//only argument to useState is the initial state.
//Unlike with classes, state doesn’t have to be an object
//useState returns a state variable and a function to update that variable

//HOOK
//A Hook is a special function that lets you “hook into” React features.
//Hooks are new in React 16.8. They let you use state and other React features without writing a class

//USEEFFECT
//Effect Hook lets you perform side effects in function components
//useEffect = componentDidMount, componentDidUpdate, and componentWillUnmount combined (React class lifecycle methods)
//In React class components, the render method itself shouldn’t cause side effects. It would be too early
//useEffect tells React that your component needs to do something after render (i.e. the passed function called effect)
//Placing useEffect inside the component lets us access any state variable or props right from the effect.

//EFFECTS WITHOUT CLEANUP  some additional code after React has updated the DOM.
//EFFECTS WITH CLEANUP when it is important to clean up

//USEREDUCER
//useReducer hook is used to manage complex states in React
//manage state by reducer hook
//define reducer, update fetch data, get state from useReducer
//An alternative to useState. Accepts a reducer of type (state, action) => newState,
//and returns the current state paired with a dispatch method. (If you’re familiar with Redux, you already know how this works.)
//useReducer is preferable to useState
//when you have complex state logic that involves multiple sub-values
//or when the next state depends on the previous one. useReducer
//also lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks.
//useReducer takes in a reducer function and state and returns a dispatch function and state
