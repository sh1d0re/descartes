# # Code regulations
## Concept
Do not admire complexity over simplicity. Keep the code clean with easy syntax.
Use functional programing. Frequently make helpers, but never with easy functions, such as helpers that only has 3 lines or something.
## Comments
Only add comments if really neccessary. Such as doing complex functions, or temporary codes for debug.
## Naming/Labling text.
Use non-hiphened capitalization splitted naming. (e.g. appleSauce, exampleText, oneTwoThreeFour, etc.)
## Functions
This code positions itself in `electron/descartes.cjs`. The code exports its code as a function to `electron/main.cjs`, and would be used in the form `functionName(var1, var2, varN)`.
# Descartes Main Function
**Main objective:** `Write a common JavaScript code, where it receives an input, forms and structizes a prompt, sends it to LLM APIs, and saves the output into a specific file.`
## Usage
`runDescartes(fileName, providerName, apiToken)`
## Functional Input
`fileName`
> Only takes valid existing directories (check if the file exists. if no, return with error)

`providerName`
> Inputs only `openai` or `claude` or `gemini` are allowed

`apiToken`
> Do **NOT** cache ANY of this into any file. It is one and done.
## Functional Output
1. The output of the AI into the file.
> The file name must be saved into a file named as same as the original file name with a .dcrt file extension.
> (e.g) fileName.dcrt (imported: fileName.txt), appleSauce.dcrt (imported: appleSauce.md), etc.

# Descartes Interactive Mode Initialization
## Usage
`startSession(fileName, providerName, apiToken)`
## Functional Input
`fileName`
> Only takes valid existing directories (check if the file exists. if no, return with error)

`providerName`
> Inputs only `openai` or `claude` or `gemini` are allowed

`apiToken`
> Do **NOT** cache ANY of this into any file. It is one and done.
## Functional Output
Initialize a session with the `providerName` using the `apiToken`. Send a prompt, but never write in anything.

# Interactive Mode Conversation
## Usage
`runDescartesWithPart(prompt)`
## Functional Input
`prompt`
> A string. This would be used as a part of a parent prompt, but it would be written later. Make it so that it can be extended in the future easily, such as setting it as a variable for now.
## Functional Output
Using the initialized session from the function `startSession()`, send another prompt to that initialized session from `prompt`, and add the AI response to the whatever the name which was initialized at the `startSession()` function (e.g `fileName.dcrt`)
### Addendum
You are allowed to add on functional input variables. I am not sure if only one variable can take on this. If impossible, try using session IDs within the content.

### Addendum 2
Also, you are allowed to add another function such as `closeSession()` if neccessary.