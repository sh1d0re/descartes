const OpenAI = require("openai")
const Anthropic = require("@anthropic-ai/sdk")
const { GoogleGenerativeAI } = require("@google/generative-ai")
const fs = require("fs").promises

let activeSession = null

async function validateFile(path) {
    try {
        await fs.access(path)
        return true
    } catch {
        return false
    }
}

function validateProvider(provider) {
    if (provider !== "openai" && provider !== "claude" && provider !== "gemini") {
        throw new Error("Invalid provider")
    }
}

function getClient(provider, token) {
    if (provider === "openai") {
        return new OpenAI({ apiKey: token })
    }
    if (provider === "claude") {
        return new Anthropic({ apiKey: token })
    }
    if (provider === "gemini") {
        return new GoogleGenerativeAI(token)
    }
}

function getOutputName(fileName) {
    const split = fileName.split(".")
    split.pop()
    return split.join(".") + ".dcrt"
}

async function readFileContent(path) {
    const content = await fs.readFile(path, "utf-8")
    return content
}

async function appendOutput(fileName, text) {
    const outputName = getOutputName(fileName)
    await fs.appendFile(outputName, text + "\n")
}

async function runDescartes(fileName, providerName, apiToken) {
    console.log("Running descartes on", providerName)
    const valid = await validateFile(fileName)
    if (!valid) throw new Error("File does not exist")
    validateProvider(providerName)

    const client = getClient(providerName, apiToken)
    const fileContent = await readFileContent(fileName)
    const outputName = getOutputName(fileName)

    let prior = ""
    try {
        prior = await fs.readFile(outputName, "utf-8")
    } catch {}

    const prompt = `${prior}\n\nFile content:\n${fileContent}\n\nRespond based on above.`
    console.log(prompt)

    let responseText = ""
    if (providerName === "openai") {
        const res = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
        })
        responseText = res.choices[0].message.content
    } else if (providerName === "claude") {
        const res = await client.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 4096,
            messages: [{ role: "user", content: prompt }]
        })
        responseText = res.content[0].text
    } else if (providerName === "gemini") {
        const model = client.getGenerativeModel({ model: "gemini-2.0-flash-lite" })
        const res = await model.generateContent(prompt)
        responseText = res.response.text()
        console.log(responseText)
    }

    await appendOutput(fileName, responseText)
}

async function startSession(fileName, providerName, apiToken) {
    const valid = await validateFile(fileName)

    if (!valid) throw new Error("File does not exist")

    validateProvider(providerName)
    const client = getClient(providerName, apiToken)
    const outputName = getOutputName(fileName)
    activeSession = { fileName, providerName, client, outputName }
}

async function runDescartesWithPart(prompt) {
    if (!activeSession) throw new Error("No active session")
    const { fileName, providerName, client, outputName } = activeSession

    let prior = ""
    try {
        prior = await fs.readFile(outputName, "utf-8")
    } catch {}

    const fullPrompt = `${prior}\n\n${prompt}`

    let responseText = ""
    if (providerName === "openai") {
        const res = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: fullPrompt }]
        })
        responseText = res.choices[0].message.content
    } else if (providerName === "claude") {
        const res = await client.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 2048,
            messages: [{ role: "user", content: fullPrompt }]
        })
        responseText = res.content[0].text
    } else if (providerName === "gemini") {
        const model = client.getGenerativeModel({ model: "gemini-2.0-flash-lite" })
        const res = await model.generateContent(fullPrompt)
        responseText = res.response.text()
    }
    console.log(responseText)
    await appendOutput(fileName, responseText)
}

function closeSession() {
    activeSession = null
}

module.exports = {
    runDescartes,
    startSession,
    runDescartesWithPart,
    closeSession
}
