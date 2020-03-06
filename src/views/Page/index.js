import React, { Component } from "react"; 
import firebase from "../../config/firebase";
import PageHeader from "../../components/PageHeader";
import "./index.scss";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";

class Page extends Component {
    constructor() {
        super();
        this.state = {
            markdown: "",
            value: "",
            name: "",
            doc: null,
            editor: null,
            data: {},
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
            doc: setup,
        });

        // Getting markdown as raw content and setting to state
        setup.get().then(doc => {
            this.setState({
                value: "deprecated",
                name: doc.data().name,
            });
            const editor = new EditorJS({
                /**
                 * Id of Element that should contain the Editor
                 */
                holderId: "codex-editor",
                /**
                 * Available Tools list.
                 * Pass Tool's class or Settings object for each Tool you want to use
                 */
                tools: {
                    header: {
                        class: Header,
                        config: {
                            placeholder: "Enter a header",
                            levels: [1, 2, 3, 4],
                            defaultLevel: 1,
                        },
                    },
                },
                /**
                 * Previously saved data that should be rendered
                 */
                data: doc.data().data,
                /**
                 * onReady callback
                 */
                onReady: () => {
                    console.log("Editor.js is ready to work!");
                },
                /**
                 * Fires when something changed in DOM
                 */
                onChange: () => {
                    this.saveData();
                },
            });

            this.setState({
                editor: editor,
            });
        });
    }

    saveData() {
        this.state.editor
            .save()
            .then(outputData => {
                this.state.doc.update({ data: outputData });
                console.log("Article data: ", outputData);
            })
            .catch(error => {
                console.log("Saving failed: ", error);
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
            <div className="Page container">
                <PageHeader to="home" title={this.state.name} />
                <div id="codex-editor" />
            </div>
        );
    }
}

export default Page;
