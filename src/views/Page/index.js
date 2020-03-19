import React, { Component } from "react";
import firebase from "../../config/firebase";
import PageHeader from "../../components/PageHeader";
import "./index.scss";
import { withRouter } from "react-router-dom";
// import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
// import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
// import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
// import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
// import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
// import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


const editorConfiguration = {
  //   plugins: [Essentials, Bold, Italic, Paragraph, Underline],
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "link",
    "bulletedList",
    "numberedList",
    "code",
  ],
};

InlineEditor.builtinPlugins.map(plugin => console.log(plugin.pluginName));

class Page extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      doc: null,
      exists: false,
      data: "",
    };
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

    // ClassicEditor.create(document.querySelector("#editor"), {
    //   removePlugins: ["Heading", "Link"],
    //   toolbar: ["bold", "italic", "bulletedList", "numberedList", "blockQuote"],
    // }).catch(error => {
    //   console.log(error);
    // });

    // Getting markdown as raw content and setting to state
    setup.get().then(doc => {
      // Making sure document exists before proceeding
      if (doc.exists) {
        this.setState({
          exists: true,
          name: doc.data().name,
          data: doc.data().data,
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
          {/* <Editor
            toolbarOnFocus
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            toolbar={{
              options: [
                "inline",
                "blockType",
                "list",
              ]
            }}
          /> */}
          {/* <CKEditor
            editor={InlineEditor}
            config={editorConfiguration}
            data={this.state.data}
            // disabled={true}
            onInit={editor => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              //   console.log({ event, editor, data });
              this.state.doc.update({ data: data });
            }}
            onBlur={(event, editor) => {
              //   console.log("Blur.", editor);
            }}
            onFocus={(event, editor) => {
              //   console.log("Focus.", editor);
            }}
          /> */}
        </div>
      );
    else return null;
  }
}

export default withRouter(Page);
