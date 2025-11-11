# Code regulations
## Concept
Do not admire complexity over simplicity. Keep the code clean with easy syntax.
Use functional programing. Frequently make helpers, but never with easy functions, such as helpers that only has 3 lines or something.
## Comments
Only add comments if really neccessary. Such as doing complex functions.
## Naming/Labling text.
Name main typescript functions with pascal naming. (e.g. FunctionName, AppleSauce, ExampleText, OneTwoThreeFour, etc.)
If naming normal css classes, div names, variable (const) names, use non-hiphened capitalization splitted naming. (e.g. className, appleSauce, exampleText, oneTwoThreeFour, etc.)
# Import box function
**Main objective:** `Write a typescript file, where I can drag and drop a file to the "selectionBox" class/box.`
## Drag-and-drop box
### Design 
Use the selectionBox class from css for unified design.
### Function
If the drag box was clicked, show a file selection screen using stuff like finder, native linux file finders, etc.
If a file is drag-and-dropped, simply load it in.

Then do:
#### Filetype check
Check the file type if it is either txt, docx, md, pdf, or any other document type filetype.
#### If unsupported filetype was loaded in:
Filetypes such as audio, images, video are not accepted. If files like that were loaded in, show a text with a red box "This filetype is not accepted", and fade out after 5 seconds.

## If a file is dropped
Save it to some **proper** folder directory. This is temporary. Make it easy to change later on

## File passing and child process
Pass the file to a child process written in Python. The python file would be written shortly, but it is currently named `main.py` located under `src/`. I want you to send this file directory into the python folder as a string via sys.argv parsing. If impossible, I want you to use something such as piping for the child process.

## Directory location
I want all of the imported files organized in a json file within the electron app. 
The data structure should look like this for each loaded file:
```json
{
    "Imported Script (1)": {
        "fileDirectory": "/.../.../example_document.pdf",
        "description": "",
        "addedAt": "2025/1/1",
        "lastInteractedAt": "2025/1/2"
    },
    "Imported Script (2)": {
        "fileDirectory": "/.../.../example_document_2.pdf",
        "description": "",
        "addedAt": "2025/1/2",
        "lastInteractedAt": "2025/1/3"
    },
    ...
    "Imported Script (n)": {
        "fileDirectory": "/.../.../example_document_n.pdf",
        "description": "",
        "addedAt": "2025/1/n",
        "lastInteractedAt": "2025/1/n+5"
    },
}
```

## Rendering file data
Interpret the json file, and show the document with a `selectionBox` class from the `ImportBox.css`.
```tsx
<div className="selectionBox">
    <img className="documentLogo" src="document.svg" draggable="false"/>
    <p>Imported Script (1)</p>
    <p>Description text</p>
    <p>Added at: 2025/1/1</p>
    <p>Last interacted at: 2025/1/2</p>
    <img className="deleteLogo" src="trashbin.svg" onClick={handleDeleteFile}>
</div>
```
```tsx
<div className="selectionBox">
    <img className="documentLogo" src="document.svg" draggable="false"/>
    <p>Imported Script (n)</p>
    <p>Description text example text blah blah blah</p>
    <p>Added at: 2025/1/n</p>
    <p>Last interacted at: 2025/1/n+1</p>
    <img className="deleteLogo" src="trashbin.svg" onClick={handleDeleteFile}>
</div>
```