import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  const [queryParams, setQueryParams] = useState<{ [key: string]: string }>({});
  const location = useLocation();

  useEffect(() => {
    const grabParams = () => {
      const params = new URLSearchParams(location.search);
      const newQueryParams: { [key: string]: string } = {};

      params.forEach((value, key) => {
        newQueryParams[key] = value;
      });

      setQueryParams(newQueryParams);
    };

    grabParams();

    window.addEventListener("popstate", grabParams);

    window.addEventListener("pushstate", grabParams);
    window.addEventListener("replacestate", grabParams);

    return () => {
      window.removeEventListener("popstate", grabParams);
      window.removeEventListener("pushstate", grabParams);
      window.removeEventListener("replacestate", grabParams);
    };
  }, [location.search]);

  return queryParams;
};

export { useQueryParams };
