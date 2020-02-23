import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import firebase from "../config/firebase";

class Page extends Component {
    constructor() {
        super();
        this.state = {
            markdown: "",
            value: "",
            name: "",
            doc: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // Getting firestore document reference
        var setup = firebase
            .firestore()
            .collection("pages")
            .doc(this.props.match.params.page);

        // Setting reference to state
        this.setState({
            doc: setup
        });

        // Getting markdown as raw content and setting to state
        setup.get().then(doc => {
            this.setState({
                markdown: doc.data().content,
                value: doc.data().content,
                name: doc.data().name
            });
        });
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        var val = this.state.value;
        console.log(val);
        this.state.doc.update({ content: val });
    }

    render() {
        return (
            <div>
                <h1>Success {this.state.name}</h1>
                <div style={{ padding: "30px" }}>
                    <ReactMarkdown source={this.state.markdown} escapeHtml={false} />
                </div>

                <form onSubmit={this.handleSubmit}>
                    <label>
                        Markdown:
                        <textarea value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Page;
