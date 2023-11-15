import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import '../App.css';

import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import JsonRender from '../components/JsonRender';
import { getError } from '../utils';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
    case 'FETCH_SITES_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_SITES_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_FAIL':
    case 'FETCH_SITES_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const { dispatch: ctxDispatch } = useContext(Store);

  const [{ state, loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const [siteUrl, setSiteUrl] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [fullResponse, setFullResponse] = useState('');
  const [sites, setSites] = useState([]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({
      type: 'FETCH_REQUEST',
    });
    setToken('');
    setFullResponse('');
    try {
      const config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        },
      };

      const { data } = await axios.post(
        'http://localhost:8000/api/connect',
        {
          siteUrl,
          name,
          password,
        },
        config
      );
      setFullResponse(data);
      // setFullResponse(Object.entries(data));
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: data,
      });
      debugger;
      if (typeof data.errors !== 'undefined') {
        toast.warning('API server response has errors');
        Object.keys(data.errors).map((error) => {
          return toast.warning(error + ':' + data.errors[error]);
        });
      } else if (typeof data.success !== 'undefined') {
        setToken(data.success.token ?? '');
        toast.success('Data received successfuly');
      }
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };

  const getFile = async (e) => {
    debugger;
    e.preventDefault();

    try {
      const config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        },
      };

      const { data } = await axios.post(
        'http://localhost:8000/api/download',
        {
          apiUrl: fullResponse.success.user.account.api_domain,
          token,
        },

        config
      );
      debugger;

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: data,
      });

      debugger;
      if (typeof data.errors !== 'undefined') {
        toast.warning('API server response has errors');
      } else if (typeof data.success !== 'undefined') {
        toast.success('Data received successfuly');
      }
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    dispatch({
      type: 'FETCH_REQUEST',
    });
    const fetchData = async () => {
      dispatch({ type: 'FETCH_SITES_REQUEST' });
      try {
        const result = await axios.get('http://localhost:8000/api/sites');
        setSites(result.data);
        dispatch({ type: 'FETCH_SITES_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_SITES_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Crawler</title>
      </Helmet>
      <h1 className="my-3">Crawler</h1>
      <div className="homeScreen">
        <Row>
          <Col md={5}>
            <Container>
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Select
                    name="siteUrl"
                    onChange={(e) => setSiteUrl(e.target.value)}
                    aria-label="List of sites">
                    <option value="">Select URL to log-in</option>

                    {sites.map((site) => {
                      return (
                        <option key={site} value={site}>
                          {site}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  name="name"
                  hidden={siteUrl === ''}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    onChange={(e) => setName(e.target.value)}
                    required></Form.Control>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  name="password"
                  hidden={siteUrl === ''}
                  autoComplete="current-password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required></Form.Control>
                </Form.Group>
                <div className="mb-3">
                  <Button type="submit" disabled={siteUrl === ''}>
                    Submit
                  </Button>
                  {/* <Button onClick={getFile} disabled={siteUrl === ''}>
                    Download
                  </Button> */}
                </div>
              </Form>
            </Container>
          </Col>
          {loading ? (
            <LoadingBox />
          ) : (
            <Col md={6}>
              <h2 hidden={token === '' && fullResponse === ''}>Response</h2>
              <Card hidden={token === ''}>
                <Card.Title>Token</Card.Title>
                <Card.Body>{token}</Card.Body>
              </Card>
              <Card hidden={fullResponse === ''}>
                <Card.Title>Full Response</Card.Title>
                <Card.Body>{JSON.stringify(fullResponse)}</Card.Body>
              </Card>
              {/* <JsonRender collection={fullResponse} /> */}
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
}

export default HomeScreen;
