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
        this.goTo = this.goTo.bind(this);
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
        if (
            value === "<p><br></p>" ||
            value === "<h1><br></h1>" ||
            value === "<h2><br></h2>" ||
            value === "<h3><br></h3>"
        ) {
            value = "";
        }
        this.state.doc.update({ data: value });
    }

    // Scrolls to header that is clicked in the ToC
    goTo(event, tag) {
        for (var element of document.getElementsByClassName("quill")[0].getElementsByTagName(tag)) {
            if (element.innerHTML === event.target.innerHTML) {
                element.scrollIntoView();
            }
        }
    }

    // Renders table of contents
    renderToC() {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(this.state.text, "text/html");
        var result = [];
        var level;
        // Iterates through text and assigns column
        for (var item of htmlDoc.getElementsByTagName("*")) {
            if (item.innerHTML === "<br>") {
                continue;
            }
            if (item.tagName === "H1") {
                result.push(
                    <p
                        key={Math.random()}
                        onClick={e => this.goTo(e, "h1")}
                        className="toc-1 toc-item"
                    >
                        {item.innerHTML}
                    </p>
                );
                level = 1;
            } else if (item.tagName === "H2") {
                if (level === 1 || level === 2 || level === 3) {
                    result.push(
                        <p
                            key={Math.random()}
                            onClick={e => this.goTo(e, "h2")}
                            className="toc-2 toc-item"
                        >
                            {item.innerHTML}
                        </p>
                    );
                    level = 2;
                } else {
                    result.push(
                        <p
                            key={Math.random()}
                            onClick={e => this.goTo(e, "h2")}
                            className="toc-1 toc-item"
                        >
                            {item.innerHTML}
                        </p>
                    );
                    level = 0;
                }
            } else if (item.tagName === "H3") {
                if (level === 0 || level === 1) {
                    result.push(
                        <p
                            key={Math.random()}
                            onClick={e => this.goTo(e, "h3")}
                            className="toc-2 toc-item"
                        >
                            {item.innerHTML}
                        </p>
                    );
                } else if (level === 2 || level === 3) {
                    result.push(
                        <p
                            key={Math.random()}
                            onClick={e => this.goTo(e, "h3")}
                            className="toc-3 toc-item"
                        >
                            {item.innerHTML}
                        </p>
                    );
                } else {
                    result.push(
                        <p
                            key={Math.random()}
                            onClick={e => this.goTo(e, "h3")}
                            className="toc-1 toc-item"
                        >
                            {item.innerHTML}
                        </p>
                    );
                    level = 0;
                }
            }
        }
        if (result.length > 0) return <div className="toc">{result}</div>;
        else return null;
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
                    {this.renderToC()}
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
