// import { Configuration, OpenAIApi } from "openai";

// const openai = (apiKey: string) => {
//   const configuration = new Configuration({
//     apiKey,
//   });
//   return new OpenAIApi(configuration);
// };

// export default openai;

import OpenAI from 'openai';

const openai = (apiKey: string) => {
  return new OpenAI({apiKey: apiKey});
};

export default openai;