import React, {Component} from "react";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Link} from "react-router-dom";

const {SearchBar} = Search;

const pagination = paginationFactory({
    page: 1,
    sizePerPage: 5,
    lastPageText: '>>',
    firstPageText: '<<',
    nextPageText: '>',
    prePageText: '<',
    showTotal: true,
    alwaysShowAllBtns: true,
    sizePerPageList: [{
        text: '5th', value: 5
    }, {
        text: '10th', value: 10
    }]
});

export default class Products extends Component {
    constructor() {
        super();
        this.state = {
            showAdd: false,
            error: null,
            isLoaded: false,
            products: [],
            columns: [
                {
                    dataField: "photo",
                    text: "Photo",
                    searchable: false
                }, {
                    dataField: "name",
                    text: "Product name"
                }, {
                    dataField: "description",
                    text: "Description",
                    searchable: false
                }, {
                    dataField: "status",
                    text: "Status",
                    searchable: false
                }, {
                    dataField: "price",
                    text: "Price",
                    searchable: false
                }, {
                    dataField: "buttons",
                    text: "",
                    formatter: this.buttons,
                }
            ],
        };
    }

    componentDidMount() {
        fetch("http://localhost:8008/products")
            .then(res => res.json())
            .then(result => {
                this.setState({isLoaded: true});
                this.setState({products: result});
            }, error => {
                this.setState({isLoaded: true});
                this.setState({error: error});
            });
    }

    handleDelete(id) {
        fetch("http://localhost:8008/products/del", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id: id
            })
        })
            .then(res => res.json())
            .then(result => {
                this.setState({isLoaded: true});
                this.setState({products: result});
            }, error => {
                this.setState({isLoaded: true});
                this.setState({error: error});
            });
    }

    buttons = (cell, row, rowIndex, formatExtraData) => {
        return (
            <div>
                <Link className="btn btn-info btn-sm" to={{pathname: "/products/edit/" + row.id}}>Edit</Link>{' '}
                <Button variant="danger" size="sm" onClick={() => this.handleDelete(row.id)}>Delete</Button>
            </div>
        );
    };

    render() {
        return (
            <div style={{padding: "20px"}}>
                <ToolkitProvider
                    keyField="id"
                    data={this.state.products}
                    columns={this.state.columns}
                    search
                >
                    {
                        props => (
                            <div>
                                <Navbar bg="light" expand="lg">
                                    <Container fluid>
                                        <Navbar.Brand href="#"> i-Product! </Navbar.Brand>
                                        <Navbar.Toggle aria-controls="navbarScroll"/>
                                        <Navbar.Collapse id="navbarScroll">
                                            <Nav
                                                className="me-auto my-2 my-lg-0"
                                                style={{maxHeight: '100px'}}
                                                navbarScroll
                                            >
                                                <SearchBar srText=""
                                                           placeholder="Search name..." {...props.searchProps} />
                                            </Nav>
                                            <Nav>
                                                <Link to="/products/create"
                                                      className="btn btn-outline-success">Add</Link>
                                            </Nav>
                                        </Navbar.Collapse>
                                    </Container>
                                </Navbar>
                                <hr/>
                                <BootstrapTable
                                    striped hover bordered={false}
                                    {...props.baseProps} pagination={pagination}
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
            </div>
        );
    }
}