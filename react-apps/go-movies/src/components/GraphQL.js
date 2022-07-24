import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import Input from './form-component/Input';

export default class GraphQL extends Component{
    constructor(props) {
        super(props);
        this.state = {
            movie: [],
            isLoaded: false,
            error: null,
            alert: {
                type: "d-none",
                message: "",
            },
            searchTerm: "",
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (evt) => {
        let value = evt.target.value;

        this.setState(
            (prevState) => ({
                searchTerm: value,
            })
        )
        if (value.length > 2) {
            this.performSearch();
        } else {
            this.setState({ movie: [] })
        }
    }

    performSearch() {
        const payload = `
        {
            search(titleContains: "${this.state.searchTerm}") {
                id
                title
                runtime
                year
                description
            }
        }
        `;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            body: payload,
            headers: myHeaders,
        }
        fetch("http://localhost:4000/v1/graphql", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                let theList = Object.values(data.data.search);
                return theList
            })
            .then((theList) => {
                console.log(theList);
                if (theList.length > 0) {
                    this.setState({
                        movie: theList,
                    })
                } else {
                    this.setState({
                        movie: [],
                    })
                }
            })
    }

    componentDidMount() {
        const payload = `
        {
            list {
                id
                title
                runtime
                year
                description
            }
        }
        `

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            body: payload,
            headers: myHeaders,
        }
        fetch("http://localhost:4000/v1/graphql", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                let theList = Object.values(data.data.list);
                return theList
            })
            .then((theList) => {
                console.log(theList);
                this.setState({
                    movie: theList,
                });
            })
    }

    render() {
        let {movie} = this.state;
        return (
            <Fragment>
                <h2>GraphQL</h2>
                <hr />

                <Input
                    title={"search"}
                    type={"text"}
                    name={"search"}
                    value={this.state.searchTerm}
                    handleChange={this.handleChange}
                />
                <div className='list-group'>
                    {movie.map((m) => (
                        <Link
                            key={m.id}
                            className="list-group-item list-group-item-action"
                            to={`/moviesgraphql/${m.id}`}>
                                <strong>{m.title}</strong><br />
                                <small className='text-muted'>
                                    ({m.year} - {m.runtime} minute)
                                </small>
                                <br />
                                {m.description.slice(0, 100)}...
                            </Link>
                    ))}
                </div>
            </Fragment>
        )
    }
}