#File and Directory Management Web App

##Project Description

This project introduces a web-based interface for managing files and directories through a set of predefined commands. It simplifies user interaction by providing an input box for commands and buttons for specific operations, facilitating common file system tasks like adding, deleting, linking, moving, and changing properties of files and directories.

##Features

1. User Input Box: Accepts commands related to file and directory operations.
2. Operation Buttons:
   
- Add File: Adds a new file to the given path. Files are displayed in gray. Example: /fileName
- Add Directory: Creates a new directory. Directories are added similarly to files.
Example: /directoryName
- Delete: Removes a file or directory, including any contents if it's a directory.
Example: /fileName or /directoryName
- Link: Creates a symbolic link for a file or directory to another location. Linked items are shown in red.
Example: /sourcePath /destinationPath
- Move: Moves a file or directory to a new location.
Example: /sourcePath /destinationPath
- Change: Alters the property of a file or directory (currently supports "hide" property).
Example: /fileName hide or /directoryName hide

3. Exceptions Handled
  
- Input Validation: Ensures inputs are valid paths and handles duplicates and non-existent directories.
- Function Validation: Validates the appropriateness of the operation based on the input.

##Technology and Environment

- React JS: Used for creating the interactive web page and managing state.
- Styled-components: Utilized for dynamic styling, enhancing the UI based on operation outcomes.
