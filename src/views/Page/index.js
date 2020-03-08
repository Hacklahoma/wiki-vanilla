import React, { Component, useCallback, useMemo, useState } from "react";
import firebase from "../../config/firebase";
import PageHeader from "../../components/PageHeader";
import "./index.scss";
import { withRouter } from "react-router-dom";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const Page = () => {
    function componentDidMount() {
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
        this.setState({
            editor: editor,
        });
    }

    const [value, setValue] = useState([
        {
            type: "paragraph",
            children: [{ text: "A line of text in a paragraph." }],
        },
    ]);
    const editor = useMemo(() => withReact(createEditor()), []);

    return (
        <div className="Page container">
            <PageHeader to="home" title={"test"} />
            <Slate editor={editor} value={value} onChange={value => setValue(value)}>
                <Editable />
            </Slate>
        </div>
    );
};

export default withRouter(Page);
