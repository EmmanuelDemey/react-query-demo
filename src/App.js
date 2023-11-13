import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const { isPending, data, next, previous } = usePeople();
  const [editedPerson, setEditedPerson] = useState();

  const { isPending: isSaving, mutate } = useMutation({
    mutationFn: (person) => {
      return fetch("http://localhost:3000/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries(["people", 1]);
    },
  });

  if (isPending) {
    return <p>Loader....</p>;
  }

  if (isSaving) {
    return <p>Saving....</p>;
  }

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
        <form
          onSubmit={(e) => {
            e.preventDefault();

            mutate(editedPerson);
          }}
        >
          <label>
            name
            <input
              onChange={(e) => setEditedPerson({ ...editedPerson, name: e.target.value })}
              value={editedPerson.name}
            />
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
