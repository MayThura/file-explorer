import React, {Component} from 'react';

import './App.css';
import TreeView from './TreeView';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      structure: {},
      properties: {hide:[]},
      links: {},
      reverseLink: {}
    };
    
    this.onAddFileClicked = this.onAddFileClicked.bind(this);
    this.onAddDirectoryClicked = this.onAddDirectoryClicked.bind(this);
    this.onDeleteClicked = this.onDeleteClicked.bind(this);
    this.onLinkClicked = this.onLinkClicked.bind(this);
    this.onMoveClicked = this.onMoveClicked.bind(this);
    this.onChangeClicked = this.onChangeClicked.bind(this);
  }

  validateInput (input) {
    if (input === undefined || !input.includes('/') || input.charAt(0) !== '/') {
      alert('Input is not valid!');
      return false;
    }
    return true;
  }

  validateLastInput (input) {
    if (input === undefined) {
      alert("Input is not valid!")
      return false;
    } else if (input.charAt(input.length - 1) === '/') {
      alert("Input is not valid! You cannot put '/' at the end of directory");
      return false;
    }
    return true;
  }

  validateAction (input) {
    if (input.includes(" ")) {
      alert("You are clicking to the wrong button. You might want to do 'Link', 'Move', or 'Change' operation");
      return false;
    }
    return true;
  }

  checkRootDir (input) {
    if (input.length === 1 && input === '/') {
      return true;
    }
    return false;
  }

  onAddFileClicked = (event) => {
    event.preventDefault();
    const { input, structure } = this.state;
    if (!this.validateInput(input) || !this.validateLastInput(input) || !this.validateAction(input)) {
      return;
    }
    const inputs = input.split('/');
    this.addFile(structure, inputs);
  }

  addFile (currentDirectory, inputs) {
    const { structure } = this.state;
    for (let i = 1; i < inputs.length; i++) {
      if (i !== inputs.length - 1) {
        if (Object.keys(currentDirectory).includes(inputs[i])) {
          currentDirectory = currentDirectory[inputs[i]];
        } else {
          alert("You are trying to make a file in a non existing folder. Make a folder first.");
          return false;
        }
      } else {
          if (Object.keys(currentDirectory).includes(inputs[i])) {
            alert("This file already exists");
            return false;
          } else if (currentDirectory === 'file') {
              alert("You cannot create a file inside another file.");
              return false;
          } else {
            currentDirectory[inputs[i]] = 'file';
            this.setState({structure});
          }
      }
    }
    return true;
  }

  onAddDirectoryClicked = (event) => {
    event.preventDefault();
    const { input, structure } = this.state;
    if (!this.validateInput(input) || !this.validateLastInput(input) || !this.validateAction(input)) {
      return;
    }
    const inputs = input.split('/');
    this.addDirectory(structure, inputs);
  }

  addDirectory (currentDirectory, inputs) {
    const { structure } = this.state;
    for (let i = 1; i < inputs.length; i++) {
      if (i !== inputs.length - 1) {
        if (Object.keys(currentDirectory).includes(inputs[i])) {
          currentDirectory = currentDirectory[inputs[i]];
        } else {
          alert("You are trying to make a folder in a non existing folder. Make a folder first.");
          return false;
        }
      } else {
          if (Object.keys(currentDirectory).includes(inputs[i])) {
            alert("This folder already exists");
            return false;
          } else if (currentDirectory === 'file') {
            alert("You cannot create a folder inside a file");
            return false;
          } else {
            currentDirectory[inputs[i]] = {};
            this.setState({structure});
          }
      }
    }
    return true;
  }

  onDeleteClicked = (event) => {
    event.preventDefault();
    const { input, structure } = this.state;
    if (!this.validateInput(input) || !this.validateLastInput(input) || !this.validateAction(input)) {
      return;
    }
    this.removeFile(structure, input);
  }

  removeFile(currentDirectory, input) {
    const { structure, links, reverseLink } = this.state;
    const inputs = input.split('/');
    let reverseKey = ''
    for (let i = 1; i < inputs.length; i++) {
      if (i !== inputs.length - 1) {
        if (Object.keys(currentDirectory).includes(inputs[i])) {
          currentDirectory = currentDirectory[inputs[i]];
        } else {
          alert("You are trying to delete a non existing file.");
          return false;
        } 
      } else {
          if (Object.keys(currentDirectory).includes(inputs[i])) {
            delete currentDirectory[inputs[i]];
            this.setState({structure});
          } else {
            console.log(JSON.stringify(currentDirectory))
            console.log(inputs[i])
            alert("You are trying to delete a non existing file. Make a file first.");
            return false;
          } 
      }
    }
    if (Object.keys(links).includes(input)) {
      reverseKey = links[input][0];
      let inputs = reverseKey.split('/');
      this.removeFile(structure, reverseKey);
      delete links[input];
    } else if (Object.keys(reverseLink).includes(input)) {
      reverseKey = reverseLink[input][0];
      let inputs = reverseKey.split('/');
      delete reverseLink[input];
    }
    if (Object.keys(reverseLink).includes(reverseKey)) {
      delete reverseLink[reverseKey];
    } else if (Object.keys(links).includes(reverseKey)) {
      delete links[reverseKey];
    }
    return true;
  }

  onLinkClicked = (event) => {
    event.preventDefault();
    const { input, structure, links, reverseLink } = this.state;
    if (!this.validateInput(input)) {
      return;
    }
    if (!input.includes(" ")) {
      alert("You are clicking to the wrong button. You might want to do 'Add File', 'Add Directory', or 'Delete' operation");
      return;
    }

    const inputs = input.split(' ');
    if (!this.validateLastInput(inputs[0]) || !this.validateLastInput(inputs[1])) {
      return;
    }
    if (Object.keys(links).includes(inputs[1])) {
      alert("You cannot perform this operation. This input will make a symbolic link loop.");
      return;
    }

    const destination = inputs[1].split('/');
    let currentDirectory = structure;
    const source = inputs[0].split('/');
    let childDirectory = structure;
    let parentDirectory = structure;

    if (source[source.length - 1] === destination[destination.length - 1]) {
      for (let i = 1; i < source.length; i++) {
        if (i !== source.length - 1) {
          if (Object.keys(currentDirectory).includes(source[i])) {
            currentDirectory = currentDirectory[source[i]];
          } else {
            alert("You are trying to move a non existing file. Make a file first.");
            return;
          } 
        } else {
            if (Object.keys(currentDirectory).includes(source[i])) {
              let current = source[i];
              let parent = destination;
              if (currentDirectory[current] === 'file'){
                if(!this.addFile(parentDirectory, parent)) {
                  return;
                }
              } else {
                if (!this.addDirectory(parentDirectory, parent)) {
                  return;
                }
              }
              if (!Object.keys(links).includes(inputs[0])) {
                links[inputs[0]] = [];
                links[inputs[0]].push(inputs[1]);
              }
              else {
                links[inputs[0]].push(inputs[1]);
              }
              if (!Object.keys(reverseLink).includes(inputs[1])) {
                reverseLink[inputs[1]] = [];
                reverseLink[inputs[1]].push(inputs[0]);
              }
              else {
                reverseLink[inputs[1]].push(inputs[0]);
              }
              childDirectory = currentDirectory;
              childDirectory = childDirectory[current];
              this.linkChildren(childDirectory, parent);
              this.setState({structure});
              this.setState({links});
              this.setState({reverseLink});
            } else {
              alert("You are trying to move a non existing file. Make a file first.");
              return;
            } 
        }
      }
    } else {
      alert ("Link file and symbolic file should have the same name");
      return;
    }
  }

  linkChildren (childDirectory, parent) {
    const { structure } = this.state;
    let children = Object.keys(childDirectory);

    if (children.length === 0 || childDirectory === "file") {
      return;
    }

    for (let i = 0; i < children.length; i++) {
      let childInput = parent;
      childInput.push(children[i]);
      if (childDirectory[children[i]] === "file") {        
        if(!this.addFile(structure, childInput)) {
          return;
        }
      }
      else {
        if (!this.addDirectory(structure, childInput)) {
          return;
        }
      }
      const newDirectory = childDirectory[children[i]];
      this.linkChildren(newDirectory, childInput);
    }
    this.setState({structure});
  }

  onMoveClicked = (event) => {
    event.preventDefault();
    const { input, structure } = this.state;
    if (!this.validateInput(input)) {
      return;
    }
    if (!input.includes(" ")) {
      alert("You are clicking to the wrong button. You might want to do 'Add File', 'Add Directory', or 'Delete' operation");
      return;
    }
    const inputs = input.split(' ');
    if (!this.validateLastInput(inputs[0])) {
      return;
    }
    const destination = inputs[1].split('/');
    let currentDirectory = structure;
    const source = inputs[0].split('/');
    let childDirectory = structure;
    let parentDirectory = structure;

    if (!this.checkRootDir(inputs[1])) {
      if (!this.validateLastInput(inputs[1])) {
        return;
      } else {
        for (let i = 1; i < source.length; i++) {
          if (i !== source.length - 1) {
            if (Object.keys(currentDirectory).includes(source[i])) {
              currentDirectory = currentDirectory[source[i]];
            } else {
              alert("You are trying to move a non existing file. Make a file first.");
              return;
            } 
          } else {
              if (Object.keys(currentDirectory).includes(source[i])) {
                let current = source[i];
                let parent = destination;
                parent.push(current);
                if (currentDirectory[current] === 'file'){
                  if(!this.addFile(parentDirectory, parent)) {
                    return;
                  }
                } else {
                  if (!this.addDirectory(parentDirectory, parent)) {
                    return;
                  }
                }
                childDirectory = currentDirectory;
                childDirectory = childDirectory[current];
                this.moveChildren(childDirectory, parent);
                delete currentDirectory[source[i]];
                this.setState({structure});
              } else {
                alert("You are trying to move a non existing file. Make a file first.");
                return;
              } 
          }
        }
      }
    }
    else {
      // root case
      for (let i = 1; i < source.length; i++) {
        if (i !== source.length - 1) {
          if (Object.keys(currentDirectory).includes(source[i])) {
            currentDirectory = currentDirectory[source[i]];
          } else {
            alert("You are trying to move a non existing file. Make a file first.");
            return;
          } 
        } else {
            if (Object.keys(currentDirectory).includes(source[i])) {
              let current = source[i];
              let parent = [""];
              parent.push(current);
              if (currentDirectory[current] === 'file'){
                if(!this.addFile(parentDirectory, parent)) {
                  return;
                }
              } else {
                if (!this.addDirectory(parentDirectory, parent)) {
                  return;
                }
              }
              childDirectory = currentDirectory;
              childDirectory = childDirectory[current];
              this.moveChildren(childDirectory, parent);
              delete currentDirectory[source[i]];
              this.setState({structure});
            } else {
              alert("You are trying to move a non existing file. Make a file first.");
              return;
            } 
        }
      }
    }
  }

  moveChildren (childDirectory, parent) {
    const { structure } = this.state;
    if (childDirectory === "file") {
      return;
    }
    let children = Object.keys(childDirectory);
    if (children.length === 0) {
      return;
    }
    for (let i = 0; i < children.length; i++) {
      let childInput = parent;
      childInput.push(children[i]);
      if (childDirectory[children[i]] === 'file') {        
        if(!this.addFile(structure, childInput)) {
          return;
        }
      }
      else {
        if (!this.addDirectory(structure, childInput)) {
          return;
        }
      }
      const newDirectory = childDirectory[children[i]];
      this.moveChildren(newDirectory, childInput);
    }
    this.setState({structure});
  }

  onChangeClicked = (event) => {
    event.preventDefault();
    const { input, structure, properties } = this.state;
    if (!this.validateInput(input)) {
      return;
    }
    if (!input.includes(" ")) {
      alert("You are clicking to the wrong button. You might want to do 'Add File', 'Add Directory', or 'Delete' operation");
      return;
    }
    const inputs = input.split(' ');
    if (!this.validateLastInput(inputs[0])) {
      return;
    }
    let propertyArr = Object.keys(properties);
    let foundProperty = false;
    for (let i = 0; i < propertyArr.length; i++) {
      if (inputs[1] === propertyArr[i]) {
        foundProperty = true;
      }
    }
    if (!foundProperty) {
      alert("Cannot change this kind of property. Try another.");
      return;
    }
    else {
      const dir = inputs[0].split('/');
      let currentDirectory = structure;
      for (let i = 1; i < dir.length; i++) {
        if (i !== dir.length - 1) {
          if (Object.keys(currentDirectory).includes(dir[i])) {
            currentDirectory = currentDirectory[dir[i]];
          } else {
            alert("You are trying to change the property of a non existing file. Make a file first.");
            return;
          }
        } else {
            if (Object.keys(currentDirectory).includes(dir[i])) {
              let inputDirectory = inputs[0];
              properties['hide'].push(inputDirectory);
              this.setState(properties);
              let current = dir[i];
              currentDirectory = currentDirectory[current];
              this.handleProperties(currentDirectory, inputDirectory);
            } else {
              alert("You are trying to change the property of a non existing file. Make a file first.");
              return;
            }
          }
      }
    }
  }

  handleProperties (currentDirectory, inputDirectory) {
    const { properties } = this.state;
    if (currentDirectory === "file") {
      return;
    }
    let children = Object.keys(currentDirectory);
    if (children.length === 0) {
      return;
    }
    for (let i = 0; i < children.length; i++) {
      properties['hide'].push(inputDirectory + "/" + children[i]);
      const newDirectory = currentDirectory[children[i]];
      this.handleProperties(newDirectory, inputDirectory);
    }
    this.setState({properties});
  }

  render() {
    const { structure, properties, links, reverseLink } = this.state;
    return (
      <div className="app">
        <body className="app-body">
            <form>
              <div class="input">
                <input
                  type="text"
                  id="inputText"
                  placeholder="Type your input"
                  onChange={event => this.setState({input: event.target.value})}
                />
              </div>
              <div class="buttons">
                <button className="btn" onClick={ (event) => {this.onAddFileClicked(event)}}>Add File</button>
                <button className="btn" onClick={ (event) => {this.onAddDirectoryClicked(event)}}>Add Directory</button>
                <button className="btn" onClick={ (event) => {this.onDeleteClicked(event)}}>Delete</button>
                <button className="btn" onClick={ (event) => {this.onLinkClicked(event)}}>Link</button>
                <button className="btn" onClick={ (event) => {this.onMoveClicked(event)}}>Move</button>
                <button className="btn" onClick={ (event) => {this.onChangeClicked(event)}}>Change</button>
              </div>
          </form>
          <TreeView
            structure={structure}
            properties={properties}
            links={links}
            reverseLink={reverseLink}
          />
        </body>
      </div>
    );
  }
}

export default App;
