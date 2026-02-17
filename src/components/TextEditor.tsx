import React, { useRef, useState, useEffect } from "react";

const RichTextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [content, setContent] = useState("<|im_start|>ขวา<|im_start|>่่เพื่อ<|im_start|>ปโหลดไฟล์");

  // Sync content changes from contentEditable to React state
  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Update DOM when content state changes (for programmatic updates)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClick = () => {
    setMenuPosition(null);
  };

  const handleMenuClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = document.createElement("img");
        img.src = reader.result as string;
        img.style.maxWidth = "100px";
        
        if (editorRef.current) {
          editorRef.current.appendChild(img);
          // Update React state to match DOM
          setContent(editorRef.current.innerHTML);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("<|im_start|>เฉพาะไฟล์<|im_start|>ภาพเท่า�ん");
    }
  };

  const handleSend = () => {
    console.log(content);
  };


  return (
    <div>
      <div onClick={handleClick} style={{ padding: 20 }}>
        {/* Editable Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onContextMenu={handleContextMenu}
          suppressContentEditableWarning={true}
          style={{
            border: "1px solid #ccc",
            minHeight: 150,
            padding: 10,
            borderRadius: 4,
            maxWidth: 600,
            whiteSpace: "pre-wrap"
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Context Menu */}
        {menuPosition && (
          <div
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.x,
              background: "#fff",
              border: "1px solid #ccc",
              padding: "5px 10px",
              cursor: "pointer",
              zIndex: 1000,
              borderRadius: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            onClick={handleMenuClick}
          >
            📁 Upload Image
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      <button 
        type="button" 
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        onClick={handleSend}
      >
        Test Data
      </button>
    </div>
  );
};

export default RichTextEditor;
