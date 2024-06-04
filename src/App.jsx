import Select from "react-select";
import { FaExchangeAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { getLanguages, translateText } from "./redux/actions";
import { clearText } from "./redux/slices/translateSlice";
import React from "react";
import { toast } from "react-toastify";

function App() {
  const dispatch = useDispatch();
  const areaRef = useRef();

  const translateState = useSelector((store) => store.translateReducer);

  const { error, isLoading, languages } = useSelector(
    (store) => store.languageReducer
  );

  const [sourceLang, setSourceLang] = useState({
    label: "Turkish",
    value: "tr",
  });
  const [targetLang, setTargetLang] = useState({
    label: "English",
    value: "en",
  });

  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(getLanguages());
  }, []);

  /*
   * Dil dizisini bizden istenilen formata çevirmek için "map" ile döndük.
   * Dizinin içerisinde her bir elemanın "code" ve "name" değerlerini "value" ve "label" değerlerine çevirdik.
   * Diziyi formatlama işleminde her render sırasında formatlama olmasını istemediğimiz için "useMemo" kullanarak cache'e gönderdik.
   */

  const formatted = useMemo(
    () =>
      languages?.map((lang) => ({
        value: lang.code,
        label: lang.name,
      })),
    [languages]
  );

  //* Select alanlarıındaki verilerin yer dğişimi;
  const handleChange = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);

    //* ikinci area temizlenir
    dispatch(clearText());

    //* ilk area temizlenir
    areaRef.current.value = "";
  };
  //* verileri  apı'ye bildirme;
  const handleTranslate = () => {
    if (text.trim() === "") {
      toast.error("Çevirilecek metni yazınız!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    } else {
      dispatch(translateText({ sourceLang, targetLang, text }));
    }
  };

  return (
    <div className="bg-zinc-800 h-screen grid place-items-center text-white">
      <div className="flex flex-col justify-center w-[80vw] max-w-[500px]">
        <h1 className="title text-center font-bold text-2xl mb-10">Çeviri +</h1>
        {/* üst kısım */}
        <div className="flex justify-between gap-2 ">
          <Select
            className="w-full  text-black"
            onChange={(e) => setSourceLang(e)}
            value={sourceLang}
            options={formatted}
            isLoading={translateState.isLoading}
            isDisabled={translateState.isLoading}
          />
          <button
            onClick={handleChange}
            className="bg-zinc-900 px-5 rounded-lg hover:opacity-75 transition"
          >
            <FaExchangeAlt />
          </button>
          <Select
            className="w-full  text-black"
            onChange={(e) => setTargetLang(e)}
            value={targetLang}
            options={formatted}
            isLoading={translateState.isLoading}
            isDisabled={translateState.isLoading}
          />
        </div>
        {/* text kısımı */}
        <div className="flex flex-col justify-center my-2">
          <div>
            <textarea
              ref={areaRef}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-52 text-black p-3 border-0 outline-none rounded-lg"
            ></textarea>
          </div>
          <div>
            <textarea
              value={translateState.answer}
              disabled
              className="w-full h-52 p-3 border-0 outline-none rounded-lg"
            ></textarea>

            {translateState.isLoading && (
              <div className="loader absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] ">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            )}
          </div>
        </div>
        {/* çeviri butonu */}
        <button
          // disabled={text.trim() === ""}
          onClick={handleTranslate}
          className="bg-zinc-900 px-5 rounded-lg py-2 hover:opacity-75 transition"
        >
          Çevir
        </button>
      </div>
    </div>
  );
}

export default App;
