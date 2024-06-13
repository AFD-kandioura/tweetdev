import React, {useRef, useState} from "react";
import {Box, Button, HStack} from "@chakra-ui/react";
import {Editor, Monaco} from "@monaco-editor/react";
import axios from "axios";
import LanguageSelector from "./LanguageSelector";
import {CODE_SNIPPETS} from "../constants";
import Output from "./Output";

const CodeEditor: React.FC = () => {
    const editorRef = useRef<Monaco | null>(null);
    const [value, setValue] = useState<string>("");
    const [language, setLanguage] = useState<string>("javascript");
    const [output, setOutput] = useState<string>("");

    const onMount = (editor: Monaco) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (language: string) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
    };

    const runCode = async () => {
        try {
            const response = await axios.post("http://localhost:3000/run", {
                code: value,
                language,
            });
            setOutput(response.data.output);
        } catch (error) {
            setOutput(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <Box>
            <HStack spacing={4}>
                <Box w="50%">
                    <LanguageSelector language={language} onSelect={onSelect}/>
                    <Editor
                        options={{
                            minimap: {
                                enabled: false,
                            },
                        }}
                        height="75vh"
                        theme="vs-dark"
                        language={language}
                        defaultValue={CODE_SNIPPETS[language]}
                        onMount={onMount}
                        value={value}
                        onChange={(value) => setValue(value || "")}
                    />
                    <Button onClick={runCode} mt={4}>Run</Button>
                </Box>
                <Output output={output}/>
            </HStack>
        </Box>
    );
};

export default CodeEditor;
