import { useState, useEffect } from "react";
// import FileUpload from "../components/Upload/FileUpload";
import ImageUpload from "../components/Upload/ImageUpload";
import { useAtom } from "jotai";
import { headerAtom } from "../jotai/webScrapeAtoms";
import InfoSvg from "../assets/infoicon";

function Caption() {
  const [, setHeaderAtom] = useAtom(headerAtom);

  const [image, setImage] = useState<string>("");

  useEffect(() => {
    setHeaderAtom(true);
  }, [setHeaderAtom]);

  return (
    <div className="">  
        <>
           <ImageUpload />
        </>
        
        
    </div>
  );
}

export default Caption;
