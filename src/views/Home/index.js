import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from '../../config/firebase'
import { DescriptionOutlined, Settings } from "@material-ui/icons";
import { withRouter } from "react-router"
import './index.scss'

class Home extends Component {
    constructor() {
        super();
        /**
         * @categories stores all the categories from firestore doc 'pagesConfig'
         * @pages stores all the pages from firestore collection 'pages' (use pages[raw-name] for display name, eg. pages[check-in] = 'Check In')
         * @status stores status of page (use status[raw-name] for status)
         * @loading whether component is loading
         * @name: holds name of new page
         * @category holds category of new page
         * @user holds slack access key of user (stored in localStorage)
         */
        this.state = {
            categories: [],
            pages: [],
            status: [],
            loading: true,
            name: "",
            category: "",
            user: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.newPage = this.newPage.bind(this);
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("user");
        this.props.history.push('/');
        if(user != null) {
            localStorage.setItem("user", user);
        }
        this.setState({
            user: localStorage.getItem('user')
        })
        if(localStorage.getItem('user') === null) {
            this.props.history.push("/login");
            return;
        }

        // Getting firestore document reference
        var setup = firebase.firestore()

        // Getting data from pagesConfig doc (all the categories)
        setup.collection("config").doc("pagesConfig").get().then(doc => {
            this.setState({
                categories: doc.data().categories
            });
        });

        // Getting data from the pages collection (all the individual page docs)
        setup.collection("pages").get().then(snapshot => {
            // Setting up array to hold page attributes
            var pages = [];
            var status = [];
            // Storing names in array
            snapshot.forEach(doc => {
                pages[doc.id] = doc.data().name
                status[doc.id] = doc.data().status;
            })
            // Setting state to store pages
            this.setState({
                pages: pages,
                status: status,
            })
        }).then(() => {
            // Then, set loading to false
            this.setState({loading: false});
            var grids = document.getElementsByClassName("grid");
            var categories = document.getElementsByClassName("category");
            // Algorithm to set correct height for grid to wrap properly while not overflowing
            // (new grid height) = (grid height / 2) + (max category height)
            var max = 0;
            for (var item in categories) {
                if (categories[item].offsetHeight > max) {
                    max = categories[item].offsetHeight;
                }
            }            
            grids[0].style.height = grids[0].offsetHeight / 2 + max + "px";
        });
    }

    handleChange(event) {
        if (event.target.classList.contains("nameField"))
            this.setState({
                name: event.target.value
            });
        else if (event.target.classList.contains("categoryField"))
            this.setState({
                category: event.target.value
            });
    }

    newPage(event) {
        event.preventDefault();

        // Converting name to a raw format to store by
        var name = this.state.name
        var rawName = name
            .trim()
            .toLowerCase()
            .replace(/ /g, "-");

        // Getting references
        const pagesRef = firebase.firestore().collection('pages').doc(rawName);
        const pagesConfig = firebase.firestore().collection('config').doc('pagesConfig');
        
        // Creating new page
        pagesRef.get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    // Page already exists, throw error
                    console.log("Already exists");
                } else {
                    // Page does not exist, creating new one in Pages collection
                    pagesRef.set({
                        name: name,
                        content: ""
                    });
                    // Adding category to config
                    pagesConfig.get().then(doc => {
                        if(doc.data().categories[this.state.category]) {
                            // Category exists
                            console.log("Adding to existing category...");
                            const category = "categories." + this.state.category;
                            pagesConfig.update(category, firebase.firestore.FieldValue.arrayUnion(rawName));
                        }
                        else {
                            // Category does not exist, creating it.
                            console.log("Category doesn't exists, creating new one...");
                            const category = "categories." + this.state.category;
                            pagesConfig.update(category, [rawName]);
                        }
                    });
                }
            });
    }

    renderCategories() {
        // Stores results to return
        const results = []
        var categoryContainer = [];
        // Stores item to display
        var item;
        // Iterate through categories
        for (var category in this.state.categories) {
            // Adding category name to result
            categoryContainer.push(<h1 key={category}>{category}</h1>);
            categoryContainer.push(<div key={'div' + category} className="divider" />);
            // Iterate through pages in category
            for (var page in this.state.categories[category]) {
                // Storing item to find in pages array into item
                item = this.state.categories[category][page];
                // Adding each individual category item to result                
                categoryContainer.push(
                    <Link key={item} className={"link " + this.state.status[item]} to={"/p/" + item}>
                        <div className="item">
                            <DescriptionOutlined className="icon" />
                            {this.state.pages[item]}
                        </div>
                    </Link>
                );
            }
            results.push(<div key={category} className="category">{categoryContainer}</div>);
            categoryContainer = [];
        }
        
        return results;
    }

    render() {
        if(!this.state.loading)
            return (
                <div className="Home container">
                    <Link to="/settings">
                        <Settings className="settingsIcon" />
                    </Link>
                    <h1 className="header">Hacklahoma Wiki</h1>
                    <div className="grid">{this.renderCategories()}</div>
                    <form onSubmit={this.newPage}>
                        Page
                        <input
                            className="nameField"
                            onChange={this.handleChange}
                            value={this.state.name}
                        />
                        Category
                        <input
                            className="categoryField"
                            onChange={this.handleChange}
                            value={this.state.category}
                        />
                        <button
                            style={{
                                cursor: "pointer",
                                height: "22px",
                                width: "22px",
                                background: "green",
                                color: "white",
                                textAlign: "center"
                            }}
                        >
                            +
                        </button>
                    </form>
                </div>
            );
        else
            return(<div>Loading...</div>);
    }
}

export default withRouter(Home);
