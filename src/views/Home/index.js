import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../config/firebase";
import { DescriptionOutlined, Settings, Create } from "@material-ui/icons";
import { withRouter } from "react-router";
import "./index.scss";
import Popup from "../../components/Popup";

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
         * @renderSettings boolean to render settings popup
         * @renderNewPage boolean to render newPage popup
         */
        this.state = {
            categories: [],
            pages: [],
            status: [],
            loading: true,
            name: "",
            category: "",
            user: null,
            renderSettings: false,
            renderNewPage: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.closePopup = this.closePopup.bind(this);
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("user");
        this.props.history.push("/");
        if (user != null) {
            localStorage.setItem("user", user);
        }
        this.setState({
            user: localStorage.getItem("user")
        });
        if (localStorage.getItem("user") === null) {
            this.props.history.push("/login");
            return;
        }

        // Getting firestore document reference
        var setup = firebase.firestore();

        // Getting data from pagesConfig doc (all the categories)
        setup
            .collection("config")
            .doc("pagesConfig")
            .get()
            .then(doc => {
                this.setState({
                    categories: doc.data().categories
                });
            });

        // Getting data from the pages collection (all the individual page docs)
        setup
            .collection("pages")
            .get()
            .then(snapshot => {
                // Setting up array to hold page attributes
                var pages = [];
                var status = [];
                // Storing names in array
                snapshot.forEach(doc => {
                    pages[doc.id] = doc.data().name;
                    status[doc.id] = doc.data().status;
                });
                // Setting state to store pages
                this.setState({
                    pages: pages,
                    status: status
                });
            })
            .then(() => {
                // Then, set loading to false
                this.setState({ loading: false });
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

    renderCategories() {
        // Stores results to return
        const results = [];
        var categoryContainer = [];
        // Stores item to display
        var item;
        // Iterate through categories
        for (var category in this.state.categories) {
            // Adding category name to result
            categoryContainer.push(<h1 key={category}>{category}</h1>);
            categoryContainer.push(<div key={"div" + category} className="divider" />);
            // Iterate through pages in category
            for (var page in this.state.categories[category]) {
                // Storing item to find in pages array into item
                item = this.state.categories[category][page];
                // Adding each individual category item to result
                categoryContainer.push(
                    <Link
                        key={item}
                        className={"link " + this.state.status[item]}
                        to={"/p/" + item}
                    >
                        <div className="item">
                            <DescriptionOutlined className="icon" />
                            {this.state.pages[item]}
                        </div>
                    </Link>
                );
            }
            results.push(
                <div key={category} className="category">
                    {categoryContainer}
                </div>
            );
            categoryContainer = [];
        }

        return results;
    }

    handleClick(action) {
        if (action === "settings") {
            this.setState({
                renderSettings: true
            });
        } else if (action === "newPage") {
            this.setState({
                renderNewPage: true
            });
        }
    }

    closePopup(event) {
        if (event.target.classList.contains("Popup") | event.target.classList.contains("close")) {
            this.setState({
                renderSettings: false,
                renderNewPage: false
            })
        }
    }

    render() {
        if (!this.state.loading)
            return (
                <div className="Home">
                    <div className="container">
                        <Settings
                            onClick={() => this.handleClick("settings")}
                            className="actionIcon settingsIcon"
                        />
                        <Create
                            onClick={() => this.handleClick("newPage")}
                            className="actionIcon newPageIcon"
                        />
                        <h1 className="header">Hacklahoma Wiki</h1>
                        <div className="grid">{this.renderCategories()}</div>
                    </div>
                    {this.state.renderNewPage ? (
                        <Popup closePopup={this.closePopup} type="newPage" />
                    ) : null}
                    {this.state.renderSettings ? (
                        <Popup closePopup={this.closePopup} type="settings" />
                    ) : null}
                </div>
            );
        else return <div>Loading...</div>;
    }
}

export default withRouter(Home);
