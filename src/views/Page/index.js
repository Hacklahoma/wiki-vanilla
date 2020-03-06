import React, { Component } from "react";
import firebase from "../../config/firebase";
import PageHeader from "../../components/PageHeader";
import "./index.scss";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import { withRouter } from "react-router-dom";

class Page extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            doc: null,
            editor: null,
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

            // Setting up editor
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
                    // Header tool
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
            // Saving editor state
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
            })
            .catch(error => {
                console.log("Saving failed: ", error);
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
