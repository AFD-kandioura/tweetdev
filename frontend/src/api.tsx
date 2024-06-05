import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants.js";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

type ExecuteCodeResponse = {
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
  };
  compile?: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
  };
};

export const executeCode = async (language: string, sourceCode: string): Promise<ExecuteCodeResponse> => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });

  return response.data;
};