import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const getLanguages = createAsyncThunk(
  "languages/getLanguages",

  async () => {
    //* apı'a istek atma;
    const res = await api.get("/getLanguages");

    const languages = res.data.data.languages;

    //* stora gönderilecek değeri return edilir.
    return languages;
  }
);

export const translateText = createAsyncThunk("translate", async (p) => {
  //* API 'ye gönderilecek olan parametreleri belirleme;
  const params = new URLSearchParams();
  params.set("source_language", p.sourceLang.value);
  params.set("target_language", p.targetLang.value);
  params.set("text", p.text);

  //* API'ye gönderilecek olan "headers" belirledik.
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
  };

  //* API 'ye istek at;
  const res = await api.post("/translate", params, { headers });

  //* payloadı belirle;

  return res.data.data.translatedText;
});
