import { Editor } from "@tiptap/react";
import { EditorOptions } from "@tiptap/core";
import { DependencyList, useEffect, useState } from "react";

function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export const useEditor = (
  options: Partial<EditorOptions> = {},
  deps: DependencyList = []
) => {
  const [editor, setEditor] = useState<Editor>(() => new Editor(options));
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    let instance: Editor;

    if (editor.isDestroyed) {
      instance = new Editor(options);
      setEditor(instance);
    } else {
      instance = editor;
    }

    instance.on("transaction", () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          forceUpdate();
        });
      });
    });

    return () => {
      instance.destroy();
    };
  }, []);

  return editor;
};