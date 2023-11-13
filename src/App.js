import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const usePeople = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { isPending, data } = useQuery({
    queryKey: ["people", currentPage],
    queryFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return fetch("http://localhost:3000?page=" + currentPage)
            .then((response) => response.json())
            .then((data) => resolve(data));
        }, 2000);
      });
    },
  });
  return {
    isPending,
    data,
    previous: () => setCurrentPage(currentPage - 1),
    next: () => setCurrentPage(currentPage + 1),
  };
};

function PeopleList() {
  const { isPending, data, next, previous } = usePeople();
  const [editedPerson, setEditedPerson] = useState();
  if (isPending) {
    return <p>Loader....</p>;
  }

  const onSubmitHandler = () => {
    // isPending
  };

  return (
    <>
      <button onClick={() => previous()}> Previous Page </button>
      <button onClick={() => next()}> Next Page </button>
      <ul>
        {data?.map((d) => (
          <li>
            <button onClick={() => setEditedPerson(d)}>{d.name}</button>
          </li>
        ))}{" "}
      </ul>

      {editedPerson && (
        <form onSubmit={onSubmitHandler}>
          <label>
            name
            <input onChange={() => {}} value={editedPerson.name} />
          </label>
          <button> Valider </button>
        </form>
      )}
    </>
  );
}

function App() {
  return <PeopleList></PeopleList>;
}

export default App;
