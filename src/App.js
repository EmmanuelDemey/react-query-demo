import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

function PeopleList() {
  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, data } = useQuery({
    queryKey: ["people", currentPage],
    queryFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return fetch("http://localhost:3000?page=" + currentPage)
            .then((response) => response.json())
            .then((data) => resolve(data));
        }, 5000);
      });
    },
  });
  if (isPending) {
    return <p>Loader....</p>;
  }

  return (
    <>
      <button onClick={() => setCurrentPage(currentPage - 1)}> Previous Page </button>
      <button onClick={() => setCurrentPage(currentPage + 1)}> Next Page </button>
      <ul>
        {data?.map((d) => (
          <li>{d.name}</li>
        ))}{" "}
      </ul>
    </>
  );
}

function App() {
  return <PeopleList></PeopleList>;
}

export default App;
