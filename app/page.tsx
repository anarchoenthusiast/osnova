"use client";

import { useEffect, useState } from "react";
import {
  BuilderComponent,
  builder,
  useIsPreviewing,
  BuilderContent,
} from "@builder.io/react";

// Инициализация API-ключа Builder
builder.init("c763765c596a4967820eae055a836967");

export default function CatchAllRoute() {
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState<BuilderContent | undefined>(undefined);

  useEffect(() => {
    async function fetchContent() {
      if (typeof window !== "undefined") {
        // Проверяем наличие window для предотвращения ошибок на сервере
        const content = await builder
          .get("page", {
            url: window.location.pathname,
          })
          .promise();

        setContent(content || undefined); // Присваиваем undefined, если content = null
        setNotFound(!content);

        if (content?.data.title) {
          document.title = content.data.title;
        }
      }
    }
    fetchContent();
  }, []); // Убираем `window.location.pathname` из зависимостей

  if (notFound && !isPreviewingInBuilder) {
    return <div>Страница не найдена</div>; // Обработка ошибки отсутствия страницы
  }

  return (
    <>
      {content ? (
        <BuilderComponent model="page" content={content} />
      ) : (
        <div>Загрузка...</div> // Индикатор загрузки
      )}
    </>
  );
}
