import React, { Component } from "react";
import firebase from '../../../config/firebase'
import "./index.scss";

export class NewPage extends Component {
           constructor() {
               super();
               this.state = {
                   name: "",
                   category: ""
               };
               this.newPage = this.newPage.bind(this);
               this.handleChange = this.handleChange.bind(this);
           }

           newPage(event) {
               event.preventDefault();

               // Converting name to a raw format to store by
               var name = this.state.name;
               var rawName = name
                   .trim()
                   .toLowerCase()
                   .replace(/ /g, "-");

               // Getting references
               const pagesRef = firebase
                   .firestore()
                   .collection("pages")
                   .doc(rawName);
               const pagesConfig = firebase
                   .firestore()
                   .collection("config")
                   .doc("pagesConfig");

               // Creating new page
               pagesRef.get().then(snapshot => {
                   if (snapshot.exists) {
                       // Page already exists, throw error
                       console.log("Already exists");
                   } else {
                       // Page does not exist, creating new one in Pages collection
                       pagesRef.set({
                           name: name,
                           content: ""
                       });
                       // Adding category to config
                       pagesConfig.get().then(doc => {
                           if (doc.data().categories[this.state.category]) {
                               // Category exists
                               console.log("Adding to existing category...");
                               const category = "categories." + this.state.category;
                               pagesConfig.update(
                                   category,
                                   firebase.firestore.FieldValue.arrayUnion(rawName)
                               );
                           } else {
                               // Category does not exist, creating it.
                               console.log("Category doesn't exists, creating new one...");
                               const category = "categories." + this.state.category;
                               pagesConfig.update(category, [rawName]);
                           }
                       });
                   }
               });
           }

           handleChange(event) {
               if (event.target.classList.contains("nameField"))
                   this.setState({
                       name: event.target.value
                   });
               else if (event.target.classList.contains("categoryField"))
                   this.setState({
                       category: event.target.value
                   });
           }

           render() {
               return (
                   <div className="NewPage">
                       <form onSubmit={this.newPage}>
                           Page
                           <input
                               className="nameField"
                               onChange={this.handleChange}
                               value={this.state.name}
                           />
                           <br />
                           Category
                           <input
                               className="categoryField"
                               onChange={this.handleChange}
                               value={this.state.category}
                           />
                           <br />
                           <br />
                           <button
                               style={{
                                   cursor: "pointer",
                                   height: "22px",
                                   width: "100px",
                                   background: "green",
                                   color: "white",
                                   textAlign: "center"
                               }}
                           >
                               +
                           </button>
                       </form>

                       <div className="close">
                           <p className="close">Close</p>
                       </div>
                   </div>
               );
           }
       }

export default NewPage;
