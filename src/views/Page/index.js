// import React, { useCallback, useMemo, useState } from "react";
// // import firebase from "../../config/firebase";
import PageHeader from "../../components/PageHeader";
import "./index.scss";
import { withRouter } from "react-router-dom";
// import { createEditor, Editor, Transforms } from "slate";
// import { Slate, Editable, withReact } from "slate-react";

// const Page = () => {
//   //   function componentDidMount() {
//   //     console.log(this.props.match.params.page);

//   //     // Getting firestore document reference
//   //     var setup = firebase
//   //       .firestore()
//   //       .collection("pages")
//   //       .doc(this.props.match.params.page);

//   //     // Setting reference to state
//   //     this.setState({
//   //       doc: setup,
//   //     });

//   //     // Getting markdown as raw content and setting to state
//   //     setup.get().then(doc => {
//   //       // Making sure document exists before proceeding
//   //       if (doc.exists) {
//   //         this.setState({
//   //           exists: true,
//   //           name: doc.data().name,
//   //         });
//   //       } else {
//   //         // Document does not exists, 404.
//   //         this.props.history.push("/404");
//   //         return;
//   //       }
//   //     });
//   //     this.setState({
//   //       editor: editor,
//   //     });
//   //   }

//   const editor = useMemo(() => withReact(createEditor()), []);
//   const [value, setValue] = useState([
//     {
//       type: "paragraph",
//       children: [{ text: "A line of text in a paragraph." }],
//     },
//   ]);

//   // Define a rendering function based on the element passed to `props`. We use
//   // `useCallback` here to memoize the function for subsequent renders.
//   const renderElement = useCallback(props => {
//     switch (props.element.type) {
//       case "h1":
//         return <H1Element {...props} />;
//       default:
//         return <DefaultElement {...props} />;
//     }
//   }, []);

//   return (
//     <div className="Page container">
//       <PageHeader to="home" title={"test"} />
//       <Slate editor={editor} value={value} onChange={value => setValue(value)}>
//         <Editable
//           renderElement={renderElement}
//           onKeyDown={event => {
//             if (event.metaKey && event.altKey && event.key === "¡") {
//               event.preventDefault();
//               // Determine whether any of the currently selected blocks are code blocks.
//               const [match] = Editor.nodes(editor, {
//                 match: n => n.type === "h1",
//               });
//               // Toggle the block type depending on whether there's already a match.
//               Transforms.setNodes(
//                 editor,
//                 { type: match ? "paragraph" : "h1" },
//                 { match: n => Editor.isBlock(editor, n) }
//               );
//             } else if (event.metaKey && event.altKey && event.key === "º") {
//               event.preventDefault();
//               // Toggle the block type depending on whether there's already a match.
//               Transforms.setNodes(
//                 editor,
//                 { type: "paragraph" },
//                 { match: n => Editor.isBlock(editor, n) }
//               );
//             }
//           }}
//         />
//       </Slate>
//     </div>
//   );
// };

// const ELEMENT_TAGS = {
//   A: el => ({ type: "link", url: el.getAttribute("href") }),
//   BLOCKQUOTE: () => ({ type: "quote" }),
//   H1: () => ({ type: "heading-one" }),
//   H2: () => ({ type: "heading-two" }),
//   H3: () => ({ type: "heading-three" }),
//   H4: () => ({ type: "heading-four" }),
//   H5: () => ({ type: "heading-five" }),
//   H6: () => ({ type: "heading-six" }),
//   IMG: el => ({ type: "image", url: el.getAttribute("src") }),
//   LI: () => ({ type: "list-item" }),
//   OL: () => ({ type: "numbered-list" }),
//   P: () => ({ type: "paragraph" }),
//   PRE: () => ({ type: "code" }),
//   UL: () => ({ type: "bulleted-list" }),
// };

// const TEXT_TAGS = {
//   CODE: () => ({ code: true }),
//   DEL: () => ({ strikethrough: true }),
//   EM: () => ({ italic: true }),
//   I: () => ({ italic: true }),
//   S: () => ({ strikethrough: true }),
//   STRONG: () => ({ bold: true }),
//   U: () => ({ underline: true }),
// }

// // Define a React component renderer for our code blocks.
// const H1Element = props => {
//   return <h1>{props.children}</h1>;
// };

// const DefaultElement = props => {
//   return <p {...props.attributes}>{props.children}</p>;
// };

// export default withRouter(Page);

import React, { useState, useCallback, useMemo } from "react";
import { jsx } from "slate-hyperscript";
import { Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact, useSelected, useFocused } from "slate-react";

const ELEMENT_TAGS = {
  A: el => ({ type: "link", url: el.getAttribute("href") }),
  BLOCKQUOTE: () => ({ type: "quote" }),
  H1: () => ({ type: "heading-one" }),
  H2: () => ({ type: "heading-two" }),
  H3: () => ({ type: "heading-three" }),
  H4: () => ({ type: "heading-four" }),
  H5: () => ({ type: "heading-five" }),
  H6: () => ({ type: "heading-six" }),
  IMG: el => ({ type: "image", url: el.getAttribute("src") }),
  LI: () => ({ type: "list-item" }),
  OL: () => ({ type: "numbered-list" }),
  P: () => ({ type: "paragraph" }),
  PRE: () => ({ type: "code" }),
  UL: () => ({ type: "bulleted-list" }),
};

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

export const deserialize = el => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === "BR") {
    return "\n";
  }

  const { nodeName } = el;
  let parent = el;

  if (nodeName === "PRE" && el.childNodes[0] && el.childNodes[0].nodeName === "CODE") {
    parent = el.childNodes[0];
  }
  const children = Array.from(parent.childNodes)
    .map(deserialize)
    .flat();

  if (el.nodeName === "BODY") {
    return jsx("fragment", {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    return jsx("element", attrs, children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map(child => jsx("text", attrs, child));
  }

  return children;
};

const Page = () => {
  const [value, setValue] = useState(initialValue);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHtml(withReact(withHistory(createEditor()))), []);
  return (
    <div className="Page container">
      <PageHeader to="home" title={"test"} />
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Paste in some HTML..."
        />
      </Slate>
    </div>
  );
};

const withHtml = editor => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = element => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.isVoid = element => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = data => {
    const html = data.getData("text/html");

    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const fragment = deserialize(parsed.body);
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };

  return editor;
};

const Element = props => {
  const { attributes, children, element } = props;

  switch (element.type) {
    default:
      return <p className="block" {...attributes}>{children}</p>;
    case "quote":
      return (
        <blockquote className="block" {...attributes}>
          {children}
        </blockquote>
      );
    case "code":
      return (
        <pre>
          <code className="block" {...attributes}>
            {children}
          </code>
        </pre>
      );
    case "bulleted-list":
      return (
        <ul className="block" {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 className="block" {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 className="block" {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 className="block" {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 className="block" {...attributes}>
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 className="block" {...attributes}>
          {children}
        </h5>
      );
    case "heading-six":
      return (
        <h6 className="block" {...attributes}>
          {children}
        </h6>
      );
    case "list-item":
      return (
        <li className="block" {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol className="block" {...attributes}>
          {children}
        </ol>
      );
    case "link":
      return (
        <a className="block" href={element.url} {...attributes}>
          {children}
        </a>
      );
    case "image":
      return <ImageElement className="block" {...props} />;
  }
};

const ImageElement = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <img
        alt=""
        src={element.url}
        className={`
          display: block;
          max-width: 100%;
          max-height: 20em;
          box-shadow: ${selected && focused ? "0 0 0 2px blue;" : "none"};
        `}
      />
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  return <span {...attributes}>{children}</span>;
};

const initialValue = [
  {
    children: [
      {
        text: "By default, pasting content into a Slate editor will use the clipboard's ",
      },
      { text: "'text/plain'", code: true },
      {
        text:
          " data. That's okay for some use cases, but sometimes you want users to be able to paste in content and have it maintaing its formatting. To do this, your editor needs to handle ",
      },
      { text: "'text/html'", code: true },
      { text: " data. " },
    ],
  },
  {
    children: [{ text: "This is an example of doing exactly that!" }],
  },
  {
    children: [
      {
        text:
          "Try it out for yourself! Copy and paste some rendered HTML rich text content (not the source code) from another site into this editor and it's formatting should be preserved.",
      },
    ],
  },
];

export default withRouter(Page);
