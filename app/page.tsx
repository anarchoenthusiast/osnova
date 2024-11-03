"use client";

import { useEffect, useState } from "react";
import {
  BuilderComponent,
  builder,
  useIsPreviewing,
  BuilderContent,
} from "@builder.io/react";

// Инициализация вашего API ключа Builder
builder.init("c763765c596a4967820eae055a836967");

export default function CatchAllRoute() {
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState<BuilderContent | null>(null);

  useEffect(() => {
    async function fetchContent() {
      if (typeof window !== "undefined") {
        // Проверяем наличие window
        const content = await builder
          .get("page", {
            url: window.location.pathname,
          })
          .promise();

        setContent(content);
        setNotFound(!content);

        if (content?.data.title) {
          document.title = content.data.title;
        }
      }
    }
    fetchContent();
  }, []); // Убираем `window.location.pathname` из зависимостей

  if (notFound && !isPreviewingInBuilder) {
    return <div>Страница не найдена</div>;
  }

  return (
    <>
      {content ? (
        <BuilderComponent model="page" content={content} />
      ) : (
        <div>Загрузка...</div> // Заглушка для отображения загрузки
      )}
    </>
  );
}
