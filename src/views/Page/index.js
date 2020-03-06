import React, { Component } from "react";
import firebase from "../../config/firebase";
import PageHeader from "../../components/PageHeader";
import "./index.scss";
import { withRouter } from "react-router-dom";

class Page extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            doc: null,
            exists: false,
        };
    }

    componentDidMount() {
        console.log(this.props.match.params.page);

        // Getting firestore document reference
        var setup = firebase
            .firestore()
            .collection("pages")
            .doc(this.props.match.params.page);

        // Setting reference to state
        this.setState({
            doc: setup,
        });

        // Getting markdown as raw content and setting to state
        setup.get().then(doc => {
            // Making sure document exists before proceeding
            if (doc.exists) {
                this.setState({
                    exists: true,
                    name: doc.data().name,
                });
            } else {
                // Document does not exists, 404.
                this.props.history.push("/404");
                return;
            }
        });
    }

    render() {
        if (this.state.exists)
            return (
                <div className="Page container">
                    <PageHeader to="home" title={this.state.name} />
                    <div id="codex-editor" />
                </div>
            );
        else return(null);
    }
}

export default withRouter(Page);
