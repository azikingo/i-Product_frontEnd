import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {Link, useHistory, useParams} from "react-router-dom";
import {Collapse, Container} from "react-bootstrap";

function ProductEdit() {
    const [validated, setValidated] = useState(false),
        [file, setFile] = useState([]),
        [fileNames, setFileNames] = useState([]),
        [cities, setCities] = useState([]),
        [prices, setPrices] = useState([]),
        [product, setProduct] = useState({}),
        [isLoadedCities, setIsLoadedCities] = useState(false),
        [isLoadedProduct, setIsLoadedProduct] = useState(false),
        [isLoaded, setIsLoaded] = useState(false),
        [errorCities, setErrorCities] = useState(null),
        [errorProduct, setErrorProduct] = useState(null),
        [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const history = useHistory();

    const {id} = useParams();

    useEffect(() => {
        fetch("http://localhost:8008/product/" + id)
            .then(res => res.json())
            .then(result => {
                setIsLoadedProduct(true);
                setProduct(result);
                setPrices(result.prices);
            }, error => {
                setIsLoadedProduct(true);
                setErrorProduct(error);
            });
        fetch("http://localhost:8008/cities")
            .then(res => res.json())
            .then(result => {
                setIsLoadedCities(true);
                setCities(result);
            }, error => {
                setIsLoadedCities(true);
                setErrorCities(error);
            });
    }, []);

    const uploadSingleFile = (uploadedFile) => {
        const allFiles = [...file];
        for (let i = 0; i < uploadedFile.target.files.length; i++) {
            let oneFile = uploadedFile.target.files[i];
            fileNames.forEach(name => {
                if (name === oneFile.name)
                    oneFile = null;
            });
            if (oneFile !== null) {
                allFiles.push(URL.createObjectURL(oneFile));
                setFileNames(fileNames.concat(oneFile.name));
            }
        }
        setFile(allFiles);
    }

    const individualPrice = () => {
        setOpen(!open);
        let priceInput = document.getElementById("productPrice");
        console.log(document.getElementsByName("cityPrices"));
        if (open === true) {
            priceInput.removeAttribute("disabled");
            document.getElementsByName("cityPrices").forEach(element => {
                element.removeAttribute("required");
            });
        } else {
            priceInput.value = "";
            priceInput.setAttribute("disabled", "true");
            document.getElementsByName("cityPrices").forEach(element => {
                element.setAttribute("required", "true");
            });
        }
    }

    const handleSubmit = (event) => {
        const myFile = event.target[0];
        const data = new FormData();
        data.append("myFile", myFile);
        data.append("id", product.id);
        data.append("name", document.getElementById("productName").value);
        data.append("description", document.getElementById("productDescription").value);
        data.append("status", document.getElementById("productStatus").value);
        data.append("price", document.getElementById("productPrice").value);
        cities.forEach(city => {
            data.append("city" + city.id, document.getElementById("city" + city.id).value);
        });

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            fetch("http://localhost:8008/products/edit", {
                method: "POST",
                body: data,
            })
                .then(res => res.json())
                .then(result => {
                    setIsLoaded(true);
                }, error => {
                    setIsLoaded(true);
                    setError(error);
                });
            history.push("/products");
        }

        setValidated(true);
    };

    return (
        <Container>
            <h2 className="text-center mt-3">Add new product!</h2>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="productPhoto">
                    {file.length > 0 && file.map((item, index) => (
                        <div className="m-2" key={item}>
                            <img src={item} alt="" style={{maxWidth: "200px", maxHeight: "150px"}}/>
                            {/*<button type="button" onClick={() => deleteFile(index)}>*/}
                            {/*    delete*/}
                            {/*</button>*/}
                        </div>
                    ))}
                    <Form.Label column sm="2">Product photo</Form.Label>
                    <Col sm="10">
                        <Form.Control required type="file" multiple onChange={uploadSingleFile}/>
                        <Form.Control.Feedback type="invalid">
                            Please upload photo(s).
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Product name</Form.Label>
                    <Col sm="10">
                        <Form.Control id="productName" required placeholder="Name..." defaultValue={product.name}/>
                        <Form.Control.Feedback type="invalid">
                            Please fill the product name.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Product description</Form.Label>
                    <Col sm="10">
                        <Form.Control id="productDescription" required as="textarea" rows={3}
                                      placeholder="Description..." defaultValue={product.description}/>
                        <Form.Control.Feedback type="invalid">
                            Please fill the description of the product.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Status</Form.Label>
                    <Col sm="10">
                        <Form.Select id="productStatus" required aria-label="Default select example">
                            <option value="active" selected={product.status === "active"}>Active</option>
                            <option value="archive" selected={product.status === "archive"}>Archive</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please select status of the product.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">Price</Form.Label>
                    <Col sm="10">
                        <Row>
                            <Col sm="6">
                                <Form.Control id="productPrice" required placeholder="Price..."
                                              defaultValue={product.price}/>
                                <Form.Control.Feedback type="invalid">
                                    Please fill the product price.
                                </Form.Control.Feedback>
                            </Col>
                            <Col sm="6">
                                <Button
                                    onClick={() => individualPrice()}
                                    aria-controls="example-collapse-text"
                                    aria-expanded={open}
                                >
                                    Individual price for each city
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Collapse in={open}>
                        <div id="example-collapse-text" className="mt-3">
                            {prices !== null ? prices.map(price => (
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">{price.name}</Form.Label>
                                    <Col sm="5">
                                        <Form.Control id={"city" + price.id} name="cityPrices" placeholder="Price..."
                                                      defaultValue={price.price}/>
                                        <Form.Control.Feedback type="invalid">
                                            Please fill the price for this city.
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            )) : cities.map(city => (
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="2">{city.name}</Form.Label>
                                    <Col sm="5">
                                        <Form.Control id={"city" + city.id} name="cityPrices" placeholder="Price..." />
                                        <Form.Control.Feedback type="invalid">
                                            Please fill the price for this city.
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            ))}
                        </div>
                    </Collapse>
                </Form.Group>
                <Link to="/products" className="btn btn-secondary">Close</Link>{' '}
                <Button type="submit">Submit form</Button>
            </Form>
        </Container>
    );
}

export default ProductEdit;