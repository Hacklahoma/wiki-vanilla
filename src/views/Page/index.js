import React from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { HomeRounded } from "@material-ui/icons";
import styled from "styled-components";
import firebase from "../../config/firebase";
import ReactQuill from "react-quill";
import NavBar from "../../components/NavBar";
import "./index.scss";
import "react-quill/dist/quill.snow.css";

const StyledPage = styled.div`
    display: inline-block;
    position: relative;
    text-align: left;
    .content {
        margin-top: 100px;
    }
    h1 {
        font-weight: 900;
    }
    .divider {
        margin-bottom: 25px;
    }
    .toc {
        color: rgb(122, 122, 122);
        margin-bottom: 30px;
        .toc-2 {
            margin-left: 20px;
        }
        .toc-3 {
            margin-left: 40px;
        }
    }
    .toc-item {
        cursor: pointer;
        display: inline-block;
    }
    .toc-item:hover {
        text-decoration: underline;
    }
    .edit {
        display: inline-block;
        cursor: pointer;
        color: ${props => props.theme.blue};
        margin: 20px 0 50px 0;
        font-weight: 900;
    }
    .edit:hover {
        text-decoration: underline;
    }
    .ql-container {
        font-size: 1em;
        font-family: "Avenir";
        h1,
        h2,
        h3 {
            font-weight: 700;
            margin-top: 18px;
            strong {
                font-weight: 900;
            }
        }
        * {
            margin: 10px 0;
        }
        *:first-child {
            margin-top: 0;
        }
        li {
            margin: 3px 0;
        }
    }
    .ql-header {
        font-weight: 700;
        color: #444444;
    }
    .ql-toolbar.readOnly {
        display: none;
    }
    .ql-toolbar {
        position: relative;
        display: inline-block;
        width: 100%;
        max-width: 650px;
        border: none !important;
        z-index: 10;
        margin-bottom: 25px;
        text-align: center;
        background: rgba(255,255,255,0);
        transition: background .5s;
        .ql-formats {
            display: inline-block;
        }
    }
    .quill.fixed {
        margin-top: 93px;
        .ql-toolbar {
            position: fixed;
            top: 5px;
            left: 0;
            background: white;
            width: 100vw;
            max-width: none;
        }
    }
    .ql-container {
        border: none !important;
    }
    .ql-editor {
        padding: 0;
    }
    .button {
        color: ${props => props.theme.blue};
        display: inline-block;
        text-decoration: none;
        border-radius: 4px;
        padding: 4px;
        transition: background 0.5s;
        margin-bottom: 20px;
        p {
            font-weight: 900;
            display: inline-block;
        }
        .icon {
            display: inline-block;
            margin: 0 0 -6px -2px;
            padding: 0 4px 0 0;
        }
    }
    .button:hover {
        background: rgb(248, 248, 248);
    }
`;

class Page extends React.Component {
    constructor(props) {
        super(props);
        /**
         * @title Holds the title of the page
         * @text Holds the text of the page
         * @doc References the doc
         * @exists Whether the page exists
         * @readOnly Whether page is on read only
         * @toolbar Holds the position of the toolbar
         */
        this.state = {
            title: "",
            text: "",
            doc: null,
            exists: false,
            readOnly: true,
            toolbar: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
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
                    <div>
                        <p
                            key={Math.random()}
                            onClick={e => this.goTo(e, "h1")}
                            className="toc-1 toc-item"
                        >
                            {item.innerHTML}
                        </p>
                    </div>
                );
                level = 1;
            } else if (item.tagName === "H2") {
                if (level === 1 || level === 2 || level === 3) {
                    result.push(
                        <div>
                            <p
                                key={Math.random()}
                                onClick={e => this.goTo(e, "h2")}
                                className="toc-2 toc-item"
                            >
                                {item.innerHTML}
                            </p>
                        </div>
                    );
                    level = 2;
                } else {
                    result.push(
                        <div>
                            <p
                                key={Math.random()}
                                onClick={e => this.goTo(e, "h2")}
                                className="toc-1 toc-item"
                            >
                                {item.innerHTML}
                            </p>
                        </div>
                    );
                    level = 0;
                }
            } else if (item.tagName === "H3") {
                if (level === 0 || level === 1) {
                    result.push(
                        <div>
                            <p
                                key={Math.random()}
                                onClick={e => this.goTo(e, "h3")}
                                className="toc-2 toc-item"
                            >
                                {item.innerHTML}
                            </p>
                        </div>
                    );
                } else if (level === 2 || level === 3) {
                    result.push(
                        <div>
                            <p
                                key={Math.random()}
                                onClick={e => this.goTo(e, "h3")}
                                className="toc-3 toc-item"
                            >
                                {item.innerHTML}
                            </p>
                        </div>
                    );
                } else {
                    result.push(
                        <div>
                            <p
                                key={Math.random()}
                                onClick={e => this.goTo(e, "h3")}
                                className="toc-1 toc-item"
                            >
                                {item.innerHTML}
                            </p>
                        </div>
                    );
                    level = 0;
                }
            }
        }
        if (result.length > 0) return <div className="toc">{result}</div>;
        else return null;
    }

    handleScroll() {
        var toolbar = document.getElementsByClassName("quill")[0];
        console.log("Window: " + window.pageYOffset);
        console.log("elTop: " + this.state.toolbar);
        if (window.pageYOffset > this.state.toolbar - 5) {
            toolbar.classList.add("fixed");
        } else {
            toolbar.classList.remove("fixed");
        }
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
            this.setState({
                toolbar: document.getElementsByClassName("ql-toolbar")[0].offsetTop,
            });
            window.addEventListener("scroll", this.handleScroll);
        } else {
            document.getElementsByClassName("edit")[0].innerHTML = "Edit";
            document.getElementsByClassName("quill")[0].classList.remove("fixed");
            window.removeEventListener("scroll", this.handleScroll);
        }
        window.scroll(0, 0);
    }

    render() {
        if (this.state.exists)
            return (
                <StyledPage className="container">
                    <NavBar />
                    <div className="content">
                        <Link to="/" className="button">
                            <HomeRounded className="icon" />
                            <p>Home</p>
                        </Link>
                        <h1>{this.state.title}</h1>
                        <div className="divider" />
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
                </StyledPage>
            );
        else return "Loading...";
    }
}

export default withRouter(Page);
