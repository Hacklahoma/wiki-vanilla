import React from "react";
import PageHeader from "../../components/PageHeader";
import firebase from "../../config/firebase";
import "./index.scss";
import { withRouter } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

class Page extends React.Component {
    constructor(props) {
        super(props);
        /**
         * @title Holds the title of the page
         */
        this.state = {
            title: "",
            text: "",
            doc: null,
            exists: false,
            readOnly: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
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
            // Making sure document exists before proceeding
            if (doc.exists) {
                this.setState({
                    exists: true,
                    text: doc.data().data,
                    title: doc.data().title,
                });
                // Setting up read only mode
                document.getElementsByClassName("ql-toolbar")[0].classList.add("readOnly");
            } else {
                // Document does not exists, 404.
                this.props.history.push("/404");
                return;
            }
        });
    }

    // Modules for editor
    modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }, { header: "3" }],
            ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    // Formats for editor
    formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code-block",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
    ];

    // Update database and state when value changes
    handleChange(value) {
        this.setState({ text: value });
        this.state.doc.update({ data: value });
    }

    // Toggle between read only mode and edit
    toggleEdit() {
        document.getElementsByClassName("ql-toolbar")[0].classList.toggle("readOnly");
        this.setState({
            readOnly: !this.state.readOnly,
        });
        if (this.state.readOnly) {
            document.getElementsByClassName("edit")[0].innerHTML = "Done";
            document.getElementsByClassName("ql-header")[0].innerHTML = "H1";
            document.getElementsByClassName("ql-header")[1].innerHTML = "H2";
            document.getElementsByClassName("ql-header")[2].innerHTML = "H3";
        } else {
            document.getElementsByClassName("edit")[0].innerHTML = "Edit";
        }
        window.scroll(0, 0);
    }

    render() {
        if (this.state.exists)
            return (
                <div className="Page container">
                    <PageHeader to="home" title={this.state.title} />
                    <ReactQuill
                        placeholder="There is nothing here..."
                        readOnly={this.state.readOnly}
                        value={this.state.text}
                        onChange={this.handleChange}
                        modules={this.modules}
                        formats={this.formats}
                    />
                    <p className="edit" onClick={this.toggleEdit}>
                        Edit
                    </p>
                </div>
            );
        else return "Loading...";
    }
}

export default withRouter(Page);
